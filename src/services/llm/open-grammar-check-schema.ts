// The structured-output contract for the open-grammar mini-checker (Phase 7
// follow-up). One universal schema for ALL open grammar exercises — not one per
// grammar topic. It is intentionally small: a verdict, a short correction, and
// granular mistakes, with all explanations in Russian.
//
// As with writing feedback, the contract is expressed twice from one set of
// enums: a strict JSON Schema for Groq constrained decoding, and a Zod schema
// that re-validates the parsed result before persistence.

import { z } from "zod";

export const OPEN_GRAMMAR_CHECK_SCHEMA_NAME = "open_grammar_check";

const CONFIDENCE_VALUES = ["low", "medium", "high"] as const;
// 1-5 granular severity from the checker; mapped to the MistakeSeverity enum at
// persistence time (see the open-grammar repository).
const SEVERITY_VALUES = [1, 2, 3, 4, 5] as const;

export const openGrammarCheckZodSchema = z.object({
  isCorrect: z.boolean(),
  confidence: z.enum(CONFIDENCE_VALUES),
  correctedAnswer: z.string().nullable(),
  acceptedAlternative: z.string().nullable(),
  mistakes: z.array(
    z.object({
      category: z.string(),
      subcategory: z.string().nullable(),
      explanationRu: z.string(),
      severity: z.union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
      ]),
      original: z.string().nullable(),
      correction: z.string().nullable(),
    }),
  ),
  explanationRu: z.string(),
});

export type OpenGrammarCheckData = z.infer<typeof openGrammarCheckZodSchema>;

/** JSON Schema for Groq strict structured outputs. Nullable fields use a
 *  `["type", "null"]` union; every property is required and objects are closed,
 *  as strict mode requires. */
export const openGrammarCheckJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    isCorrect: { type: "boolean" },
    confidence: { type: "string", enum: [...CONFIDENCE_VALUES] },
    correctedAnswer: { type: ["string", "null"] },
    acceptedAlternative: { type: ["string", "null"] },
    mistakes: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          category: { type: "string" },
          subcategory: { type: ["string", "null"] },
          explanationRu: { type: "string" },
          severity: { type: "integer", enum: [...SEVERITY_VALUES] },
          original: { type: ["string", "null"] },
          correction: { type: ["string", "null"] },
        },
        required: [
          "category",
          "subcategory",
          "explanationRu",
          "severity",
          "original",
          "correction",
        ],
      },
    },
    explanationRu: { type: "string" },
  },
  required: [
    "isCorrect",
    "confidence",
    "correctedAnswer",
    "acceptedAlternative",
    "mistakes",
    "explanationRu",
  ],
} as const satisfies Record<string, unknown>;
