// LLM request-log and cost-accounting entities, their value objects, and the
// cost transfer DTO.
//
// Cost history is normalized into two entities that mirror the persistence
// models: `LlmRequestLog` (the operational fact of a call) and `CostRecord`
// (the money), one-to-one. See docs/llm-integration.md and docs/database.md.
// Nothing here makes an LLM call; that is Phases 7–8.

import type { LlmRequestStatus, LlmRequestType } from "./enums";
import type {
  CostRecordId,
  ISODateString,
  LlmRequestLogId,
  UserId,
  WritingAttemptId,
} from "./ids";

/** Token usage for a single LLM call. */
export interface TokenUsage {
  input: number;
  output: number;
  /** Total tokens, when reported separately by the provider. */
  total?: number;
}

/** A monetary amount in a given currency (ISO 4217 code, e.g. "USD"). */
export interface MoneyAmount {
  currency: string;
  amount: number;
}

/** The operational record of one LLM call. */
export interface LlmRequestLog {
  id: LlmRequestLogId;
  userId: UserId;
  writingAttemptId?: WritingAttemptId;
  requestType: LlmRequestType;
  status: LlmRequestStatus;
  model: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  latencyMs?: number;
  errorMessage?: string;
  createdAt: ISODateString;
}

/** Cost accounting for one LLM call, one-to-one with its request log. */
export interface CostRecord {
  id: CostRecordId;
  userId: UserId;
  llmRequestId: LlmRequestLogId;
  model: string;
  usage: TokenUsage;
  cost: MoneyAmount;
  createdAt: ISODateString;
}

/**
 * Data required to record the cost of an LLM call, tied to its request log.
 * Omits server-generated identity and timestamp.
 */
export interface CostDTO {
  userId: UserId;
  llmRequestId: LlmRequestLogId;
  model: string;
  usage: TokenUsage;
  cost: MoneyAmount;
}
