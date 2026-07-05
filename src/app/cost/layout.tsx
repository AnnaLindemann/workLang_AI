// Shell for the standalone Cost Tracking & Observability page (Phase 8).
//
// Mobile-first container with a slim header linking back to the homepage and
// across to the lessons and vocabulary trainer, matching the other top-level
// modes. Read-only: this surface only reports persisted LLM cost data.

import Link from "next/link";

import styles from "./cost.module.css";

export default function CostLayout({
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
          <Link href="/vocabulary" className={styles.navLink}>
            Vocabulary
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
