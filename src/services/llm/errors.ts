// A single typed error for the LLM layer.
//
// The request path distinguishes three failure kinds so callers can react (and
// so the request log records an honest reason):
//   config           → provider not configured (e.g. missing GROQ_API_KEY)
//   provider         → the provider call failed or returned a non-OK response
//   invalid_response → the response was not valid JSON, or failed schema/Zod
//                      validation (a malformed structured output)
// All three degrade the same way at the boundary: the learner's writing is
// still saved and deterministic data is never touched.

export type LlmErrorKind = "config" | "provider" | "invalid_response";

export class LlmError extends Error {
  readonly kind: LlmErrorKind;
  readonly cause?: unknown;

  constructor(kind: LlmErrorKind, message: string, cause?: unknown) {
    super(message);
    this.name = "LlmError";
    this.kind = kind;
    this.cause = cause;
  }
}
