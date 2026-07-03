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
        <p className={styles.status}>Phase 0.1 — Project Bootstrap</p>
        <h1 className={styles.title}>WorkLang AI</h1>
        <p className={styles.subtitle}>Professional Language Coach</p>
        <p className={styles.levels}>German C1 · English B2</p>
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
        <span className={styles.badge}>
          Status: Phase 0.1 Project Bootstrap
        </span>
      </footer>
    </main>
  );
}
