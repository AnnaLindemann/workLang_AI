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
import type {
  CareerTrack,
  CefrLevel,
  ExerciseEvaluation,
  ExerciseFormat,
  Language,
  SkillArea,
} from "./enums";
import type { ActivityId, ExerciseId, LessonId } from "./ids";

/** Fields shared by every practice exercise, regardless of how it is checked. */
interface ExerciseBase {
  id: ExerciseId;
  skillArea: SkillArea;
  prompt: string;
  /** The concrete task type (fill-in-the-blank, transformation, …). */
  format: ExerciseFormat;
  /** Optional teaching note shown after answering (target language). */
  explanation?: string;
}

/**
 * A deterministically checkable exercise: a closed answer verified locally
 * against `expectedAnswer` and any `acceptedAnswers` (normalized match) — see
 * docs/lesson-engine.md. No LLM is involved. Reserved for controlled formats
 * (fill-in-the-blank, multiple choice, short answers) where the set of correct
 * answers is small and enumerable.
 */
export interface GradedExercise extends ExerciseBase {
  evaluation: typeof ExerciseEvaluation.Graded;
  expectedAnswer: string;
  /** Additional answers accepted as correct (normalized-match alternatives). */
  acceptedAnswers?: string[];
}

/**
 * A semi-free production exercise (sentence transformation, rewriting, business
 * sentence writing). Many answers are valid, so it must never be marked wrong
 * by string comparison. Phase 4 shows `sampleAnswer` for self-comparison plus
 * the explanation; strict/LLM evaluation arrives in Phase 7.
 */
export interface OpenExercise extends ExerciseBase {
  evaluation: typeof ExerciseEvaluation.Open;
  /** A model answer the learner compares their own writing against. */
  sampleAnswer: string;
}

/** One practice exercise, discriminated by how it is evaluated. */
export type Exercise = GradedExercise | OpenExercise;

/** A single professional-vocabulary entry. */
export interface VocabularyItem {
  term: string;
  /** Russian translation/gloss of the term. */
  translation: string;
  /** Example usage in a work context, in the target language. */
  example?: string;
}

/**
 * One titled section of a grammar-theory explanation — the structure that keeps
 * theory from being one long paragraph (what it means, when to use it, the
 * formula, examples, typical mistakes, a takeaway). Headings and prose are in
 * Russian; example sentences under `items` stay in the target language.
 */
export interface TheorySection {
  /** Russian section heading. */
  heading: string;
  /** Russian explanatory prose for the section. */
  body?: string;
  /** List entries: target-language examples, or Russian bullet points. */
  items?: string[];
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

/** A grammar-theory explanation, broken into titled sections (see
 *  TheorySection). Explanations are in Russian; examples stay in the target
 *  language. */
export interface TheoryBlock extends ActivityBase {
  kind: typeof ActivityKind.GrammarTheory;
  sections: TheorySection[];
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

/** A grammar-practice set containing graded and/or open exercises. */
export interface PracticeTask extends ActivityBase {
  kind: typeof ActivityKind.GrammarPractice;
  exercises: Exercise[];
}

/** An inclusive target word range for a writing task. */
export interface WordRange {
  min: number;
  max: number;
}

/** A writing task: a real work-context scenario the learner writes for. */
export interface WritingTask extends ActivityBase {
  kind: typeof ActivityKind.Writing;
  prompt: string;
  /** Optional target word range shown next to a live word counter. */
  wordRange?: WordRange;
  /** Optional requirements shown as a checklist above the textarea (Russian). */
  requirements?: string[];
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
