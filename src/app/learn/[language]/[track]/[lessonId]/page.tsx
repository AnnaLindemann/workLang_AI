// The in-lesson experience: loads a lesson by id and hands it to the client
// runner that steps through its activities.
//
// The server loads persisted mistake/mastery signals for the deterministic
// opening review, while static lesson content remains local. There is no LLM.

import { notFound } from "next/navigation";

import { getAllLessons, getLessonById } from "@/domain/lessons";
import { selectReviewTasks } from "@/domain/review";
import { lessonId as brandLessonId } from "@/lib/ids";
import { languageBySlug, trackBySlug } from "@/lib/selection";
import { LessonRunner } from "@/components/lesson/lesson-runner";
import {
  getOrCreateDefaultUser,
  loadReviewSourceData,
} from "@/services/storage";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ language: string; track: string; lessonId: string }>;
}) {
  const { language: languageSlug, track: trackSlug, lessonId } = await params;

  const language = languageBySlug(languageSlug);
  const track = trackBySlug(trackSlug);
  const lesson = getLessonById(brandLessonId(lessonId));

  // Reject a lesson that does not exist or whose language/track do not match
  // the URL, so the breadcrumbs and back link stay honest.
  if (
    !language ||
    !track ||
    !lesson ||
    lesson.language !== language.value ||
    lesson.careerTrack !== track.value
  ) {
    notFound();
  }

  const userId = await getOrCreateDefaultUser();
  const { mistakes, mastery } = await loadReviewSourceData(
    userId,
    lesson.language,
  );
  const reviewTasks = selectReviewTasks(getAllLessons(), mistakes, mastery, {
    lessonId: lesson.id,
    language: lesson.language,
    careerTrack: lesson.careerTrack,
  });

  return (
    <LessonRunner
      lesson={lesson}
      language={{ label: language.label, slug: language.slug }}
      track={{ label: track.label, slug: track.slug }}
      reviewTasks={reviewTasks}
    />
  );
}
