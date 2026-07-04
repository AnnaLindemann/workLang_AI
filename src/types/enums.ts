// Business enums for the WorkLang AI domain model.
//
// These are the closed sets the engines and persistence layer agree on. They
// are defined here independently of Prisma (Phase 1 rule: the domain model must
// not import from the generated client). The string values intentionally mirror
// the enums in `prisma/schema.prisma` so a later mapping layer is a trivial
// pass-through, but nothing here depends on Prisma.
//
// The `const object + union type` pattern gives us both a runtime value (handy
// for iterating options in the UI) and a string-literal type under one name,
// while staying fully erasable TypeScript.

export const Language = {
  German: "GERMAN",
  English: "ENGLISH",
} as const;
export type Language = (typeof Language)[keyof typeof Language];

export const CareerTrack = {
  AiConsultant: "AI_CONSULTANT",
  CustomerSuccessHospitality: "CUSTOMER_SUCCESS_HOSPITALITY",
} as const;
export type CareerTrack = (typeof CareerTrack)[keyof typeof CareerTrack];

export const CefrLevel = {
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  C1: "C1",
  C2: "C2",
} as const;
export type CefrLevel = (typeof CefrLevel)[keyof typeof CefrLevel];

export const SkillArea = {
  Grammar: "GRAMMAR",
  Vocabulary: "VOCABULARY",
  Writing: "WRITING",
  Reading: "READING",
  Communication: "COMMUNICATION",
} as const;
export type SkillArea = (typeof SkillArea)[keyof typeof SkillArea];

export const ProgressStatus = {
  NotStarted: "NOT_STARTED",
  InProgress: "IN_PROGRESS",
  Completed: "COMPLETED",
} as const;
export type ProgressStatus =
  (typeof ProgressStatus)[keyof typeof ProgressStatus];

// The kind of segment within a lesson. This models the learning-loop steps
// (see docs/project-overview.md) and is a domain concept only — there is no
// Prisma counterpart because lesson structure is static content, not user data.
export const ActivityKind = {
  Review: "REVIEW",
  GrammarTheory: "GRAMMAR_THEORY",
  Vocabulary: "VOCABULARY",
  Reading: "READING",
  GrammarPractice: "GRAMMAR_PRACTICE",
  Writing: "WRITING",
} as const;
export type ActivityKind = (typeof ActivityKind)[keyof typeof ActivityKind];

// How a practice exercise is evaluated. This is a domain concept only (no
// Prisma counterpart): it splits practice into deterministically checkable
// tasks and semi-free production tasks that must not be graded strictly.
//
//   Graded → a closed answer (fill-in-the-blank, multiple choice, short
//            controlled answer). Checked locally with normalization and an
//            accepted-alternatives list.
//   Open   → a semi-free production task (sentence transformation, rewriting,
//            business sentence writing) with many valid answers. Phase 4 shows
//            a sample answer and explanation but never marks it wrong; graded
//            evaluation of free production arrives with the LLM layer (Phase 7).
export const ExerciseEvaluation = {
  Graded: "GRADED",
  Open: "OPEN",
} as const;
export type ExerciseEvaluation =
  (typeof ExerciseEvaluation)[keyof typeof ExerciseEvaluation];

// The concrete shape of a practice exercise. Domain-only metadata that records
// the task type behind an exercise's evaluation mode (see ExerciseEvaluation).
export const ExerciseFormat = {
  MultipleChoice: "MULTIPLE_CHOICE",
  FillBlank: "FILL_BLANK",
  ShortAnswer: "SHORT_ANSWER",
  Transformation: "TRANSFORMATION",
  Rewrite: "REWRITE",
  FreeSentence: "FREE_SENTENCE",
} as const;
export type ExerciseFormat =
  (typeof ExerciseFormat)[keyof typeof ExerciseFormat];

// Where a recorded mistake originated.
export const MistakeSource = {
  Exercise: "EXERCISE",
  Writing: "WRITING",
  Review: "REVIEW",
} as const;
export type MistakeSource = (typeof MistakeSource)[keyof typeof MistakeSource];

// What a review-queue entry points at.
export const ReviewItemType = {
  Mistake: "MISTAKE",
  Topic: "TOPIC",
} as const;
export type ReviewItemType =
  (typeof ReviewItemType)[keyof typeof ReviewItemType];

// Spaced-repetition lifecycle state of a review item.
export const ReviewState = {
  New: "NEW",
  Learning: "LEARNING",
  Review: "REVIEW",
  Lapsed: "LAPSED",
} as const;
export type ReviewState = (typeof ReviewState)[keyof typeof ReviewState];

// The LLM task that produced a request-log row.
export const LlmRequestType = {
  WritingFeedback: "WRITING_FEEDBACK",
  MistakeExplanation: "MISTAKE_EXPLANATION",
  CefrEstimation: "CEFR_ESTIMATION",
  TextImprovement: "TEXT_IMPROVEMENT",
  Recommendation: "RECOMMENDATION",
} as const;
export type LlmRequestType =
  (typeof LlmRequestType)[keyof typeof LlmRequestType];

export const LlmRequestStatus = {
  Pending: "PENDING",
  Success: "SUCCESS",
  Error: "ERROR",
} as const;
export type LlmRequestStatus =
  (typeof LlmRequestStatus)[keyof typeof LlmRequestStatus];
