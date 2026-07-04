"use server";

// Server actions for the lesson flow (Phase 4).
//
// A thin orchestration boundary between the lesson UI and the deterministic
// domain + persistence layers. `recordExerciseAnswer` re-resolves the exercise
// from static content, re-checks the answer server-side (so the expected answer
// and correctness are never trusted from the client), and persists the attempt
// to PostgreSQL. No LLM is involved.

import { getLessonById } from "@/domain/lessons";
import { checkAnswer, findExerciseInLesson } from "@/domain/practice";
import {
  getOrCreateDefaultUser,
  recordExerciseAttempt,
} from "@/services/storage";
import {
  exerciseId as brandExerciseId,
  lessonId as brandLessonId,
} from "@/lib/ids";
import { ExerciseEvaluation } from "@/types";

/** The client's request to record one practice answer. */
export interface RecordExerciseAnswerInput {
  lessonId: string;
  exerciseId: string;
  given: string;
}

/**
 * Check a practice answer against static content and persist the attempt.
 *
 * Returns nothing: the UI shows immediate feedback from the same deterministic
 * checker running locally, and this action is the authoritative persistence
 * path. It throws if the lesson or exercise id does not resolve, or if the write
 * fails.
 */
export async function recordExerciseAnswer(
  input: RecordExerciseAnswerInput,
): Promise<void> {
  const lesson = getLessonById(brandLessonId(input.lessonId));
  if (!lesson) {
    throw new Error(`Unknown lesson: ${input.lessonId}`);
  }

  const exercise = findExerciseInLesson(
    lesson,
    brandExerciseId(input.exerciseId),
  );
  if (!exercise) {
    throw new Error(
      `Unknown exercise "${input.exerciseId}" in lesson "${input.lessonId}"`,
    );
  }

  // Only graded exercises produce a deterministic attempt to persist. Semi-free
  // production exercises are self-checked against a sample answer and are never
  // graded by string comparison (see ExerciseEvaluation).
  if (exercise.evaluation !== ExerciseEvaluation.Graded) {
    throw new Error(
      `Exercise "${input.exerciseId}" is not graded and cannot be recorded`,
    );
  }

  const check = checkAnswer(exercise, input.given);
  const userId = await getOrCreateDefaultUser();

  await recordExerciseAttempt({
    userId,
    lessonId: lesson.id,
    exerciseId: exercise.id,
    language: lesson.language,
    skillArea: exercise.skillArea,
    promptText: exercise.prompt,
    expectedAnswer: check.expected,
    givenAnswer: check.given,
    isCorrect: check.isCorrect,
  });
}
