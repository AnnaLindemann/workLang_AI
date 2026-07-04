// Step 1 of the lesson flow: language selection.
//
// Lists the languages that actually have authored lessons, read from the
// lesson repository (static content). No user data, no LLM.

import { getLessonsByLanguage } from "@/domain/lessons";
import { languageCatalog } from "@/lib/selection";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SelectionGrid, type SelectionItem } from "@/components/selection-grid";

import styles from "./learn.module.css";

export default function LanguageSelectionPage() {
  const items: SelectionItem[] = languageCatalog
    .filter((language) => getLessonsByLanguage(language.value).length > 0)
    .map((language) => ({
      href: `/learn/${language.slug}`,
      title: language.label,
      description: language.tagline,
      badge: language.targetLabel,
    }));

  return (
    <>
      <Breadcrumbs items={[{ label: "Learn" }]} />
      <div className={styles.pageHeader}>
        <span className={styles.eyebrow}>Step 1 of 3</span>
        <h1 className={styles.pageTitle}>Choose a language</h1>
        <p className={styles.pageSubtitle}>
          Pick the language you want to practise for professional work.
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
