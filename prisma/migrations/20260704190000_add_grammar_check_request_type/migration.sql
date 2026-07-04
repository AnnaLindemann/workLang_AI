-- Phase 7 follow-up: add the GRAMMAR_CHECK request type so the universal
-- open-grammar LLM mini-checker can log its calls alongside writing feedback.
ALTER TYPE "LlmRequestType" ADD VALUE 'GRAMMAR_CHECK';
