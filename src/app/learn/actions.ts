"use server";

// Server actions for the lesson flow (Phase 4).
//
// A thin orchestration boundary between the lesson UI and the deterministic
// domain + persistence layers. `recordExerciseAnswer` re-resolves the exercise
// from static content, re-checks the answer server-side (so the expected answer
// and correctness are never trusted from the client), and persists the attempt
// to PostgreSQL. No LLM is involved.

import { getAllLessons, getLessonById } from "@/domain/lessons";
import { checkAnswer, findExerciseInLesson } from "@/domain/practice";
import { selectReviewTasks } from "@/domain/review";
import {
  getOrCreateDefaultUser,
  loadReviewSourceData,
  recordExerciseAttempt,
} from "@/services/storage";
import {
  exerciseId as brandExerciseId,
  lessonId as brandLessonId,
} from "@/lib/ids";
import { ExerciseEvaluation, MistakeSource } from "@/types";

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
    topic: exercise.topic,
    category: exercise.category,
    subcategory: exercise.subcategory,
    severity: exercise.severity,
    exerciseFormat: exercise.format,
    language: lesson.language,
    skillArea: exercise.skillArea,
    promptText: exercise.prompt,
    expectedAnswer: check.expected,
    givenAnswer: check.given,
    isCorrect: check.isCorrect,
  });
}

export interface RecordReviewAnswerInput {
  lessonId: string;
  sourceLessonId: string;
  exerciseId: string;
  given: string;
}

/** Persist a selected review answer through the normal Phase 5 pipeline. */
export async function recordReviewAnswer(
  input: RecordReviewAnswerInput,
): Promise<void> {
  const currentLesson = getLessonById(brandLessonId(input.lessonId));
  const lesson = getLessonById(brandLessonId(input.sourceLessonId));
  if (!currentLesson || !lesson) {
    throw new Error(`Unknown review source lesson: ${input.sourceLessonId}`);
  }

  const exercise = findExerciseInLesson(
    lesson,
    brandExerciseId(input.exerciseId),
  );
  if (!exercise || exercise.evaluation !== ExerciseEvaluation.Graded) {
    throw new Error(
      `Unknown or non-graded review exercise: ${input.exerciseId}`,
    );
  }

  const userId = await getOrCreateDefaultUser();
  const sourceData = await loadReviewSourceData(userId, currentLesson.language);
  const selected = selectReviewTasks(
    getAllLessons(),
    sourceData.mistakes,
    sourceData.mastery,
    {
      lessonId: currentLesson.id,
      language: currentLesson.language,
      careerTrack: currentLesson.careerTrack,
    },
  );
  const isSelected = selected.some(
    (task) =>
      task.sourceLessonId === lesson.id && task.exercise.id === exercise.id,
  );
  if (!isSelected) {
    throw new Error(
      `Exercise "${input.exerciseId}" is not selected for review`,
    );
  }

  const check = checkAnswer(exercise, input.given);
  await recordExerciseAttempt({
    userId,
    lessonId: lesson.id,
    exerciseId: exercise.id,
    topic: exercise.topic,
    category: exercise.category,
    subcategory: exercise.subcategory,
    severity: exercise.severity,
    exerciseFormat: exercise.format,
    language: lesson.language,
    skillArea: exercise.skillArea,
    promptText: exercise.prompt,
    expectedAnswer: check.expected,
    givenAnswer: check.given,
    isCorrect: check.isCorrect,
    source: MistakeSource.Review,
  });
}
