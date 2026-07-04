// Branded-id constructors.
//
// IDs in the domain model are branded strings (see src/types/ids.ts): plain
// strings at runtime, nominally tagged at compile time. Content authored in
// src/data/ and, later, rows read back from Prisma need to attach those brands
// to raw strings. These trivial constructors are the single, honest place that
// does the cast, so no id literal is cast inline and the intent stays explicit.

import type { ActivityId, ExerciseId, LessonId } from "@/types";

/** Brand a raw string as a `LessonId`. */
export const lessonId = (value: string): LessonId => value as LessonId;

/** Brand a raw string as an `ActivityId`. */
export const activityId = (value: string): ActivityId => value as ActivityId;

/** Brand a raw string as an `ExerciseId`. */
export const exerciseId = (value: string): ExerciseId => value as ExerciseId;
