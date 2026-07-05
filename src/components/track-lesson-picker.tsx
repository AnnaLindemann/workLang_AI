"use client";

// Career-track cards with a per-track lesson selector (Step 2 of the /learn
// flow). Each card lets the learner pick a specific lesson from a native
// dropdown and open exactly that lesson, instead of always routing to the first
// one. Selection is transient client state only — no persistence, no
// localStorage. The page assembles the lesson options from the static lesson
// repository and passes them in; this component carries no data access.

import { useState } from "react";
import Link from "next/link";

import styles from "./track-lesson-picker.module.css";

export interface TrackLessonOption {
  /** Lesson id, used as the final route segment. */
  id: string;
  /** Human label, e.g. "1. Making recommendations: first and second conditionals". */
  label: string;
}

export interface TrackCard {
  /** Track slug, used for the card key and the lesson route. */
  slug: string;
  title: string;
  description: string;
  /** Route prefix for a lesson: `/learn/{language}/{track}`. */
  basePath: string;
  lessons: readonly TrackLessonOption[];
}

export function TrackLessonPicker({
  tracks,
}: {
  tracks: readonly TrackCard[];
}) {
  return (
    <div className={styles.grid}>
      {tracks.map((track) => (
        <TrackCardView key={track.slug} track={track} />
      ))}
    </div>
  );
}

function TrackCardView({ track }: { track: TrackCard }) {
  const hasLessons = track.lessons.length > 0;
  const [selectedId, setSelectedId] = useState(
    hasLessons ? track.lessons[0].id : "",
  );
  const selectId = `lesson-select-${track.slug}`;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{track.title}</h3>
      <p className={styles.description}>{track.description}</p>

      {hasLessons ? (
        <div className={styles.picker}>
          <label className={styles.label} htmlFor={selectId}>
            Choose a lesson
          </label>
          <select
            id={selectId}
            className={styles.select}
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
          >
            {track.lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.label}
              </option>
            ))}
          </select>
          <Link
            className={styles.openButton}
            href={`${track.basePath}/${selectedId}`}
          >
            Open lesson
          </Link>
        </div>
      ) : (
        <p className={styles.empty}>No lessons available yet.</p>
      )}
    </div>
  );
}
