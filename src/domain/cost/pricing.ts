// Deterministic LLM cost estimation (Phase 7, consumed for cost accounting).
//
// Pure, Prisma-independent domain logic: given a model id and the token usage a
// provider reported, compute the estimated USD cost. The price table mirrors
// Groq's published per-million-token pricing (see docs/llm-integration.md). It
// lives in the domain so both the LLM request path (Phase 7) and the cost
// dashboard (Phase 8) share one source of truth and one rounding rule.

import type { MoneyAmount, TokenUsage } from "@/types";

/** Per-million-token prices in USD for a single model. */
interface ModelPrice {
  inputPerMillion: number;
  outputPerMillion: number;
}

// Groq pricing current as of Phase 7 (July 2026), from https://groq.com/pricing.
// Update here when Groq changes pricing; keys are the exact Groq model ids.
const GROQ_MODEL_PRICING: Record<string, ModelPrice> = {
  "openai/gpt-oss-120b": { inputPerMillion: 0.15, outputPerMillion: 0.6 },
  "openai/gpt-oss-20b": { inputPerMillion: 0.075, outputPerMillion: 0.3 },
};

/** Whether we hold a price for this model (an unknown model estimates to 0). */
export function isModelPriced(model: string): boolean {
  return model in GROQ_MODEL_PRICING;
}

/**
 * Estimate the USD cost of one LLM call from its token usage. An unknown model
 * yields a zero-cost estimate rather than throwing, so an unrecognized id never
 * blocks persisting the request log; the missing price surfaces as `$0` instead.
 */
export function estimateLlmCost(model: string, usage: TokenUsage): MoneyAmount {
  const price = GROQ_MODEL_PRICING[model];
  const amount = price
    ? (usage.input * price.inputPerMillion +
        usage.output * price.outputPerMillion) /
      1_000_000
    : 0;
  return { currency: "USD", amount };
}
