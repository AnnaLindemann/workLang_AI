// Lesson repository — read-only access to static lesson content.
//
// This is a content repository, not a database repository: it loads lessons
// from local project data (src/data/lessons) and exposes simple, pure
// read/query functions (see docs/lesson-engine.md and docs/roadmap.md). It holds
// no user data, performs no persistence, and contains no business logic — answer
// checking, mastery, review scheduling, and progress all belong to later phases.

import { lessons } from "@/data/lessons";
import type { CareerTrack, Language, Lesson, LessonId } from "@/types";

/** Return every lesson, in the catalog's stable order. */
export function getAllLessons(): readonly Lesson[] {
  return lessons;
}

/** Find a single lesson by its id, or `undefined` if none matches. */
export function getLessonById(id: LessonId): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

/** Return all lessons for a given language. */
export function getLessonsByLanguage(language: Language): readonly Lesson[] {
  return lessons.filter((lesson) => lesson.language === language);
}

/** Return all lessons for a given career track. */
export function getLessonsByTrack(track: CareerTrack): readonly Lesson[] {
  return lessons.filter((lesson) => lesson.careerTrack === track);
}

/** Return all lessons for a given language and career track. */
export function getLessonsByLanguageAndTrack(
  language: Language,
  track: CareerTrack,
): readonly Lesson[] {
  return lessons.filter(
    (lesson) => lesson.language === language && lesson.careerTrack === track,
  );
}

/**
 * Return the lesson that follows `currentLessonId` in the catalog's stable
 * order, or `undefined` if the id is the last lesson or is not in the catalog.
 *
 * This is pure static-catalog navigation, not learner progression: it depends
 * only on the fixed order of the local content and never reads user state.
 * Progress-aware "what to do next" logic belongs to later phases.
 */
export function getNextLesson(currentLessonId: LessonId): Lesson | undefined {
  const currentIndex = lessons.findIndex(
    (lesson) => lesson.id === currentLessonId,
  );
  if (currentIndex === -1) {
    return undefined;
  }
  return lessons[currentIndex + 1];
}
