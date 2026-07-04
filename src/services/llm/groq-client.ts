// Low-level Groq call using strict structured outputs.
//
// Groq is OpenAI-compatible, so this is a thin fetch wrapper over
// POST /chat/completions with `response_format: json_schema` in strict mode —
// constrained decoding that guarantees the model's output matches the supplied
// JSON schema (supported by openai/gpt-oss-120b and openai/gpt-oss-20b; see
// docs/llm-integration.md). We still parse and later Zod-validate the result;
// strict mode is a strong guarantee, not an excuse to skip validation.
//
// No SDK dependency: a single well-understood fetch keeps the surface small and
// the failure modes explicit. All errors are normalized to `LlmError`.

import type { TokenUsage } from "@/types";

import { getGroqConfig } from "./config";
import { LlmError } from "./errors";

/** How hard a reasoning model should "think". Kept low: these tasks are short
 *  and bounded, and reasoning tokens are billed as output. Tunable. */
type ReasoningEffort = "low" | "medium" | "high";

export interface StructuredCallInput {
  model: string;
  system: string;
  user: string;
  /** Schema name reported to the provider (labels the constrained grammar). */
  schemaName: string;
  /** JSON Schema the output is constrained to (strict mode). */
  jsonSchema: Record<string, unknown>;
  maxCompletionTokens?: number;
  reasoningEffort?: ReasoningEffort;
  temperature?: number;
}

export interface StructuredCallResult {
  /** Parsed JSON content — validate before trusting. */
  data: unknown;
  /** The model that produced the response. */
  model: string;
  usage: TokenUsage;
  latencyMs: number;
}

const DEFAULT_MAX_COMPLETION_TOKENS = 4096;
const DEFAULT_REASONING_EFFORT: ReasoningEffort = "low";
const DEFAULT_TEMPERATURE = 0.2;

/** Call Groq once and return the parsed (but not yet validated) JSON content. */
export async function callGroqStructured(
  input: StructuredCallInput,
): Promise<StructuredCallResult> {
  const config = getGroqConfig();
  const startedAt = Date.now();

  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: input.model,
        temperature: input.temperature ?? DEFAULT_TEMPERATURE,
        max_completion_tokens:
          input.maxCompletionTokens ?? DEFAULT_MAX_COMPLETION_TOKENS,
        reasoning_effort: input.reasoningEffort ?? DEFAULT_REASONING_EFFORT,
        messages: [
          { role: "system", content: input.system },
          { role: "user", content: input.user },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: input.schemaName,
            strict: true,
            schema: input.jsonSchema,
          },
        },
      }),
    });
  } catch (cause) {
    throw new LlmError(
      "provider",
      `Groq request failed for ${input.model}`,
      cause,
    );
  }

  const latencyMs = Date.now() - startedAt;

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new LlmError(
      "provider",
      `Groq returned ${response.status} for ${input.model}: ${body.slice(0, 300)}`,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new LlmError("provider", "Groq returned a non-JSON body", cause);
  }

  const content = extractContent(payload);
  if (content === null) {
    throw new LlmError(
      "invalid_response",
      `Groq response had no message content for ${input.model}`,
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(content);
  } catch (cause) {
    throw new LlmError(
      "invalid_response",
      `Groq content was not valid JSON for ${input.model}`,
      cause,
    );
  }

  return {
    data,
    model: input.model,
    usage: extractUsage(payload),
    latencyMs,
  };
}

/** Pull `choices[0].message.content` defensively from an unknown payload. */
function extractContent(payload: unknown): string | null {
  const choices = (payload as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const content = (choices[0] as { message?: { content?: unknown } }).message
    ?.content;
  return typeof content === "string" ? content : null;
}

/** Read token usage defensively, defaulting to zeros when absent. */
function extractUsage(payload: unknown): TokenUsage {
  const usage = (payload as { usage?: Record<string, unknown> }).usage ?? {};
  const input = Number(usage.prompt_tokens ?? 0);
  const output = Number(usage.completion_tokens ?? 0);
  const totalRaw = usage.total_tokens;
  return {
    input: Number.isFinite(input) ? input : 0,
    output: Number.isFinite(output) ? output : 0,
    total: totalRaw != null ? Number(totalRaw) : input + output,
  };
}
