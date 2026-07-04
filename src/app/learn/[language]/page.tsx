// Step 2 of the lesson flow: career-track selection for a chosen language.
//
// Lists the career tracks that have authored lessons for this language, read
// from the lesson repository (static content). No user data, no LLM.

import { notFound } from "next/navigation";

import { getLessonsByLanguageAndTrack } from "@/domain/lessons";
import { languageBySlug, trackCatalog } from "@/lib/selection";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SelectionGrid, type SelectionItem } from "@/components/selection-grid";

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

  const items: SelectionItem[] = trackCatalog
    .map((track) => ({
      track,
      count: getLessonsByLanguageAndTrack(language.value, track.value).length,
    }))
    .filter((entry) => entry.count > 0)
    .map(({ track, count }) => ({
      href: `/learn/${language.slug}/${track.slug}`,
      title: track.label,
      description: track.description,
      badge: `${count} lesson${count === 1 ? "" : "s"}`,
    }));

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
      {items.length > 0 ? (
        <SelectionGrid items={items} />
      ) : (
        <p className={styles.empty}>
          No {language.label} lessons are available yet.
        </p>
      )}
    </>
  );
}
