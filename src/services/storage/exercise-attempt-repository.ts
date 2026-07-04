// Persistence for deterministic exercise attempts (Phase 4).
//
// Every checked practice answer is written to PostgreSQL as an append-only
// `ExerciseAttempt` row — never to localStorage (see docs/database.md). This
// repository is the boundary between the domain and Prisma: it takes plain
// domain values and maps them onto the `ExerciseAttempt` model. The domain
// enums share their string values with the Prisma enums, so the mapping is a
// direct pass-through.

import type {
  ExerciseId,
  Language,
  LessonId,
  SkillArea,
  UserId,
} from "@/types";

import { prisma } from "./prisma";

/** The data needed to record one deterministic exercise attempt. */
export interface RecordExerciseAttemptInput {
  userId: UserId;
  lessonId?: LessonId;
  exerciseId: ExerciseId;
  language: Language;
  skillArea: SkillArea;
  promptText?: string;
  expectedAnswer: string;
  givenAnswer: string;
  isCorrect: boolean;
}

/** Persist a single exercise attempt and its local check result. */
export async function recordExerciseAttempt(
  input: RecordExerciseAttemptInput,
): Promise<void> {
  await prisma.exerciseAttempt.create({
    data: {
      userId: input.userId,
      lessonId: input.lessonId,
      exerciseId: input.exerciseId,
      language: input.language,
      skillArea: input.skillArea,
      promptText: input.promptText,
      expectedAnswer: input.expectedAnswer,
      givenAnswer: input.givenAnswer,
      isCorrect: input.isCorrect,
    },
  });
}
