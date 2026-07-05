// Cost/observability read model (Phase 8 — Cost Tracking & Observability).
//
// The read side of the LLM cost tables. Phase 7 already writes an LlmRequestLog
// (the operational fact) plus a one-to-one CostRecord (the money) for every
// call; this repository only *reads* those persisted rows and folds them into
// the summary the /cost page renders. PostgreSQL stays the single source of
// truth: nothing here calls an LLM, re-prices anything, or caches in the browser.

import {
  summarizeLlmCost,
  type CostSummary,
  type RawLlmRequest,
} from "@/domain/cost";
import type { LlmRequestStatus, LlmRequestType, UserId } from "@/types";

import { prisma } from "./prisma";

/**
 * Load every LLM request log for the user (with its cost record) and summarize
 * it for the observability page. Single-user MVP volumes are small, so the fold
 * happens in the pure domain layer rather than in SQL, keeping it testable.
 */
export async function loadCostSummary(userId: UserId): Promise<CostSummary> {
  const logs = await prisma.llmRequestLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { costRecord: true },
  });

  const requests: RawLlmRequest[] = logs.map((log) => ({
    id: log.id,
    createdAt: log.createdAt.toISOString(),
    requestType: log.requestType as LlmRequestType,
    status: log.status as LlmRequestStatus,
    model: log.model,
    totalTokens: log.totalTokens,
    latencyMs: log.latencyMs,
    errorMessage: log.errorMessage,
    writingAttemptId: log.writingAttemptId,
    cost: log.costRecord
      ? {
          inputTokens: log.costRecord.inputTokens,
          outputTokens: log.costRecord.outputTokens,
          // Decimal(12,6) → number; single-user totals stay well within range.
          estimatedCost: Number(log.costRecord.estimatedCost),
          currency: log.costRecord.currency,
        }
      : null,
  }));

  return summarizeLlmCost(requests);
}
