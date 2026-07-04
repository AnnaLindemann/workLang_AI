// Writing-attempt persistence and LLM orchestration (Phase 7).
//
// This is the database-first boundary for the single LLM step in the learning
// loop. The order matters for graceful degradation:
//
//   1. Persist the learner's writing immediately (a WritingAttempt row). It is
//      saved whether or not the LLM succeeds — the learner never loses work.
//   2. Open a PENDING LlmRequestLog so every call is auditable (no hidden
//      calls; see docs/llm-integration.md).
//   3. Call the LLM service (primary → fallback, strict JSON, Zod-validated).
//   4. On success, in one transaction: fill the attempt's LLM fields, complete
//      the request log, write the CostRecord, and upsert the writing mistakes
//      into the existing Error Engine flow.
//   5. On any failure, mark the log ERROR and return a graceful result. The
//      saved writing and all deterministic data are untouched.
//
// Cost accounting rows are written here so the Phase 8 dashboard only has to
// read them; this file is the "prepared request path" that phase builds on.

import { buildWritingMistakeGroup } from "@/domain/errors";
import { estimateLlmCost } from "@/domain/cost";
import { generateWritingFeedback, getPrimaryModelName } from "@/services/llm";
import { LlmRequestStatus, LlmRequestType } from "@/types";
import type {
  CareerTrack,
  CefrLevel,
  Language,
  LessonId,
  MistakeSeverity,
  UserId,
} from "@/types";

import { prisma } from "./prisma";
import { upsertMistake } from "./mistake-repository";

/** Everything needed to evaluate one writing submission. */
export interface SubmitWritingInput {
  userId: UserId;
  lessonId: LessonId;
  /** The lesson's stable learning topic; writing mistakes group under it. */
  topic: string;
  language: Language;
  careerTrack?: CareerTrack;
  /** Target CEFR level for this lesson (e.g. "C1" / "B2"). */
  targetLevel: string;
  /** The writing scenario prompt. */
  prompt?: string;
  requirements?: string[];
  text: string;
}

/** One mistake surfaced to the UI (already persisted). */
export interface WritingMistakeView {
  category: string;
  severity: MistakeSeverity;
  expected: string;
  given: string;
  explanation: string;
}

/**
 * The result handed back to the UI. `status: "ok"` carries feedback; `"failed"`
 * carries a user-facing message and means the writing was saved but feedback is
 * unavailable this time.
 */
export interface WritingFeedbackView {
  attemptId: string;
  status: "ok" | "failed";
  cefr?: CefrLevel;
  cefrConfidence?: string;
  strengths?: string[];
  summary?: string;
  improvedText?: string;
  mistakes?: WritingMistakeView[];
  message?: string;
}

/** Persist a writing submission, evaluate it with the LLM, and record results. */
export async function submitWritingAttempt(
  input: SubmitWritingInput,
): Promise<WritingFeedbackView> {
  // 1. Save the writing first — never lost, whatever happens with the LLM.
  const attempt = await prisma.writingAttempt.create({
    data: {
      userId: input.userId,
      language: input.language,
      careerTrack: input.careerTrack,
      prompt: input.prompt,
      submittedText: input.text,
    },
  });

  // 2. Open an auditable request log before the call is made.
  const requestLog = await prisma.llmRequestLog.create({
    data: {
      userId: input.userId,
      writingAttemptId: attempt.id,
      requestType: LlmRequestType.WritingFeedback,
      status: LlmRequestStatus.Pending,
      model: getPrimaryModelName(),
    },
  });

  try {
    // 3. Provider call: primary → fallback, strict JSON, already Zod-validated.
    const result = await generateWritingFeedback({
      language: input.language,
      careerTrack: input.careerTrack,
      targetLevel: input.targetLevel,
      prompt: input.prompt,
      requirements: input.requirements,
      text: input.text,
    });

    const { data, model, usage, latencyMs } = result;
    const cost = estimateLlmCost(model, usage);
    const occurredAt = attempt.createdAt;

    // 4. Commit feedback, request completion, cost, and mistakes atomically.
    await prisma.$transaction(async (tx) => {
      await tx.writingAttempt.update({
        where: { id: attempt.id },
        data: {
          cefrEstimate: data.cefr.estimatedLevel,
          feedback: JSON.stringify(data.feedback),
          improvedText: data.improvedText,
        },
      });

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

      for (const mistake of data.mistakes) {
        await upsertMistake(
          tx,
          buildWritingMistakeGroup({
            userId: input.userId,
            lessonId: input.lessonId,
            language: input.language,
            topic: input.topic,
            category: mistake.category,
            severity: mistake.severity,
          }),
          {
            expected: mistake.expected,
            given: mistake.given,
            context: input.text,
            explanation: mistake.explanation,
            writingAttemptId: attempt.id,
            lastOccurredAt: occurredAt,
          },
        );
      }
    });

    return {
      attemptId: attempt.id,
      status: "ok",
      cefr: data.cefr.estimatedLevel,
      cefrConfidence: data.cefr.confidence,
      strengths: data.feedback.strengths,
      summary: data.feedback.summary,
      improvedText: data.improvedText,
      mistakes: data.mistakes,
    };
  } catch (error) {
    // 5. Degrade gracefully: record the failure, keep the saved writing.
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
      attemptId: attempt.id,
      status: "failed",
      message:
        "Feedback is temporarily unavailable. Your writing was saved — please try again shortly.",
    };
  }
}
