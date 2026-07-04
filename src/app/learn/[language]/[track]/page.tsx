// Step 3 of the lesson flow: lesson selection for a language + career track.
//
// Lists the lessons for the chosen language and track from the lesson
// repository (static content). Each card links into the in-lesson runner. No
// user data, no LLM.

import { notFound } from "next/navigation";

import { getLessonsByLanguageAndTrack } from "@/domain/lessons";
import { languageBySlug, trackBySlug } from "@/lib/selection";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SelectionGrid, type SelectionItem } from "@/components/selection-grid";

import styles from "../../learn.module.css";

export default async function LessonSelectionPage({
  params,
}: {
  params: Promise<{ language: string; track: string }>;
}) {
  const { language: languageSlug, track: trackSlug } = await params;
  const language = languageBySlug(languageSlug);
  const track = trackBySlug(trackSlug);
  if (!language || !track) {
    notFound();
  }

  const lessons = getLessonsByLanguageAndTrack(language.value, track.value);
  const items: SelectionItem[] = lessons.map((lesson) => ({
    href: `/learn/${language.slug}/${track.slug}/${lesson.id}`,
    title: lesson.title,
    description: `${lesson.activities.length} activities across the learning loop.`,
    badge: lesson.targetLevel,
  }));

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Learn", href: "/learn" },
          { label: language.label, href: `/learn/${language.slug}` },
          { label: track.label },
        ]}
      />
      <div className={styles.pageHeader}>
        <span className={styles.eyebrow}>Step 3 of 3</span>
        <h1 className={styles.pageTitle}>Choose a lesson</h1>
        <p className={styles.pageSubtitle}>
          {language.label} · {track.label}
        </p>
      </div>
      {items.length > 0 ? (
        <SelectionGrid items={items} />
      ) : (
        <p className={styles.empty}>No lessons are available yet.</p>
      )}
    </>
  );
}
