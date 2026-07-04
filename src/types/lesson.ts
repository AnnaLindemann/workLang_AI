// Static lesson-structure domain entities.
//
// These describe the *shape* of a lesson and its segments — the vocabulary the
// lesson repository (Phase 2) and lesson engine (Phase 4) build on. This file
// defines types only; no lesson content is authored here, and each segment
// carries just the essential fields so Phase 2 can extend without a rewrite.
//
// A lesson is an ordered list of `Activity` segments. `Activity` is a
// discriminated union (on `kind`) so each learning-loop step from
// docs/project-overview.md is a first-class, correctly-shaped type rather than
// one generic bag: ReviewTask → TheoryBlock → VocabularyBlock → ReadingBlock →
// PracticeTask → WritingTask.

import { ActivityKind } from "./enums";
import type { CareerTrack, CefrLevel, Language, SkillArea } from "./enums";
import type { ActivityId, ExerciseId, LessonId } from "./ids";

/**
 * A single deterministic exercise with a locally checkable answer. The lesson
 * engine checks `expectedAnswer` (and any `acceptedAnswers`) locally — see
 * docs/lesson-engine.md. No LLM is involved.
 */
export interface Exercise {
  id: ExerciseId;
  skillArea: SkillArea;
  prompt: string;
  expectedAnswer: string;
  /** Additional answers accepted as correct (normalized-match alternatives). */
  acceptedAnswers?: string[];
  /** Optional teaching note shown after answering. */
  explanation?: string;
}

/** A single professional-vocabulary entry. */
export interface VocabularyItem {
  term: string;
  translation: string;
  /** Example usage in a work context. */
  example?: string;
}

/** Fields shared by every lesson segment. */
interface ActivityBase {
  id: ActivityId;
  title?: string;
}

/** The adaptive review block that opens a lesson. Its due items are assembled
 *  at runtime from the review queue (see ReviewQueueItem); the static lesson
 *  only marks that a review step belongs here. */
export interface ReviewTask extends ActivityBase {
  kind: typeof ActivityKind.Review;
}

/** A grammar-theory explanation. */
export interface TheoryBlock extends ActivityBase {
  kind: typeof ActivityKind.GrammarTheory;
  content: string;
}

/** A professional-vocabulary set. */
export interface VocabularyBlock extends ActivityBase {
  kind: typeof ActivityKind.Vocabulary;
  items: VocabularyItem[];
}

/** A professional-reading passage. */
export interface ReadingBlock extends ActivityBase {
  kind: typeof ActivityKind.Reading;
  text: string;
}

/** A deterministic grammar-practice set with locally checked exercises. */
export interface PracticeTask extends ActivityBase {
  kind: typeof ActivityKind.GrammarPractice;
  exercises: Exercise[];
}

/** A writing task: a real work-context scenario the learner writes for. */
export interface WritingTask extends ActivityBase {
  kind: typeof ActivityKind.Writing;
  prompt: string;
}

/** One segment of a lesson, discriminated by `kind`. */
export type Activity =
  | ReviewTask
  | TheoryBlock
  | VocabularyBlock
  | ReadingBlock
  | PracticeTask
  | WritingTask;

/** A lesson: an ordered set of activities anchored to a language and track. */
export interface Lesson {
  id: LessonId;
  language: Language;
  careerTrack: CareerTrack;
  title: string;
  /** The CEFR level this lesson targets (German → C1, English → B2). */
  targetLevel: CefrLevel;
  activities: Activity[];
  /**
   * Reputable grammar references consulted when authoring this lesson's theory,
   * for validation only (see the content principles in docs/roadmap.md). These
   * are attributions in original wording — no copyrighted text is reproduced.
   */
  sources?: string[];
}
