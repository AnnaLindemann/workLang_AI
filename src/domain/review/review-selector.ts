import { ActivityKind, ExerciseEvaluation } from "@/types";
import type {
  CareerTrack,
  GradedExercise,
  Language,
  Lesson,
  MistakeSource,
  SkillArea,
} from "@/types";

export const MAX_REVIEW_TASKS = 5;
export const LOW_MASTERY_THRESHOLD = 0.6;

export interface ReviewMistakeRecord {
  lessonId: string;
  language: Language;
  topic: string;
  occurrenceCount: number;
  lastOccurredAt: Date;
  source: MistakeSource;
}

export interface ReviewMasteryRecord {
  language: Language;
  topic: string;
  skillArea: SkillArea | null;
  score: number;
  sampleSize: number;
}

export interface ReviewSelectionContext {
  lessonId: string;
  language: Language;
  careerTrack: CareerTrack;
}

export interface SelectedReviewTask {
  sourceLessonId: string;
  exercise: GradedExercise;
}

interface RankedTask extends SelectedReviewTask {
  contextRank: number;
  occurrences: number;
  masteryScore: number;
  hasMistake: boolean;
  hasLowMastery: boolean;
  lessonOrder: number;
  exerciseOrder: number;
}

/**
 * Select review tasks from persisted learning signals and local graded content.
 * Ranking is deterministic: context, repeated mistakes, low mastery, then the
 * stable authored lesson/exercise order. Open exercises never enter the pool.
 */
export function selectReviewTasks(
  lessons: readonly Lesson[],
  mistakes: readonly ReviewMistakeRecord[],
  mastery: readonly ReviewMasteryRecord[],
  context: ReviewSelectionContext,
): SelectedReviewTask[] {
  const relevantMistakes = mistakes.filter(
    (mistake) => mistake.language === context.language,
  );
  const masteryByTopic = new Map(
    mastery
      .filter((record) => record.language === context.language)
      .map((record) => [record.topic, record]),
  );
  const ranked: RankedTask[] = [];

  lessons.forEach((lesson, lessonOrder) => {
    if (lesson.language !== context.language) return;

    let exerciseOrder = 0;
    for (const activity of lesson.activities) {
      if (activity.kind !== ActivityKind.GrammarPractice) continue;

      for (const exercise of activity.exercises) {
        if (exercise.evaluation !== ExerciseEvaluation.Graded) continue;

        const matchingMistakes = relevantMistakes.filter(
          (mistake) => mistake.topic === exercise.topic,
        );
        const occurrences = matchingMistakes.reduce(
          (total, mistake) => total + mistake.occurrenceCount,
          0,
        );
        const masteryRecord = masteryByTopic.get(exercise.topic);
        const hasLowMastery =
          masteryRecord !== undefined &&
          masteryRecord.sampleSize > 0 &&
          masteryRecord.score < LOW_MASTERY_THRESHOLD;

        if (occurrences === 0 && !hasLowMastery) {
          exerciseOrder += 1;
          continue;
        }

        const contextRank =
          lesson.id === context.lessonId
            ? 2
            : lesson.careerTrack === context.careerTrack
              ? 1
              : 0;
        ranked.push({
          sourceLessonId: lesson.id,
          exercise,
          contextRank,
          occurrences,
          masteryScore: masteryRecord?.score ?? 1,
          hasMistake: occurrences > 0,
          hasLowMastery,
          lessonOrder,
          exerciseOrder,
        });
        exerciseOrder += 1;
      }
    }
  });

  return ranked
    .sort(
      (a, b) =>
        Number(b.occurrences > 1) - Number(a.occurrences > 1) ||
        b.occurrences - a.occurrences ||
        Number(b.hasLowMastery) - Number(a.hasLowMastery) ||
        a.masteryScore - b.masteryScore ||
        b.contextRank - a.contextRank ||
        Number(b.hasMistake) - Number(a.hasMistake) ||
        a.lessonOrder - b.lessonOrder ||
        a.exerciseOrder - b.exerciseOrder ||
        a.exercise.id.localeCompare(b.exercise.id),
    )
    .slice(0, MAX_REVIEW_TASKS)
    .map(({ sourceLessonId, exercise }) => ({ sourceLessonId, exercise }));
}
