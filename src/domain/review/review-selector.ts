import { ActivityKind, ExerciseEvaluation } from "@/types";
import type {
  CareerTrack,
  GradedExercise,
  Language,
  Lesson,
  MistakeSource,
  SkillArea,
  VocabularyItem,
} from "@/types";

export const MAX_REVIEW_TASKS = 5;
export const LOW_MASTERY_THRESHOLD = 0.6;
/** How many meanings a vocabulary review card offers (1 correct + distractors). */
const VOCAB_REVIEW_OPTION_COUNT = 4;

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

/** A grammar exercise resurfaced for review (Phase 6). */
export interface GrammarReviewTask {
  kind: "grammar";
  sourceLessonId: string;
  exercise: GradedExercise;
}

/**
 * A vocabulary term resurfaced for review as a term→meaning recall card
 * (Phase 7.1). Deterministic and LLM-free: the learner picks the meaning, the
 * server re-derives the correct one from static content. `options` includes the
 * correct meaning plus distractors from the same lesson; the client shuffles
 * them for display. Persistence and grouping mirror the vocabulary matching
 * exercise, so a wrong review pick updates the same mistake and mastery.
 */
export interface VocabularyReviewTask {
  kind: "vocabulary";
  sourceLessonId: string;
  term: string;
  correctMeaning: string;
  options: string[];
}

export type SelectedReviewTask = GrammarReviewTask | VocabularyReviewTask;

interface RankedTask {
  task: SelectedReviewTask;
  contextRank: number;
  occurrences: number;
  masteryScore: number;
  hasMistake: boolean;
  hasLowMastery: boolean;
  lessonOrder: number;
  itemOrder: number;
  tieBreakId: string;
}

/**
 * Select review tasks from persisted learning signals and local content.
 * Ranking is deterministic: repeated mistakes, low mastery, current context,
 * then the stable authored lesson/item order. Grammar exercises and vocabulary
 * recall cards share one pool and the same `MAX_REVIEW_TASKS` budget. Open
 * exercises never enter the pool. When there are no vocabulary mistakes or
 * low-mastery terms, the result is identical to the grammar-only selection.
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

  // Occurrences + low-mastery for one topic; the shared eligibility signal for
  // both grammar exercises (topic = grammar concept) and vocabulary (topic =
  // term). Returns null when the item is neither wrong nor weak, i.e. skipped.
  function evaluateTopic(topic: string) {
    const occurrences = relevantMistakes
      .filter((mistake) => mistake.topic === topic)
      .reduce((total, mistake) => total + mistake.occurrenceCount, 0);
    const masteryRecord = masteryByTopic.get(topic);
    const hasLowMastery =
      masteryRecord !== undefined &&
      masteryRecord.sampleSize > 0 &&
      masteryRecord.score < LOW_MASTERY_THRESHOLD;
    if (occurrences === 0 && !hasLowMastery) return null;
    return {
      occurrences,
      hasLowMastery,
      masteryScore: masteryRecord?.score ?? 1,
      hasMistake: occurrences > 0,
    };
  }

  function contextRankFor(lesson: Lesson): number {
    return lesson.id === context.lessonId
      ? 2
      : lesson.careerTrack === context.careerTrack
        ? 1
        : 0;
  }

  const ranked: RankedTask[] = [];

  lessons.forEach((lesson, lessonOrder) => {
    if (lesson.language !== context.language) return;
    const contextRank = contextRankFor(lesson);

    // Grammar exercises: unchanged from Phase 6 (own order counter over graded
    // exercises), so grammar-only selection is byte-for-byte identical.
    let exerciseOrder = 0;
    for (const activity of lesson.activities) {
      if (activity.kind !== ActivityKind.GrammarPractice) continue;
      for (const exercise of activity.exercises) {
        if (exercise.evaluation !== ExerciseEvaluation.Graded) continue;
        const signal = evaluateTopic(exercise.topic);
        if (signal) {
          ranked.push({
            task: { kind: "grammar", sourceLessonId: lesson.id, exercise },
            contextRank,
            ...signal,
            lessonOrder,
            itemOrder: exerciseOrder,
            tieBreakId: exercise.id,
          });
        }
        exerciseOrder += 1;
      }
    }

    // Vocabulary terms: a separate order counter so grammar ordering is never
    // shifted. A term is eligible when it has a matching mistake or low mastery.
    let vocabOrder = 0;
    for (const activity of lesson.activities) {
      if (activity.kind !== ActivityKind.Vocabulary) continue;
      for (const item of activity.items) {
        const signal = evaluateTopic(item.term);
        if (signal) {
          ranked.push({
            task: {
              kind: "vocabulary",
              sourceLessonId: lesson.id,
              term: item.term,
              correctMeaning: item.translation,
              options: buildMeaningOptions(item, activity.items),
            },
            contextRank,
            ...signal,
            lessonOrder,
            itemOrder: vocabOrder,
            tieBreakId: `vocab:${lesson.id}:${item.term}`,
          });
        }
        vocabOrder += 1;
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
        a.itemOrder - b.itemOrder ||
        a.tieBreakId.localeCompare(b.tieBreakId),
    )
    .slice(0, MAX_REVIEW_TASKS)
    .map(({ task }) => task);
}

/** The correct meaning plus up to a few distractors from the same lesson. */
function buildMeaningOptions(
  item: VocabularyItem,
  siblings: readonly VocabularyItem[],
): string[] {
  const distractors = siblings
    .filter((candidate) => candidate.term !== item.term)
    .map((candidate) => candidate.translation)
    .slice(0, VOCAB_REVIEW_OPTION_COUNT - 1);
  return [item.translation, ...distractors];
}
