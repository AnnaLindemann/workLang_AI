// Open-grammar LLM check: persistence + logging orchestration (Phase 7 follow-up).
//
// The mini-checker's counterpart to the writing repository, but for open grammar
// exercises. It logs the LLM call (a GRAMMAR_CHECK request), then reuses the
// deterministic attempt pipeline (`recordExerciseAttempt` → mastery + Error
// Engine) with the LLM's verdict as `isCorrect`. That keeps open-grammar results
// mastery- and review-integrated exactly like graded exercises, while the
// deterministic checkers themselves stay untouched and WritingTask feedback
// stays a separate path. Failures degrade gracefully: the call is marked ERROR
// and no attempt is recorded.

import { estimateLlmCost } from "@/domain/cost";
import { generateOpenGrammarCheck, getFallbackModelName } from "@/services/llm";
import {
  LlmRequestStatus,
  LlmRequestType,
  MistakeSeverity,
  SkillArea,
} from "@/types";
import type {
  CareerTrack,
  ExerciseId,
  Language,
  LessonId,
  UserId,
} from "@/types";

import { prisma } from "./prisma";
import { recordExerciseAttempt } from "./exercise-attempt-repository";

// Stable grouping for open-grammar mistakes, so repeats collapse onto one key
// and stay reviewable under the lesson's grammar topic.
const OPEN_GRAMMAR_CATEGORY = "open-production";
const OPEN_GRAMMAR_SUBCATEGORY = "llm-check";

export interface CheckOpenGrammarInput {
  userId: UserId;
  lessonId: LessonId;
  language: Language;
  careerTrack?: CareerTrack;
  targetLevel: string;
  /** The lesson's grammar topic (used for mastery + review grouping). */
  grammarTopic: string;
  professionalTopic?: string;
  exerciseId: ExerciseId;
  exerciseFormat: string;
  instruction: string;
  sourceText?: string;
  sampleAnswer: string;
  studentAnswer: string;
}

export interface OpenGrammarMistakeView {
  category: string;
  subcategory: string | null;
  explanationRu: string;
  severity: number;
  original: string | null;
  correction: string | null;
}

export interface OpenGrammarCheckView {
  status: "ok" | "failed";
  isCorrect?: boolean;
  confidence?: string;
  correctedAnswer?: string | null;
  acceptedAlternative?: string | null;
  mistakes?: OpenGrammarMistakeView[];
  explanationRu?: string;
  message?: string;
}

/** Run the LLM grammar check, persist the attempt, and log the call. */
export async function checkOpenGrammar(
  input: CheckOpenGrammarInput,
): Promise<OpenGrammarCheckView> {
  // Log the call up front (auditable; no hidden calls). No writing attempt here.
  const requestLog = await prisma.llmRequestLog.create({
    data: {
      userId: input.userId,
      requestType: LlmRequestType.GrammarCheck,
      status: LlmRequestStatus.Pending,
      model: getFallbackModelName(),
    },
  });

  try {
    const result = await generateOpenGrammarCheck({
      language: input.language,
      targetLevel: input.targetLevel,
      lessonId: input.lessonId,
      grammarTopic: input.grammarTopic,
      professionalTopic: input.professionalTopic,
      careerTrack: input.careerTrack,
      instruction: input.instruction,
      sourceText: input.sourceText,
      sampleAnswer: input.sampleAnswer,
      studentAnswer: input.studentAnswer,
    });

    const { data, model, usage, latencyMs } = result;

    // Persist the graded attempt (mastery + Error Engine) via the shared pipeline.
    // A wrong answer becomes a grammar mistake grouped under the lesson topic.
    await recordExerciseAttempt({
      userId: input.userId,
      lessonId: input.lessonId,
      exerciseId: input.exerciseId,
      topic: input.grammarTopic,
      category: OPEN_GRAMMAR_CATEGORY,
      subcategory: OPEN_GRAMMAR_SUBCATEGORY,
      severity: severityFromMistakes(data.mistakes),
      exerciseFormat: input.exerciseFormat,
      language: input.language,
      skillArea: SkillArea.Grammar,
      promptText: input.instruction,
      expectedAnswer:
        data.correctedAnswer ?? data.acceptedAlternative ?? input.sampleAnswer,
      givenAnswer: input.studentAnswer,
      isCorrect: data.isCorrect,
    });

    // Accounting is best-effort: it must never hide a produced verdict.
    try {
      const cost = estimateLlmCost(model, usage);
      await prisma.$transaction(async (tx) => {
        await tx.llmRequestLog.update({
          where: { id: requestLog.id },
          data: {
            status: LlmRequestStatus.Success,
            model,
            promptTokens: usage.input,
            completionTokens: usage.output,
            totalTokens: usage.total ?? usage.input + usage.output,
            latencyMs,
          },
        });
        await tx.costRecord.create({
          data: {
            userId: input.userId,
            llmRequestId: requestLog.id,
            model,
            inputTokens: usage.input,
            outputTokens: usage.output,
            currency: cost.currency,
            estimatedCost: cost.amount,
          },
        });
      });
    } catch {
      // Leave the log PENDING rather than fail the check; accounting can be
      // reconciled later. The learning data is already safely persisted.
    }

    return {
      status: "ok",
      isCorrect: data.isCorrect,
      confidence: data.confidence,
      correctedAnswer: data.correctedAnswer,
      acceptedAlternative: data.acceptedAlternative,
      mistakes: data.mistakes,
      explanationRu: data.explanationRu,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown LLM failure";
    await prisma.llmRequestLog
      .update({
        where: { id: requestLog.id },
        data: {
          status: LlmRequestStatus.Error,
          errorMessage: message.slice(0, 500),
        },
      })
      .catch(() => {
        // A logging failure must not mask the original failure.
      });

    return {
      status: "failed",
      message:
        "AI check is temporarily unavailable. Compare your answer with the sample for now, and try again shortly.",
    };
  }
}

/** Map the checker's 1-5 severities onto the coarse MistakeSeverity enum. */
function severityFromMistakes(
  mistakes: readonly { severity: number }[],
): MistakeSeverity {
  const max = mistakes.reduce((worst, m) => Math.max(worst, m.severity), 0);
  if (max >= 4) return MistakeSeverity.High;
  if (max === 3) return MistakeSeverity.Medium;
  if (max >= 1) return MistakeSeverity.Low;
  return MistakeSeverity.Medium;
}
