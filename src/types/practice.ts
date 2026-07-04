// Learner-interaction entities: progress, attempts, and the local answer check.
//
// These mirror the `LessonProgress`, `ExerciseAttempt`, and `WritingAttempt`
// persistence models as Prisma-independent domain types. The LLM-derived fields
// on a writing attempt are optional here because they are filled only later
// (Phase 7); deterministic data never depends on them.

import type {
  CareerTrack,
  CefrLevel,
  Language,
  MistakeSeverity,
  ProgressStatus,
  SkillArea,
} from "./enums";
import type {
  ExerciseAttemptId,
  ExerciseId,
  ISODateString,
  LessonId,
  LessonProgressId,
  UserId,
  WritingAttemptId,
} from "./ids";

/** Per-lesson progress for a user. `lessonId` references static content. */
export interface LessonProgress {
  id: LessonProgressId;
  userId: UserId;
  lessonId: LessonId;
  language: Language;
  status: ProgressStatus;
  correctCount: number;
  totalCount: number;
  startedAt?: ISODateString;
  completedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * The result of checking one answer locally — the value object the lesson
 * engine emits and the error/mastery engines consume. Deterministic and free
 * of any persistence or identity concerns.
 */
export interface AnswerCheck {
  isCorrect: boolean;
  expected: string;
  given: string;
  /** Normalized forms used for the comparison, when normalization applied. */
  normalizedExpected?: string;
  normalizedGiven?: string;
}

/** A single deterministic exercise attempt and its local check result. */
export interface ExerciseAttempt {
  id: ExerciseAttemptId;
  userId: UserId;
  lessonId?: LessonId;
  exerciseId: ExerciseId;
  topic: string;
  category: string;
  subcategory?: string;
  severity: MistakeSeverity;
  exerciseFormat: string;
  language: Language;
  skillArea: SkillArea;
  promptText?: string;
  expectedAnswer: string;
  givenAnswer: string;
  isCorrect: boolean;
  processedAt?: ISODateString;
  createdAt: ISODateString;
}

/**
 * A free-writing submission. `cefrEstimate`, `feedback`, and `improvedText`
 * are LLM-derived and remain undefined until the LLM layer (Phase 7) fills
 * them.
 */
export interface WritingAttempt {
  id: WritingAttemptId;
  userId: UserId;
  language: Language;
  careerTrack?: CareerTrack;
  prompt?: string;
  submittedText: string;
  cefrEstimate?: CefrLevel;
  feedback?: string;
  improvedText?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
