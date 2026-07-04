"use server";

// Server actions for the lesson flow (Phase 4).
//
// A thin orchestration boundary between the lesson UI and the deterministic
// domain + persistence layers. `recordExerciseAnswer` re-resolves the exercise
// from static content, re-checks the answer server-side (so the expected answer
// and correctness are never trusted from the client), and persists the attempt
// to PostgreSQL. No LLM is involved.

import { getAllLessons, getLessonById } from "@/domain/lessons";
import {
  checkAnswer,
  checkVocabularyMatch,
  findExerciseInLesson,
  findVocabularyItem,
} from "@/domain/practice";
import { selectReviewTasks } from "@/domain/review";
import {
  checkOpenGrammar,
  getOrCreateDefaultUser,
  loadReviewSourceData,
  recordExerciseAttempt,
  submitWritingAttempt,
  type OpenGrammarCheckView,
  type WritingFeedbackView,
} from "@/services/storage";
import {
  activityId as brandActivityId,
  exerciseId as brandExerciseId,
  lessonId as brandLessonId,
} from "@/lib/ids";
import {
  ActivityKind,
  ExerciseEvaluation,
  ExerciseFormat,
  MistakeSeverity,
  MistakeSource,
  SkillArea,
} from "@/types";
import type { WritingTask } from "@/types";

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
      task.kind === "grammar" &&
      task.sourceLessonId === lesson.id &&
      task.exercise.id === exercise.id,
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

/** The client's request to record one vocabulary term↔meaning match. */
export interface RecordVocabularyMatchInput {
  lessonId: string;
  term: string;
  /** The meaning the learner paired with the term. */
  given: string;
  /** True when the match came from a review block rather than the lesson body. */
  isReview?: boolean;
}

/**
 * Check a vocabulary match against static content and persist the attempt.
 *
 * Reuses the deterministic attempt pipeline (`recordExerciseAttempt` → mastery +
 * Error Engine): each term is its own mastery topic, and a wrong match becomes a
 * VOCABULARY mistake (category "Vocabulary", subcategory "Matching") eligible for
 * adaptive review. No LLM is involved. Returns the check so the UI can confirm
 * its optimistic green/red feedback.
 */
export async function recordVocabularyMatch(
  input: RecordVocabularyMatchInput,
): Promise<{ isCorrect: boolean; expectedMeaning: string }> {
  const lesson = getLessonById(brandLessonId(input.lessonId));
  if (!lesson) {
    throw new Error(`Unknown lesson: ${input.lessonId}`);
  }

  const item = findVocabularyItem(lesson, input.term);
  if (!item) {
    throw new Error(
      `Unknown vocabulary term "${input.term}" in lesson "${input.lessonId}"`,
    );
  }

  const check = checkVocabularyMatch(item, input.given);
  const userId = await getOrCreateDefaultUser();

  await recordExerciseAttempt({
    userId,
    lessonId: lesson.id,
    exerciseId: brandExerciseId(`${lesson.id}:vocab:${item.term}`),
    topic: item.term,
    category: "Vocabulary",
    subcategory: "Matching",
    severity: MistakeSeverity.Medium,
    exerciseFormat: ExerciseFormat.Matching,
    language: lesson.language,
    skillArea: SkillArea.Vocabulary,
    promptText: item.term,
    expectedAnswer: check.expectedMeaning,
    givenAnswer: check.givenMeaning,
    isCorrect: check.isCorrect,
    source: input.isReview ? MistakeSource.Review : MistakeSource.Exercise,
  });

  return { isCorrect: check.isCorrect, expectedMeaning: check.expectedMeaning };
}

/** The client's request to evaluate one writing submission. */
export interface SubmitWritingInput {
  lessonId: string;
  activityId: string;
  text: string;
}

/**
 * Evaluate a writing submission with the LLM and persist everything.
 *
 * The single LLM step in the learning loop. It re-resolves the writing task
 * from static content (the client never supplies the prompt or grouping), then
 * hands off to the storage layer, which saves the writing, calls Groq with
 * strict structured output, logs the request and cost, and folds the returned
 * mistakes into the Error Engine. Failures degrade gracefully: the returned
 * view reports `status: "failed"` while the writing itself is still saved.
 */
export async function submitWriting(
  input: SubmitWritingInput,
): Promise<WritingFeedbackView> {
  const lesson = getLessonById(brandLessonId(input.lessonId));
  if (!lesson) {
    throw new Error(`Unknown lesson: ${input.lessonId}`);
  }

  const targetActivityId = brandActivityId(input.activityId);
  const activity = lesson.activities.find(
    (candidate): candidate is WritingTask =>
      candidate.kind === ActivityKind.Writing &&
      candidate.id === targetActivityId,
  );
  if (!activity) {
    throw new Error(
      `Unknown writing task "${input.activityId}" in lesson "${input.lessonId}"`,
    );
  }

  const text = input.text.trim();
  if (text.length === 0) {
    throw new Error("Cannot evaluate empty writing");
  }

  const userId = await getOrCreateDefaultUser();

  return submitWritingAttempt({
    userId,
    lessonId: lesson.id,
    topic: lesson.topic,
    language: lesson.language,
    careerTrack: lesson.careerTrack,
    targetLevel: lesson.targetLevel,
    prompt: activity.prompt,
    requirements: activity.requirements,
    text,
  });
}

/** The client's request to check one open grammar answer with the LLM. */
export interface CheckOpenGrammarAnswerInput {
  lessonId: string;
  exerciseId: string;
  answer: string;
}

/**
 * Check an open grammar answer with the universal LLM mini-checker.
 *
 * Distinct from WritingTask feedback: this only judges grammatical validity and
 * whether the instruction was fulfilled, accepting alternative correct
 * formulations. It re-resolves the exercise from static content (so the sample
 * answer and topic are never trusted from the client), and the storage layer
 * validates the JSON, logs the call, and folds a wrong answer into the Error
 * Engine. Deterministic (graded) exercises never reach this path.
 */
export async function checkOpenGrammarAnswer(
  input: CheckOpenGrammarAnswerInput,
): Promise<OpenGrammarCheckView> {
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
  if (exercise.evaluation !== ExerciseEvaluation.Open) {
    throw new Error(
      `Exercise "${input.exerciseId}" is graded and is not checked by the LLM`,
    );
  }
  if (exercise.skillArea !== SkillArea.Grammar) {
    throw new Error(`Exercise "${input.exerciseId}" is not a grammar exercise`);
  }

  const answer = input.answer.trim();
  if (answer.length === 0) {
    throw new Error("Cannot check an empty answer");
  }

  const userId = await getOrCreateDefaultUser();

  return checkOpenGrammar({
    userId,
    lessonId: lesson.id,
    language: lesson.language,
    careerTrack: lesson.careerTrack,
    targetLevel: lesson.targetLevel,
    grammarTopic: lesson.topic,
    exerciseId: exercise.id,
    exerciseFormat: exercise.format,
    instruction: exercise.prompt,
    sampleAnswer: exercise.sampleAnswer,
    studentAnswer: answer,
  });
}
