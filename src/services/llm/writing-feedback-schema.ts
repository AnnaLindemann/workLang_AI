// The structured-output contract for writing feedback (Phase 7).
//
// One writing submission → one LLM call that returns everything the loop needs:
// a CEFR estimate, encouraging feedback (Russian), an improved rewrite (target
// language), and a list of concrete mistakes that flow into the Error Engine.
//
// The contract is expressed twice, from one set of enums, and both must agree:
//   - `writingFeedbackJsonSchema` is sent to Groq for strict constrained
//     decoding (all properties required, no extras);
//   - `writingFeedbackZodSchema` re-validates the parsed result before anything
//     is persisted (defense in depth — see docs/llm-integration.md).
// Mistake `category` and `severity` are closed sets so writing mistakes group
// stably under the same unique key as deterministic mistakes.

import { z } from "zod";

import type { CefrLevel, MistakeSeverity } from "@/types";

export const WRITING_FEEDBACK_SCHEMA_NAME = "writing_feedback";

/** Closed mistake categories, chosen to align with the writing feedback prompt
 *  (grammar, vocabulary, register/tone, clarity). Keeping them closed keeps
 *  Error Engine grouping deterministic. */
export const WRITING_MISTAKE_CATEGORIES = [
  "grammar",
  "vocabulary",
  "register",
  "clarity",
] as const;

// Literal tuples (not derived via Object.values, which widens to `string`) so
// the inferred result types stay the CEFR/severity unions and flow straight
// into the Prisma enum columns. `satisfies` guards them against enum drift.
const CEFR_VALUES = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const satisfies readonly CefrLevel[];
const SEVERITY_VALUES = [
  "LOW",
  "MEDIUM",
  "HIGH",
] as const satisfies readonly MistakeSeverity[];
const CONFIDENCE_VALUES = ["low", "medium", "high"] as const;

export const writingFeedbackZodSchema = z.object({
  cefr: z.object({
    estimatedLevel: z.enum(CEFR_VALUES),
    confidence: z.enum(CONFIDENCE_VALUES),
  }),
  feedback: z.object({
    strengths: z.array(z.string()),
    summary: z.string(),
  }),
  improvedText: z.string(),
  mistakes: z.array(
    z.object({
      category: z.enum(WRITING_MISTAKE_CATEGORIES),
      severity: z.enum(SEVERITY_VALUES),
      expected: z.string(),
      given: z.string(),
      explanation: z.string(),
    }),
  ),
});

export type WritingFeedbackData = z.infer<typeof writingFeedbackZodSchema>;

/** The JSON Schema sent to Groq for strict structured outputs. Mirrors the Zod
 *  schema above; strict mode requires every property listed in `required` and
 *  `additionalProperties: false` at every object level. */
export const writingFeedbackJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cefr: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedLevel: { type: "string", enum: [...CEFR_VALUES] },
        confidence: { type: "string", enum: [...CONFIDENCE_VALUES] },
      },
      required: ["estimatedLevel", "confidence"],
    },
    feedback: {
      type: "object",
      additionalProperties: false,
      properties: {
        strengths: { type: "array", items: { type: "string" } },
        summary: { type: "string" },
      },
      required: ["strengths", "summary"],
    },
    improvedText: { type: "string" },
    mistakes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          category: { type: "string", enum: [...WRITING_MISTAKE_CATEGORIES] },
          severity: { type: "string", enum: [...SEVERITY_VALUES] },
          expected: { type: "string" },
          given: { type: "string" },
          explanation: { type: "string" },
        },
        required: ["category", "severity", "expected", "given", "explanation"],
      },
    },
  },
  required: ["cefr", "feedback", "improvedText", "mistakes"],
} as const satisfies Record<string, unknown>;
