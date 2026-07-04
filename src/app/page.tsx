import Link from "next/link";

import styles from "./page.module.css";

const tracks = [
  {
    title: "AI Consultant",
    description:
      "Professional vocabulary, business writing, and reading for AI advisory work.",
  },
  {
    title: "Customer Success / Hospitality with AI",
    description:
      "Written communication and professional language for client-facing roles.",
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={styles.status}>Phase 3 — Main Lesson UI</p>
        <h1 className={styles.title}>WorkLang AI</h1>
        <p className={styles.subtitle}>Professional Language Coach</p>
        <p className={styles.levels}>German C1 · English B2</p>
        <div className={styles.heroActions}>
          <Link href="/learn" className={styles.cta}>
            Start learning
          </Link>
          <Link href="/vocabulary" className={styles.ctaSecondary}>
            Vocabulary Trainer
          </Link>
        </div>
      </section>

      <section className={styles.tracks}>
        <h2 className={styles.tracksHeading}>Career Tracks</h2>
        <div className={styles.trackGrid}>
          {tracks.map((track) => (
            <article key={track.title} className={styles.trackCard}>
              <h3 className={styles.trackTitle}>{track.title}</h3>
              <p className={styles.trackDescription}>{track.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.badge}>Status: Phase 3 Main Lesson UI</span>
      </footer>
    </main>
  );
}
