"use client";

// Reusable term↔meaning matching board (mobile-first, tap-to-match).
//
// Extracted from the original in-lesson matching so both the standalone
// Vocabulary Trainer and any future caller share one interaction. Tap a term on
// the left, then its meaning on the right: a correct pair locks green, a wrong
// pair flashes red and can be retried. Every tap — right or wrong — persists
// through the existing deterministic `recordVocabularyMatch` server action
// (mastery + Error Engine); each card carries its own `lessonId`, so a session
// can mix vocabulary from different lessons. No drag-and-drop, no LLM.

import { useMemo, useState, useTransition } from "react";

import { Language } from "@/types";
import { shuffle } from "@/lib/shuffle";
import { recordVocabularyMatch } from "@/app/learn/actions";

import { PronounceButton } from "./pronounce-button";
import styles from "./vocabulary-match-board.module.css";

export interface MatchCard {
  term: string;
  meaning: string;
  lessonId: string;
  language: Language;
  transcription?: string;
  pronunciationHint?: string;
}

// A meaning cell keeps the owning term's id, so duplicate meaning strings across
// cards stay distinct and match unambiguously.
interface MeaningCell {
  id: string;
  meaning: string;
}

export function VocabularyMatchBoard({
  cards,
  seed,
  isReview = false,
  onComplete,
}: {
  cards: MatchCard[];
  seed: string;
  isReview?: boolean;
  onComplete?: () => void;
}) {
  const cardByTerm = useMemo(
    () => new Map(cards.map((card) => [card.term, card])),
    [cards],
  );
  const [terms] = useState(() =>
    shuffle(
      cards.map((card) => card.term),
      `${seed}:terms`,
    ),
  );
  const [meaningCells] = useState(() =>
    shuffle(
      cards.map((card) => ({ id: card.term, meaning: card.meaning })),
      `${seed}:meanings`,
    ),
  );
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matchedTerms, setMatchedTerms] = useState<string[]>([]);
  const [wrong, setWrong] = useState<{
    term: string;
    meaningId: string;
  } | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [, startTransition] = useTransition();

  const done = matchedTerms.length === cards.length;

  function persist(card: MatchCard, meaning: string) {
    setSaveError(false);
    startTransition(async () => {
      try {
        await recordVocabularyMatch({
          lessonId: card.lessonId,
          term: card.term,
          given: meaning,
          isReview,
        });
      } catch {
        setSaveError(true);
      }
    });
  }

  function selectTerm(term: string) {
    if (matchedTerms.includes(term)) return;
    setWrong(null);
    setSelectedTerm(term);
  }

  function chooseMeaning(cell: MeaningCell) {
    if (selectedTerm === null || matchedTerms.includes(cell.id)) return;
    const term = selectedTerm;
    const card = cardByTerm.get(term);
    if (!card) return;
    persist(card, cell.meaning);
    if (cell.id === term) {
      const next = [...matchedTerms, term];
      setMatchedTerms(next);
      setSelectedTerm(null);
      setWrong(null);
      if (next.length === cards.length) onComplete?.();
    } else {
      setWrong({ term, meaningId: cell.id });
    }
  }

  function termCellClass(term: string): string {
    if (matchedTerms.includes(term)) {
      return `${styles.termCell} ${styles.matched}`;
    }
    if (wrong?.term === term) return `${styles.termCell} ${styles.wrong}`;
    if (selectedTerm === term) return `${styles.termCell} ${styles.selected}`;
    return styles.termCell;
  }

  function meaningCellClass(cell: MeaningCell): string {
    if (matchedTerms.includes(cell.id)) {
      return `${styles.meaningCell} ${styles.matched}`;
    }
    if (wrong?.meaningId === cell.id) {
      return `${styles.meaningCell} ${styles.wrong}`;
    }
    return styles.meaningCell;
  }

  return (
    <div>
      <p className={styles.intro}>
        Нажмите слово слева, затем его значение справа.
      </p>
      <div className={styles.board}>
        <ul className={styles.column}>
          {terms.map((term) => {
            const card = cardByTerm.get(term);
            const matched = matchedTerms.includes(term);
            return (
              <li key={term} className={termCellClass(term)}>
                <button
                  type="button"
                  className={styles.select}
                  onClick={() => selectTerm(term)}
                  disabled={matched}
                  aria-pressed={selectedTerm === term}
                >
                  <span className={styles.termText}>{term}</span>
                  {card?.transcription && (
                    <span className={styles.transcription}>
                      {card.transcription}
                    </span>
                  )}
                </button>
                {card && (
                  <PronounceButton text={term} language={card.language} />
                )}
              </li>
            );
          })}
        </ul>
        <ul className={styles.column}>
          {meaningCells.map((cell) => (
            <li
              key={`${cell.id}:${cell.meaning}`}
              className={styles.meaningWrap}
            >
              <button
                type="button"
                className={meaningCellClass(cell)}
                onClick={() => chooseMeaning(cell)}
                disabled={
                  matchedTerms.includes(cell.id) || selectedTerm === null
                }
              >
                {cell.meaning}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {done && (
        <p className={styles.doneNote} aria-live="polite">
          Все пары сопоставлены.
        </p>
      )}
      {saveError && (
        <p className={styles.status} aria-live="polite">
          Совпадение проверено, но сохранить попытку не удалось.
        </p>
      )}
    </div>
  );
}
