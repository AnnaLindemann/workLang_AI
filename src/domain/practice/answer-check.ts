// Deterministic local answer checking for grammar practice.
//
// This is the heart of the Phase 4 practice engine: pure, framework-free
// functions that decide whether a learner's answer is correct — no LLM, no I/O
// (see docs/lesson-engine.md). Because they are pure they run identically on the
// server (where an attempt is persisted) and on the client (for immediate
// feedback); the source of truth for what "correct" means lives here alone.
//
// Only *graded* exercises are checked here — closed answers with a small,
// enumerable set of correct forms. Semi-free production exercises (sentence
// transformation, rewriting) have many valid answers and are deliberately not
// graded by string comparison; see ExerciseEvaluation and docs/lesson-engine.md.

import { ActivityKind } from "@/types";
import type {
  AnswerCheck,
  Exercise,
  ExerciseId,
  GradedExercise,
  Lesson,
} from "@/types";

/**
 * Normalize an answer for comparison. The steps, in order:
 *   1. trim the ends and collapse internal whitespace runs to one space;
 *   2. lower-case (case-insensitive matching);
 *   3. strip surrounding quotation marks and outer sentence punctuation, so a
 *      trailing period or wrapping quotes never causes a false negative.
 *
 * This stays deliberately conservative: it only touches whitespace, case, and
 * the *outer* edges of the string. Internal punctuation and word choice are
 * preserved, so checking does not become too loose. Anything beyond this (a
 * grammatically valid alternative) is expressed by listing explicit
 * `acceptedAnswers` in the content, not by weakening this function.
 */
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/^[\s"'«»„“”]+/, "")
    .replace(/[\s"'«»„“”.,;:!?]+$/, "");
}

/**
 * Check a given answer against a graded exercise's expected answer and any
 * accepted alternatives, using normalized comparison. Returns the structured
 * result the error and mastery engines consume — deterministic and identity
 * free.
 */
export function checkAnswer(
  exercise: GradedExercise,
  given: string,
): AnswerCheck {
  const normalizedGiven = normalizeAnswer(given);
  const candidates = [
    exercise.expectedAnswer,
    ...(exercise.acceptedAnswers ?? []),
  ];
  const isCorrect = candidates.some(
    (candidate) => normalizeAnswer(candidate) === normalizedGiven,
  );

  return {
    isCorrect,
    expected: exercise.expectedAnswer,
    given,
    normalizedExpected: normalizeAnswer(exercise.expectedAnswer),
    normalizedGiven,
  };
}

/**
 * Find an exercise by id within a lesson's grammar-practice activities, or
 * `undefined` if no activity contains it. Used server-side to resolve an
 * exercise from static content before checking and persisting an attempt, so
 * the expected answer is never trusted from the client.
 */
export function findExerciseInLesson(
  lesson: Lesson,
  exerciseId: ExerciseId,
): Exercise | undefined {
  for (const activity of lesson.activities) {
    if (activity.kind !== ActivityKind.GrammarPractice) {
      continue;
    }
    const match = activity.exercises.find(
      (exercise) => exercise.id === exerciseId,
    );
    if (match) {
      return match;
    }
  }
  return undefined;
}
