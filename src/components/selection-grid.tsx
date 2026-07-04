// A grid of linked selection cards, shared by the language, career-track, and
// lesson pickers in the `/learn` flow.
//
// Presentational only: each card is a next/link to the next step in the flow.
// It carries no state and performs no data access — the pages assemble the
// items from the lesson repository and pass them in.

import Link from "next/link";

import styles from "./selection-grid.module.css";

export interface SelectionItem {
  /** Stable key + destination for the card. */
  href: string;
  title: string;
  description?: string;
  /** Optional short badge, e.g. a CEFR target or a lesson count. */
  badge?: string;
}

export function SelectionGrid({ items }: { items: readonly SelectionItem[] }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </div>
          {item.description && (
            <p className={styles.cardDescription}>{item.description}</p>
          )}
          <span className={styles.cardCta} aria-hidden="true">
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
