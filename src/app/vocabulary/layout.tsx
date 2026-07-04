// Shell for the standalone Vocabulary Trainer (a separate learning mode, not
// part of the lesson flow). Mobile-first container with a slim header linking
// back to the homepage and across to the lessons.

import Link from "next/link";

import styles from "./vocabulary.module.css";

export default function VocabularyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          WorkLang AI
        </Link>
        <nav className={styles.nav}>
          <Link href="/learn" className={styles.navLink}>
            Lessons
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
