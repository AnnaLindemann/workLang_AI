// The universal open-grammar mini-checker (Phase 7 follow-up).
//
// Provider-facing half only (no DB). One prompt checks EVERY open grammar
// exercise: it decides whether the student's answer is a grammatically valid
// solution that fulfils the instruction — allowing alternative correct
// formulations — and returns a small structured result. It deliberately does
// NOT do writing feedback: no business style, tone, CEFR, or long-form quality.
//
// Cost: short prompt, short response. It prefers the cheaper fallback model
// (openai/gpt-oss-20b) and only escalates to the primary model if that fails.

import type { CareerTrack, Language, TokenUsage } from "@/types";
import {
  CareerTrack as CareerTrackEnum,
  Language as LanguageEnum,
} from "@/types";

import { getGroqConfig } from "./config";
import { LlmError } from "./errors";
import { callGroqStructured } from "./groq-client";
import {
  OPEN_GRAMMAR_CHECK_SCHEMA_NAME,
  openGrammarCheckJsonSchema,
  openGrammarCheckZodSchema,
  type OpenGrammarCheckData,
} from "./open-grammar-check-schema";

export interface OpenGrammarCheckInput {
  language: Language;
  targetLevel: string;
  lessonId: string;
  grammarTopic: string;
  professionalTopic?: string | null;
  careerTrack?: CareerTrack | null;
  /** The exercise instruction/prompt. */
  instruction: string;
  /** The source sentence or task text, when distinct from the instruction. */
  sourceText?: string | null;
  sampleAnswer: string;
  studentAnswer: string;
}

export interface OpenGrammarCheckResult {
  data: OpenGrammarCheckData;
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
 * Check one open grammar answer. Prefers the cheaper fallback model, escalating
 * to the primary only on failure (including a malformed/Zod-invalid response).
 * Throws `LlmError` only when every model fails, so the caller can degrade
 * gracefully while keeping deterministic data untouched.
 */
export async function generateOpenGrammarCheck(
  input: OpenGrammarCheckInput,
): Promise<OpenGrammarCheckResult> {
  const config = getGroqConfig();
  const system = buildSystemPrompt(input);
  const user = buildUserPrompt(input);

  // Fallback (cheaper) first, then primary as the escalation; de-duplicated.
  const models = [config.fallbackModel, config.primaryModel].filter(
    (model, index, all) => all.indexOf(model) === index,
  );

  let lastError: unknown;
  for (const model of models) {
    try {
      const call = await callGroqStructured({
        model,
        system,
        user,
        schemaName: OPEN_GRAMMAR_CHECK_SCHEMA_NAME,
        jsonSchema: openGrammarCheckJsonSchema,
        // Short response; a tight cap keeps this cheap and fast.
        maxCompletionTokens: 1024,
      });

      const parsed = openGrammarCheckZodSchema.safeParse(call.data);
      if (!parsed.success) {
        lastError = new LlmError(
          "invalid_response",
          `Open grammar check failed schema validation (${model}): ${parsed.error.message}`,
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

function buildSystemPrompt(input: OpenGrammarCheckInput): string {
  const language = LANGUAGE_LABEL[input.language];
  return [
    "You are WorkLang AI's grammar checker for open-ended exercises.",
    `Language: ${language}. Target level: ${input.targetLevel}.`,
    "Judge ONLY whether the student's answer is a grammatically valid solution that fulfils the exercise instruction.",
    "Do NOT give writing feedback. Do NOT judge business style, tone, CEFR level, or long-form writing quality.",
    "Allow alternative correct formulations; do not require an exact match with the sample answer.",
    "If the answer is grammatically correct but different from the sample answer, set isCorrect=true and put the student's wording in acceptedAlternative.",
    "If the answer is understandable but grammatically wrong, set isCorrect=false and provide a correctedAnswer.",
    "If the instruction requires a specific grammatical transformation, check that the transformation was actually applied.",
    "If the answer substantially changes the meaning, set isCorrect=false. If it is empty or unrelated, set isCorrect=false.",
    "Write every explanation (explanationRu and each mistake's explanationRu) in Russian. Keep them short.",
    'For German article, noun-gender, or case mistakes, always name the correct article together with the noun in the correction (e.g. "der Prozess", "die Integration", "das Ergebnis").',
    "Report mistakes only when isCorrect=false; when correct, return an empty mistakes array.",
  ].join("\n");
}

function buildUserPrompt(input: OpenGrammarCheckInput): string {
  const track = input.careerTrack
    ? CAREER_TRACK_LABEL[input.careerTrack]
    : null;
  const lines = [
    `Language: ${LANGUAGE_LABEL[input.language]}`,
    `Target CEFR level: ${input.targetLevel}`,
    `Lesson: ${input.lessonId}`,
    `Grammar topic: ${input.grammarTopic}`,
  ];
  if (input.professionalTopic) {
    lines.push(`Professional topic: ${input.professionalTopic}`);
  }
  if (track) lines.push(`Career track: ${track}`);
  lines.push(`Instruction: ${input.instruction}`);
  if (input.sourceText) lines.push(`Task text: ${input.sourceText}`);
  lines.push(`Sample answer: ${input.sampleAnswer}`);
  lines.push(`Student answer: ${input.studentAnswer}`);
  return lines.join("\n");
}
