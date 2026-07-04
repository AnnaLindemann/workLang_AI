// Identifier and primitive value-object types.
//
// IDs are string-based (Phase 1 rule) but branded so that, for example, a
// `LessonId` cannot be passed where a `UserId` is expected. Branding is a
// compile-time-only device: at runtime these are plain strings, so they map
// cleanly to/from Prisma's `String @id` columns without any conversion.

declare const __brand: unique symbol;

/** Attaches a compile-time-only nominal tag `B` to a base type `T`. */
export type Brand<T, B extends string> = T & { readonly [__brand]: B };

export type UserId = Brand<string, "UserId">;
export type LessonId = Brand<string, "LessonId">;
export type ActivityId = Brand<string, "ActivityId">;
export type ExerciseId = Brand<string, "ExerciseId">;
export type LessonProgressId = Brand<string, "LessonProgressId">;
export type ExerciseAttemptId = Brand<string, "ExerciseAttemptId">;
export type WritingAttemptId = Brand<string, "WritingAttemptId">;
export type MistakeId = Brand<string, "MistakeId">;
export type MasteryRecordId = Brand<string, "MasteryRecordId">;
export type ReviewQueueItemId = Brand<string, "ReviewQueueItemId">;
export type LlmRequestLogId = Brand<string, "LlmRequestLogId">;
export type CostRecordId = Brand<string, "CostRecordId">;

/**
 * A timestamp carried as an ISO-8601 string. The domain model uses strings
 * rather than `Date` so entities are serializable across the server/client
 * boundary and remain independent of how Prisma represents dates.
 */
export type ISODateString = Brand<string, "ISODateString">;
