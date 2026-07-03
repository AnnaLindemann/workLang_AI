# WorkLang AI — Prompts

> **Status:** design only. These are draft templates for the Phase 7 LLM layer
> (see [roadmap.md](roadmap.md) and [llm-integration.md](llm-integration.md)).
> They are not wired into code yet.

This is the catalog of prompts for the LLM tasks. Prompts are treated as
versioned assets: when a prompt changes, the change is reviewed like code.

## Conventions

- Each prompt has a **system** part (role and rules) and a **user** part (the
  task and inputs).
- Inputs are shown as `{{placeholders}}`.
- Always state the target level explicitly: **German towards C1**, **English
  towards B2**.
- Anchor to the learner's **career track** (AI Consultant, or Customer Success /
  Hospitality with an AI component) when relevant.
- Ask for **structured output** (clearly labeled sections or JSON) so results
  can be parsed and persisted to the `WritingAttempt` row (see
  [database.md](database.md)).
- Keep outputs focused; verbosity costs tokens and money (cost is tracked — see
  [llm-integration.md](llm-integration.md)).

## Shared system framing

```
You are WorkLang AI, a professional language coach for a working professional.
Language: {{language}}. Target level: {{targetLevel}}.
Career track: {{careerTrack}}.
Be precise, encouraging, and practical. Focus on professional, real-work usage.
Do not invent facts about the learner. Prefer concise, structured answers.
```

## Prompt: free-writing feedback

Purpose: evaluate a written text in a work context.

```
Text from the learner:
{{text}}

Give feedback as:
1. Strengths (2-3 bullets)
2. Issues, grouped by category (grammar, vocabulary, register/tone, clarity)
3. The single most important thing to fix next
Keep it actionable for a {{targetLevel}} learner.
```

## Prompt: mistake explanation

Purpose: explain one recorded mistake (does not affect scheduling or mastery).

```
Mistake:
- category: {{category}}
- expected: {{expected}}
- given: {{given}}
- context: {{context}}

Explain in 2-4 sentences why the expected form is correct and the given form is
not, at a level appropriate for {{targetLevel}}. Include one short example.
```

## Prompt: CEFR estimation

Purpose: estimate the level of a writing sample.

```
Estimate the CEFR level of this text for {{language}}:
{{text}}

Return JSON: { "estimatedLevel": "A1..C2", "confidence": "low|medium|high",
"reasoning": "one sentence" }. Judge against {{targetLevel}} as the goal.
```

## Prompt: improved text version

Purpose: produce a stronger rewrite that preserves intent.

```
Rewrite the learner's text to {{targetLevel}} quality for a professional work
context, preserving their intent and meaning:
{{text}}

Return: (1) the improved text, (2) a short list of the key changes and why.
```

## Prompt: personalized recommendations

Purpose: suggest what to practice next.

```
Learner signals:
- weak topics (from mastery): {{weakTopics}}
- recent mistake categories: {{recentMistakeCategories}}
- target: {{targetLevel}} for {{language}}

Recommend the next 3 things to practice, most impactful first. For each: the
topic, why it matters for {{careerTrack}}, and a one-line practice suggestion.
```

## Persistence note

Recommendations and feedback that are worth keeping are stored in PostgreSQL
(on the `WritingAttempt` row), and every call is logged as an `LlmRequestLog`
with its `CostRecord`. Prompts and their outputs are core data, never stored
only in `localStorage`.
