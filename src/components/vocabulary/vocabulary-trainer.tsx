"use client";

// The standalone Vocabulary Trainer session (client shell).
//
// The server selects exactly five pairs deterministically and passes them in.
// This renders the shared matching board and, on completion, offers another
// round — `router.refresh()` re-runs the server selection against the freshly
// updated progress, so the next five pairs reflect what was just practiced.

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Language } from "@/types";

import { VocabularyMatchBoard, type MatchCard } from "./vocabulary-match-board";
import styles from "./vocabulary-trainer.module.css";

export interface TrainerCard {
  term: string;
  translation: string;
  lessonId: string;
  language: Language;
  transcription?: string;
  pronunciationHint?: string;
  definition?: string;
  example?: string;
}

export function VocabularyTrainer({
  cards,
  sessionSeed,
}: {
  cards: TrainerCard[];
  sessionSeed: string;
}) {
  const router = useRouter();
  const [complete, setComplete] = useState(false);

  if (cards.length === 0) {
    return (
      <p className={styles.empty}>
        Словарь для этого языка пока пуст. Пройдите уроки, чтобы наполнить
        тренажёр.
      </p>
    );
  }

  const matchCards: MatchCard[] = cards.map((card) => ({
    term: card.term,
    meaning: card.translation,
    lessonId: card.lessonId,
    language: card.language,
    transcription: card.transcription,
    pronunciationHint: card.pronunciationHint,
  }));

  return (
    <div className={styles.session}>
      <VocabularyMatchBoard
        key={sessionSeed}
        cards={matchCards}
        seed={sessionSeed}
        onComplete={() => setComplete(true)}
      />
      {complete && (
        <div className={styles.done}>
          <p className={styles.doneText}>
            Готово! Раунд из {cards.length} слов пройден.
          </p>
          <button
            type="button"
            className={styles.nextButton}
            onClick={() => {
              setComplete(false);
              router.refresh();
            }}
          >
            Ещё слова
          </button>
        </div>
      )}
    </div>
  );
}
