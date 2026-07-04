import { MistakeSource } from "@/types";
import type { Language, MistakeSeverity, SkillArea } from "@/types";

export const DEFAULT_MISTAKE_SUBCATEGORY = "general";

export interface MistakeGroupingInput {
  userId: string;
  lessonId?: string | null;
  exerciseId: string;
  language: Language;
  skillArea: SkillArea;
  topic?: string | null;
  category?: string | null;
  subcategory?: string | null;
  severity?: MistakeSeverity | null;
  source?: MistakeSource;
}

/** Complete, stable grouping metadata for one persisted graded attempt. */
export function buildExerciseMistakeGroup(input: MistakeGroupingInput) {
  if (!input.lessonId || !input.topic || !input.category || !input.severity) {
    throw new Error(
      `Graded attempt "${input.exerciseId}" is missing mistake metadata`,
    );
  }

  return {
    userId: input.userId,
    lessonId: input.lessonId,
    language: input.language,
    skillArea: input.skillArea,
    topic: input.topic,
    category: input.category,
    subcategory: input.subcategory ?? DEFAULT_MISTAKE_SUBCATEGORY,
    severity: input.severity,
    source: input.source ?? MistakeSource.Exercise,
  } as const;
}
