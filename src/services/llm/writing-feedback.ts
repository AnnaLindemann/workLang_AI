// Writing-feedback generation: prompt assembly + primary→fallback orchestration.
//
// This is the provider-facing half of Phase 7 (no database access). It builds
// the prompt from the shared framing in docs/prompts.md, calls the primary Groq
// model, and falls back to the secondary model on any failure — including a
// malformed structured output that fails Zod validation. The returned data is
// already validated; persistence and logging live in the storage layer.

import type { CareerTrack, Language } from "@/types";
import {
  CareerTrack as CareerTrackEnum,
  Language as LanguageEnum,
} from "@/types";
import type { TokenUsage } from "@/types";

import { getGroqConfig } from "./config";
import { LlmError } from "./errors";
import { callGroqStructured } from "./groq-client";
import {
  WRITING_FEEDBACK_SCHEMA_NAME,
  writingFeedbackJsonSchema,
  writingFeedbackZodSchema,
  type WritingFeedbackData,
} from "./writing-feedback-schema";

export interface WritingFeedbackInput {
  language: Language;
  careerTrack?: CareerTrack | null;
  /** Target CEFR level for this lesson, e.g. "C1" (German) or "B2" (English). */
  targetLevel: string;
  /** The writing scenario the learner responded to. */
  prompt?: string | null;
  /** The task's requirements checklist, if any. */
  requirements?: string[];
  /** The learner's submitted text. */
  text: string;
}

export interface WritingFeedbackResult {
  data: WritingFeedbackData;
  /** The model that actually produced the accepted result. */
  model: string;
  usage: TokenUsage;
  latencyMs: number;
}

const LANGUAGE_LABEL: Record<Language, string> = {
  [LanguageEnum.German]: "German",
  [LanguageEnum.English]: "English",
};

const CAREER_TRACK_LABEL: Record<CareerTrack, string> = {
  [CareerTrackEnum.AiConsultant]: "AI Consultant",
  [CareerTrackEnum.CustomerSuccessHospitality]:
    "Customer Success / Hospitality (with an AI component)",
};

/**
 * Generate validated writing feedback. Tries the primary model, then the
 * fallback, on any provider or validation failure. Throws `LlmError` only when
 * every configured model fails, so the caller can degrade the whole request
 * gracefully while keeping the learner's writing.
 */
export async function generateWritingFeedback(
  input: WritingFeedbackInput,
): Promise<WritingFeedbackResult> {
  const config = getGroqConfig();
  const system = buildSystemPrompt(input);
  const user = buildUserPrompt(input);

  // Primary then fallback; de-duplicated in case both env vars point at one id.
  const models = [config.primaryModel, config.fallbackModel].filter(
    (model, index, all) => all.indexOf(model) === index,
  );

  let lastError: unknown;
  for (const model of models) {
    try {
      const call = await callGroqStructured({
        model,
        system,
        user,
        schemaName: WRITING_FEEDBACK_SCHEMA_NAME,
        jsonSchema: writingFeedbackJsonSchema,
      });

      const parsed = writingFeedbackZodSchema.safeParse(call.data);
      if (!parsed.success) {
        // A malformed structured output: record it and try the next model.
        lastError = new LlmError(
          "invalid_response",
          `Writing feedback failed schema validation (${model}): ${parsed.error.message}`,
        );
        continue;
      }

      return {
        data: parsed.data,
        model: call.model,
        usage: call.usage,
        latencyMs: call.latencyMs,
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof LlmError
    ? lastError
    : new LlmError("provider", "All Groq models failed", lastError);
}

function buildSystemPrompt(input: WritingFeedbackInput): string {
  const language = LANGUAGE_LABEL[input.language];
  const track = input.careerTrack
    ? CAREER_TRACK_LABEL[input.careerTrack]
    : "a working professional";

  const lines = [
    "You are WorkLang AI, a professional language coach for a working professional.",
    `Language: ${language}. Target level: ${input.targetLevel}.`,
    `Career track: ${track}.`,
    "Be precise, encouraging, and practical. Focus on professional, real-work usage.",
    "Do not invent facts about the learner. Prefer concise, structured answers.",
    "Write all feedback, the CEFR reasoning, and every mistake explanation in Russian.",
    `Write the improved rewrite in ${language}, preserving the learner's intent.`,
    "Report only genuine errors as mistakes; if the text is clean, return an empty mistakes array.",
    "Group each mistake as one of: grammar, vocabulary, register, clarity. Set severity to LOW, MEDIUM, or HIGH.",
    "For every mistake, put the fully corrected phrase in `expected` and the learner's original phrase in `given`; never leave `expected` as a bare label like 'wrong article'.",
  ];

  if (input.language === LanguageEnum.German) {
    lines.push(
      // Article/gender/case mistakes must be actionable: the learner has to see
      // the correct article next to the noun, not just "wrong article".
      'German article, noun-gender, case, and noun-phrase-agreement mistakes must always name the correct article together with the noun in `expected` — e.g. "der Prozess", "die Integration", "das Ergebnis", "die Metriken" — with the learner\'s original phrase in `given` and a short Russian explanation of the gender/case in `explanation`.',
    );
  }

  return lines.join("\n");
}

function buildUserPrompt(input: WritingFeedbackInput): string {
  const parts: string[] = [];

  if (input.prompt) {
    parts.push(`Writing scenario:\n${input.prompt}`);
  }
  if (input.requirements && input.requirements.length > 0) {
    parts.push(
      `Requirements the learner was asked to cover:\n${input.requirements
        .map((requirement) => `- ${requirement}`)
        .join("\n")}`,
    );
  }
  parts.push(`Text from the learner:\n${input.text}`);
  parts.push(
    [
      "Return the structured JSON result:",
      "- cefr: estimated CEFR level and your confidence, judged against the target level;",
      "- feedback.strengths: 2-3 short strengths (Russian);",
      "- feedback.summary: the single most important thing to fix next (Russian);",
      "- improvedText: a stronger rewrite for a professional work context;",
      "- mistakes: concrete corrections with expected vs. given and a short Russian explanation.",
    ].join("\n"),
  );

  return parts.join("\n\n");
}
