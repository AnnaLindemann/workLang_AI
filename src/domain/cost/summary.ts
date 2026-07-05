// Deterministic LLM cost/usage aggregation (Phase 8 — Cost Tracking & Observability).
//
// Pure, Prisma-independent domain logic: given the LLM request logs and their
// one-to-one cost records already persisted in PostgreSQL (see Phase 7), fold
// them into the summary the observability page renders. It reuses the existing
// logging tables as the source of truth — it never calls an LLM, never estimates
// prices again (the cost is read straight from the persisted CostRecord), and
// introduces no new store.
//
// The repository (src/services/storage/cost-repository.ts) loads the rows and
// maps them to the plain shapes below; this module does the rest, so the same
// summarization stays testable without a database.

import { LlmRequestStatus, LlmRequestType } from "@/types";

/** Persisted cost accounting for a single call, flattened from CostRecord. */
export interface RawCostRecord {
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  currency: string;
}

/** One persisted LLM request log with its optional cost record. */
export interface RawLlmRequest {
  id: string;
  /** ISO timestamp of the call. */
  createdAt: string;
  requestType: LlmRequestType;
  status: LlmRequestStatus;
  model: string;
  /** Total tokens the provider reported on the log, when present. */
  totalTokens: number | null;
  latencyMs: number | null;
  errorMessage: string | null;
  /**
   * The writing attempt this call belongs to, when any. It is the only
   * session-like link the schema offers: the writing path sets it, open grammar
   * checks leave it null, and no LLM log carries a lessonId (see below).
   */
  writingAttemptId: string | null;
  /** Present only for calls that completed and were priced (usually SUCCESS). */
  cost: RawCostRecord | null;
}

/** Headline totals across every logged call for the user. */
export interface CostTotals {
  requestCount: number;
  successCount: number;
  errorCount: number;
  pendingCount: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  currency: string;
  /** Mean latency of successful calls that reported it, or null if none did. */
  avgLatencyMs: number | null;
}

/** One grouped row of a breakdown (by request type, model, or status). */
export interface CostBreakdownRow {
  key: string;
  requestCount: number;
  totalTokens: number;
  estimatedCost: number;
}

/**
 * Cost rolled up for one explicit scope. The only reliable scope the schema
 * supports is a writing attempt (`LlmRequestLog.writingAttemptId`); lessons have
 * no cost link, so this is the finest honest grouping below "lifetime".
 */
export interface ScopedCost {
  /** The writing attempt id these calls belong to. */
  scopeId: string;
  requestCount: number;
  totalTokens: number;
  estimatedCost: number;
  /** Newest call in the scope, so callers can pick the most recent scope. */
  latestCreatedAt: string;
  /** Distinct request types seen in this scope, in first-seen order. */
  requestTypes: LlmRequestType[];
}

/** A single call surfaced in the audit list. */
export interface RequestLogEntry {
  id: string;
  createdAt: string;
  requestType: LlmRequestType;
  status: LlmRequestStatus;
  model: string;
  totalTokens: number;
  latencyMs: number | null;
  estimatedCost: number;
  errorMessage: string | null;
}

/** The full observability read model for one user. */
export interface CostSummary {
  /** Lifetime totals across every persisted request. */
  totals: CostTotals;
  /** The single most recent call, or null when there is none. */
  latestRequest: RequestLogEntry | null;
  /**
   * Cost of the most recent writing attempt (the closest reliable "session"
   * scope), or null when no call is tied to a writing attempt.
   */
  latestWritingAttempt: ScopedCost | null;
  byRequestType: CostBreakdownRow[];
  byModel: CostBreakdownRow[];
  byStatus: CostBreakdownRow[];
  /** Most recent calls first, for a plain audit trail. */
  recent: RequestLogEntry[];
}

const DEFAULT_CURRENCY = "USD";
const DEFAULT_RECENT_LIMIT = 25;

/** Tokens attributable to a call: the priced count when known, else the log's. */
function tokensOf(request: RawLlmRequest): number {
  if (request.cost) return request.cost.inputTokens + request.cost.outputTokens;
  return request.totalTokens ?? 0;
}

/** Persisted USD cost of a call; unpriced/failed calls contribute nothing. */
function costOf(request: RawLlmRequest): number {
  return request.cost ? request.cost.estimatedCost : 0;
}

/** Group requests by a key and accumulate count, tokens, and cost per group. */
function breakdownBy(
  requests: readonly RawLlmRequest[],
  keyOf: (request: RawLlmRequest) => string,
): CostBreakdownRow[] {
  const rows = new Map<string, CostBreakdownRow>();
  for (const request of requests) {
    const key = keyOf(request);
    const row = rows.get(key) ?? {
      key,
      requestCount: 0,
      totalTokens: 0,
      estimatedCost: 0,
    };
    row.requestCount += 1;
    row.totalTokens += tokensOf(request);
    row.estimatedCost += costOf(request);
    rows.set(key, row);
  }
  // Most expensive first, then most frequent — the useful reading order.
  return [...rows.values()].sort(
    (a, b) =>
      b.estimatedCost - a.estimatedCost || b.requestCount - a.requestCount,
  );
}

/**
 * Fold persisted request logs and cost records into the observability summary.
 * Deterministic and side-effect free: it reads the already-recorded rows and
 * never triggers a new LLM call or a fresh price estimate.
 */
export function summarizeLlmCost(
  requests: readonly RawLlmRequest[],
  options: { recentLimit?: number } = {},
): CostSummary {
  const recentLimit = options.recentLimit ?? DEFAULT_RECENT_LIMIT;

  const totals: CostTotals = {
    requestCount: requests.length,
    successCount: 0,
    errorCount: 0,
    pendingCount: 0,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedCost: 0,
    currency: DEFAULT_CURRENCY,
    avgLatencyMs: null,
  };

  let latencySum = 0;
  let latencyCount = 0;

  for (const request of requests) {
    switch (request.status) {
      case LlmRequestStatus.Success:
        totals.successCount += 1;
        break;
      case LlmRequestStatus.Error:
        totals.errorCount += 1;
        break;
      case LlmRequestStatus.Pending:
        totals.pendingCount += 1;
        break;
    }

    if (request.cost) {
      totals.inputTokens += request.cost.inputTokens;
      totals.outputTokens += request.cost.outputTokens;
      totals.totalTokens +=
        request.cost.inputTokens + request.cost.outputTokens;
      totals.estimatedCost += request.cost.estimatedCost;
      totals.currency = request.cost.currency;
    }

    if (
      request.status === LlmRequestStatus.Success &&
      request.latencyMs != null
    ) {
      latencySum += request.latencyMs;
      latencyCount += 1;
    }
  }

  totals.avgLatencyMs =
    latencyCount > 0 ? Math.round(latencySum / latencyCount) : null;

  const recent: RequestLogEntry[] = [...requests]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, recentLimit)
    .map((request) => ({
      id: request.id,
      createdAt: request.createdAt,
      requestType: request.requestType,
      status: request.status,
      model: request.model,
      totalTokens: tokensOf(request),
      latencyMs: request.latencyMs,
      estimatedCost: costOf(request),
      errorMessage: request.errorMessage,
    }));

  return {
    totals,
    // `recent` is already newest-first, so its head is the latest call.
    latestRequest: recent[0] ?? null,
    latestWritingAttempt: latestWritingAttemptScope(requests),
    byRequestType: breakdownBy(requests, (r) => r.requestType),
    byModel: breakdownBy(requests, (r) => r.model),
    byStatus: breakdownBy(requests, (r) => r.status),
    recent,
  };
}

/**
 * Roll up the most recent writing attempt's cost. Groups every call sharing a
 * `writingAttemptId`, then returns the group whose newest call is latest — the
 * "current" writing attempt. Calls with no writing attempt (e.g. open grammar
 * checks) are ignored, and lessons are unavailable as a scope by design.
 */
function latestWritingAttemptScope(
  requests: readonly RawLlmRequest[],
): ScopedCost | null {
  const scopes = new Map<string, ScopedCost>();
  for (const request of requests) {
    const id = request.writingAttemptId;
    if (!id) continue;
    const scope = scopes.get(id) ?? {
      scopeId: id,
      requestCount: 0,
      totalTokens: 0,
      estimatedCost: 0,
      latestCreatedAt: request.createdAt,
      requestTypes: [],
    };
    scope.requestCount += 1;
    scope.totalTokens += tokensOf(request);
    scope.estimatedCost += costOf(request);
    if (request.createdAt > scope.latestCreatedAt) {
      scope.latestCreatedAt = request.createdAt;
    }
    if (!scope.requestTypes.includes(request.requestType)) {
      scope.requestTypes.push(request.requestType);
    }
    scopes.set(id, scope);
  }

  let latest: ScopedCost | null = null;
  for (const scope of scopes.values()) {
    if (!latest || scope.latestCreatedAt > latest.latestCreatedAt) {
      latest = scope;
    }
  }
  return latest;
}
