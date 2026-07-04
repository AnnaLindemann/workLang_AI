// Public entry point for the persistence layer (Phase 4).
//
// The database-first store of record: PostgreSQL via Prisma. Server-only —
// these modules must never be imported into a client bundle. Repositories are
// added here as later phases persist more learner data.

export { prisma } from "./prisma";
export { getOrCreateDefaultUser } from "./user";
export {
  recordExerciseAttempt,
  type RecordExerciseAttemptInput,
} from "./exercise-attempt-repository";
export { processExerciseAttempt } from "./learning-engine-repository";
export { loadReviewSourceData } from "./review-repository";
