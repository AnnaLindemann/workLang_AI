// Public entry point for the deterministic practice engine (Phase 4).
//
// Local, LLM-free answer checking for grammar practice. Emits structured
// results that later phases (error and mastery engines) consume.

export * from "./answer-check";
export * from "./vocabulary-match";
