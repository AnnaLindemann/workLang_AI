// Shared shell for the `/learn` lesson-taking flow (Phase 3).
//
// Provides a centered container and a slim header linking back to the homepage.
// The individual steps (language → track → lesson picker, then the in-lesson
// runner) render as children.

import Link from "next/link";

import styles from "./learn.module.css";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}>
          WorkLang AI
        </Link>
      </header>
      <main className={styles.container}>{children}</main>
    </div>
  );
}
