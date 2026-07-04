// Public entry point for the LLM service (Phase 7). Server-only.
//
// The provider-facing layer: it builds prompts, calls Groq with strict
// structured outputs, and validates results. It performs no database access —
// persistence and cost logging live in the storage layer, which orchestrates
// this service. Never import this into a client bundle.

export { LlmError, type LlmErrorKind } from "./errors";
export { getPrimaryModelName, getFallbackModelName } from "./config";
export {
  generateWritingFeedback,
  type WritingFeedbackInput,
  type WritingFeedbackResult,
} from "./writing-feedback";
export {
  WRITING_MISTAKE_CATEGORIES,
  type WritingFeedbackData,
} from "./writing-feedback-schema";
export {
  generateOpenGrammarCheck,
  type OpenGrammarCheckInput,
  type OpenGrammarCheckResult,
} from "./open-grammar-check";
export { type OpenGrammarCheckData } from "./open-grammar-check-schema";
