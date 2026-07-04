// The in-lesson experience: loads a lesson by id and hands it to the client
// runner that steps through its activities.
//
// This is Phase 3 (Main Lesson UI): it presents each learning-loop screen. It
// does not check answers, record mistakes, compute mastery, or persist
// progress — those deterministic engines arrive in later phases. There is no
// LLM here.

import { notFound } from "next/navigation";

import { getLessonById } from "@/domain/lessons";
import { lessonId as brandLessonId } from "@/lib/ids";
import { languageBySlug, trackBySlug } from "@/lib/selection";
import { LessonRunner } from "@/components/lesson/lesson-runner";

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

  return (
    <LessonRunner
      lesson={lesson}
      language={{ label: language.label, slug: language.slug }}
      track={{ label: track.label, slug: track.slug }}
    />
  );
}
