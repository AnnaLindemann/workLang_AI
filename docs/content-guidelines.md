# WorkLang AI — Content Guidelines

This document is the required authoring specification for all future lessons.
It complements the lesson types in `src/types/lesson.ts` and the inventory in
[`content-catalog.md`](content-catalog.md).

## Before authoring a lesson

Before creating or changing lesson content:

1. Read this document and [`content-catalog.md`](content-catalog.md).
2. Inspect the existing lesson files in `src/data/lessons/` and the current
   lesson types in `src/types/lesson.ts`.
3. Confirm that neither the grammar topic nor the professional topic duplicates
   another lesson in the same language and career track.
4. Follow the structure, tone, ID conventions, and level of the existing
   lessons.
5. After adding a lesson, append it to `content-catalog.md` in the same change.

Do not invent unsupported fields in static lesson data. If this specification
requires a block that the current model cannot represent, extend the lesson
types and lesson UI first, with appropriate tests and documentation.

## Lesson Expansion Rules

When creating new lessons, Claude/Codex must always:

1. Read `content-catalog.md`.
2. Read existing lesson files.
3. Choose grammar topics that are not yet implemented.
4. Choose professional topics that are not duplicated within the same language
   and career track.
5. Maintain progressive difficulty across the curriculum.
6. Follow the style and structure of existing lessons.
7. Update `content-catalog.md` immediately after creating new lessons.

## Required lesson structure

Every future lesson must contain the following authored content. The review
block remains runtime-generated and may precede these blocks.

1. **Theory block** — an original, clearly sectioned grammar explanation with
   use cases, form, professional examples, common errors, and a concise
   takeaway. Explanations may be informed by reputable references, but must be
   written in original wording. Record the references in `Lesson.sources`.
2. **Vocabulary block** — approximately 15–25 mixed vocabulary items tied
   directly to both the grammar topic and the professional topic. See
   [Vocabulary requirements](#vocabulary-requirements).
3. **Grammar/practice block** — exactly 10 exercises following the theory.
   These exercises are separate from all reading and writing tasks. See
   [Practice requirements](#practice-requirements).
4. **Professional reading text** — an original text written for WorkLang AI,
   appropriate to the target CEFR level, career track, grammar focus, and
   professional scenario.
5. **Reading-related tasks** — include comprehension, interpretation, or
   language-noticing tasks when the current lesson model supports them. They
   are not part of the 10 grammar/practice exercises. The current model's
   `ReadingBlock` contains only `text`, so reading tasks require a model and UI
   extension before they can be authored as structured content.
6. **Writing task** — an original professional scenario with a clear output,
   suitable word range, and requirements that elicit the lesson grammar and
   vocabulary. It is not part of the 10 grammar/practice exercises.
7. **Lesson summary metadata** — a concise record of the grammar topic,
   professional topic, language, career track, lesson number and ID, target
   CEFR level, and source references. Existing `Lesson` fields cover most of
   this metadata; lesson number, professional topic, and an explicit summary
   are currently maintained in `content-catalog.md` until the lesson model is
   extended.

## Vocabulary requirements

The Vocabulary block is intentionally a mixed collection and is not limited to
single words. A typical lesson must contain approximately **15–25 items** with
a balanced mix of:

- individual vocabulary words;
- business terminology;
- collocations;
- idioms;
- fixed business expressions;
- reusable professional phrases;
- short sentence templates frequently used in professional communication.

Every item must relate directly to both the lesson's grammar topic and its
professional topic. Use contextual examples in the target language and clear
glosses consistent with existing lessons.

Previously introduced items may reappear in later lessons for deliberate
reinforcement. Each lesson must still introduce new vocabulary, without
unnecessary duplication or padding.

## Practice requirements

Each lesson must contain exactly **10 grammar/practice exercises** after the
theory. The set must satisfy all of these rules:

- Exactly **8** exercises are deterministic `GradedExercise` tasks, locally
  checkable with `expectedAnswer` and, where needed, `acceptedAnswers`.
- Exactly **2** exercises are LLM-evaluated open-answer grammar tasks represented
  by `OpenExercise`. Suitable tasks include meaning-preserving transformation,
  polite reformulation, Konjunktiv II reformulation, and improving cohesion with
  connectors.
- Each deterministic exercise has a complete answer key and explanation.
- Each open exercise has a sample answer and explicit evaluation criteria: the
  required transformation, grammatical accuracy, preservation of meaning, and
  any required register or connector use.
- Open tasks must allow several valid formulations; do not use an LLM where a
  complete local answer set is practical.
- Reading-related tasks and the writing task never count toward these 10
  exercises.

Use only exercise formats supported by the current types and checker. LLM
evaluation of open grammar exercises follows Roadmap Phase 7.2; the UI must
clearly identify it and deterministic exercises must never be sent to an LLM.

## Originality and quality

- All lesson content, examples, reading texts, scenarios, exercises, answer
  keys, and evaluation criteria must be original.
- Validate grammar against reputable sources such as Cambridge, Oxford,
  British Council, Goethe-Institut, Deutsche Welle, or Duden. Cite references
  for validation; do not copy their wording or exercises.
- Match the declared CEFR target and the existing lessons' instructional style.
- Keep the grammar and professional contexts integrated across theory,
  vocabulary, practice, reading, and writing.
- Check IDs, activity order, answer normalization, and locally checkable answers
  before merging.
