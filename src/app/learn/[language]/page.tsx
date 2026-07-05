// Step 2 of the lesson flow: career-track selection for a chosen language.
//
// Lists the career tracks that have authored lessons for this language, read
// from the lesson repository (static content). No user data, no LLM.

import { notFound } from "next/navigation";

import { getLessonsByLanguageAndTrack } from "@/domain/lessons";
import { languageBySlug, trackCatalog } from "@/lib/selection";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  TrackLessonPicker,
  type TrackCard,
} from "@/components/track-lesson-picker";

import styles from "../learn.module.css";

export default async function TrackSelectionPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language: languageSlug } = await params;
  const language = languageBySlug(languageSlug);
  if (!language) {
    notFound();
  }

  // One card per track, each carrying its full lesson list so the learner picks
  // a specific lesson rather than always opening the first one. Labels are
  // numbered by the repository's stable authored order.
  const tracks: TrackCard[] = trackCatalog.map((track) => ({
    slug: track.slug,
    title: track.label,
    description: track.description,
    basePath: `/learn/${language.slug}/${track.slug}`,
    lessons: getLessonsByLanguageAndTrack(language.value, track.value).map(
      (lesson, index) => ({
        id: lesson.id,
        label: `${index + 1}. ${lesson.title}`,
      }),
    ),
  }));

  const hasAnyLessons = tracks.some((track) => track.lessons.length > 0);

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Learn", href: "/learn" }, { label: language.label }]}
      />
      <div className={styles.pageHeader}>
        <span className={styles.eyebrow}>Step 2 of 3</span>
        <h1 className={styles.pageTitle}>Choose a career track</h1>
        <p className={styles.pageSubtitle}>
          {language.label} lessons are anchored to a work context so practice
          stays relevant.
        </p>
      </div>
      {hasAnyLessons ? (
        <TrackLessonPicker tracks={tracks} />
      ) : (
        <p className={styles.empty}>
          No {language.label} lessons are available yet.
        </p>
      )}
    </>
  );
}
