// The Vocabulary Trainer page (a standalone learning mode).
//
// Server-loads one deterministic session (exactly five pairs) drawn from ALL
// lessons' vocabulary for the chosen language, ranked by the learner's persisted
// progress. Static vocabulary stays in lesson files; only progress lives in
// PostgreSQL. No LLM is involved anywhere in this flow.

import Link from "next/link";

import { getAllVocabulary, selectTrainerCards } from "@/domain/vocabulary";
import { languageCatalog, languageBySlug } from "@/lib/selection";
import {
  getOrCreateDefaultUser,
  loadVocabularyProgress,
} from "@/services/storage";
import {
  VocabularyTrainer,
  type TrainerCard,
} from "@/components/vocabulary/vocabulary-trainer";

import styles from "./vocabulary.module.css";

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const meta = languageBySlug(lang ?? "") ?? languageCatalog[0];
  const language = meta.value;

  const userId = await getOrCreateDefaultUser();
  const progress = await loadVocabularyProgress(userId, language);
  const session = selectTrainerCards(getAllVocabulary(language), progress);

  const cards: TrainerCard[] = session.map((item) => ({
    term: item.term,
    translation: item.translation,
    lessonId: item.lessonId,
    language: item.language,
    transcription: item.transcription,
    pronunciationHint: item.pronunciationHint,
    definition: item.definition,
    example: item.example,
  }));

  // The seed makes the board's shuffle stable for a given set of terms, and
  // changes when the next session's selection changes.
  const sessionSeed = cards.map((card) => card.term).join("|") || "empty";

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Vocabulary Trainer</h1>
        <p className={styles.subtitle}>
          Tap a term, then its meaning. Five pairs per round.
        </p>
        <div className={styles.langToggle} role="group" aria-label="Language">
          {languageCatalog.map((entry) => (
            <Link
              key={entry.slug}
              href={`/vocabulary?lang=${entry.slug}`}
              className={
                entry.value === language ? styles.langActive : styles.langLink
              }
              aria-current={entry.value === language ? "page" : undefined}
            >
              {entry.label}
            </Link>
          ))}
        </div>
      </div>
      <VocabularyTrainer cards={cards} sessionSeed={sessionSeed} />
    </>
  );
}
