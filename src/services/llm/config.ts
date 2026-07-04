// Groq provider configuration (Phase 7). Server-side only.
//
// Reads the LLM environment variables documented in docs/llm-integration.md and
// .env.example. `GROQ_API_KEY` must never reach the client bundle (no
// NEXT_PUBLIC_ prefix); this module is imported only by the LLM service and the
// server-side storage orchestration.

import { LlmError } from "./errors";

const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_PRIMARY_MODEL = "openai/gpt-oss-120b";
const DEFAULT_FALLBACK_MODEL = "openai/gpt-oss-20b";

export interface GroqConfig {
  apiKey: string;
  primaryModel: string;
  fallbackModel: string;
  baseUrl: string;
}

/**
 * Resolve the full Groq configuration, throwing a typed config error when the
 * API key is absent. Called at request time (never at import time) so a missing
 * key degrades one request gracefully instead of breaking the build.
 */
export function getGroqConfig(): GroqConfig {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new LlmError(
      "config",
      "GROQ_API_KEY is not set — add it to your local .env (see .env.example)",
    );
  }
  return {
    apiKey,
    primaryModel: getPrimaryModelName(),
    fallbackModel: process.env.GROQ_MODEL_FALLBACK ?? DEFAULT_FALLBACK_MODEL,
    baseUrl: process.env.GROQ_BASE_URL ?? DEFAULT_BASE_URL,
  };
}

/**
 * The configured primary model name, resolvable without the API key. Used to
 * stamp the request log before the call is attempted, so the log exists even if
 * configuration is incomplete.
 */
export function getPrimaryModelName(): string {
  return process.env.GROQ_MODEL_PRIMARY ?? DEFAULT_PRIMARY_MODEL;
}

/**
 * The configured fallback model name, resolvable without the API key. The open
 * grammar mini-checker prefers this cheaper model (see open-grammar-check.ts),
 * so it also stamps the pending request log.
 */
export function getFallbackModelName(): string {
  return process.env.GROQ_MODEL_FALLBACK ?? DEFAULT_FALLBACK_MODEL;
}
