// Cost Tracking & Observability page (Phase 8).
//
// A read-only, mobile-first view of LLM spend. It server-loads the summary from
// PostgreSQL (the persisted LlmRequestLog + CostRecord rows written in Phase 7)
// and reports the latest request cost, the latest writing-attempt (session)
// cost, the lifetime total, per-type and per-model breakdowns, and a recent-call
// audit trail. No LLM is called here — this surface only reflects what was
// already logged, so every dollar shown is auditable back to a request row.
//
// Scope note: the schema links an LLM request to a writing attempt but never to
// a lesson, so "session" cost is reported at writing-attempt granularity — the
// closest reliable scope. See src/domain/cost/summary.ts.

import { LlmRequestStatus, LlmRequestType } from "@/types";
import type {
  CostBreakdownRow,
  RequestLogEntry,
  ScopedCost,
} from "@/domain/cost";
import { getOrCreateDefaultUser, loadCostSummary } from "@/services/storage";

import styles from "./cost.module.css";

export const metadata = {
  title: "LLM Cost & Usage — WorkLang AI",
  description: "Transparent, auditable LLM cost tracking read from PostgreSQL.",
};

// Server component reads live from the database; never statically cached.
export const dynamic = "force-dynamic";

const REQUEST_TYPE_LABELS: Record<LlmRequestType, string> = {
  [LlmRequestType.WritingFeedback]: "Writing feedback",
  [LlmRequestType.MistakeExplanation]: "Mistake explanation",
  [LlmRequestType.CefrEstimation]: "CEFR estimation",
  [LlmRequestType.TextImprovement]: "Text improvement",
  [LlmRequestType.Recommendation]: "Recommendation",
  [LlmRequestType.GrammarCheck]: "Open grammar check",
};

const STATUS_LABELS: Record<LlmRequestStatus, string> = {
  [LlmRequestStatus.Success]: "Success",
  [LlmRequestStatus.Error]: "Error",
  [LlmRequestStatus.Pending]: "Pending",
};

function requestTypeLabel(value: string): string {
  return REQUEST_TYPE_LABELS[value as LlmRequestType] ?? value;
}

function statusLabel(value: string): string {
  return STATUS_LABELS[value as LlmRequestStatus] ?? value;
}

/** Smart USD formatter: keeps sub-cent precision without noisy trailing zeros. */
function formatUsd(amount: number, currency = "USD"): string {
  const prefix = currency === "USD" ? "$" : `${currency} `;
  if (amount === 0) return `${prefix}0.00`;
  const decimals = amount >= 1 ? 2 : amount >= 0.01 ? 4 : 6;
  return `${prefix}${amount.toFixed(decimals)}`;
}

function formatTokens(count: number): string {
  return count.toLocaleString("en-US");
}

function formatLatency(ms: number | null): string {
  return ms == null ? "—" : `${ms.toLocaleString("en-US")} ms`;
}

/** Fixed, locale-independent UTC stamp so server rendering is deterministic. */
function formatTimestamp(iso: string): string {
  return `${iso.slice(0, 16).replace("T", " ")} UTC`;
}

function statusClass(status: string): string {
  switch (status) {
    case LlmRequestStatus.Success:
      return styles.statusSuccess;
    case LlmRequestStatus.Error:
      return styles.statusError;
    default:
      return styles.statusPending;
  }
}

export default async function CostPage() {
  const userId = await getOrCreateDefaultUser();
  const summary = await loadCostSummary(userId);
  const { totals } = summary;

  if (totals.requestCount === 0) {
    return (
      <>
        <Header />
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No LLM activity yet</p>
          <p className={styles.emptyText}>
            Cost and usage appear here as soon as the app makes its first LLM
            call — for example, when you submit a writing task or an open
            grammar answer for AI feedback. Every call is recorded in
            PostgreSQL, so this page always reflects real, auditable spend.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {summary.latestRequest ? (
        <LatestRequestCard
          entry={summary.latestRequest}
          currency={totals.currency}
        />
      ) : null}

      {summary.latestWritingAttempt ? (
        <WritingAttemptCard
          scope={summary.latestWritingAttempt}
          currency={totals.currency}
        />
      ) : null}

      <h2 className={styles.sectionLabel}>Lifetime</h2>
      <section className={styles.tiles} aria-label="Lifetime totals">
        <Tile
          label="Lifetime cost"
          value={formatUsd(totals.estimatedCost, totals.currency)}
        />
        <Tile
          label="Requests"
          value={totals.requestCount.toLocaleString("en-US")}
        />
        <Tile label="Total tokens" value={formatTokens(totals.totalTokens)} />
        <Tile label="Avg latency" value={formatLatency(totals.avgLatencyMs)} />
      </section>

      <section className={styles.statusRow} aria-label="Request outcomes">
        <span className={`${styles.pill} ${styles.statusSuccess}`}>
          {totals.successCount} success
        </span>
        <span className={`${styles.pill} ${styles.statusError}`}>
          {totals.errorCount} error
        </span>
        <span className={`${styles.pill} ${styles.statusPending}`}>
          {totals.pendingCount} pending
        </span>
      </section>

      <BreakdownCard
        title="By request type"
        rows={summary.byRequestType}
        currency={totals.currency}
        labelOf={requestTypeLabel}
      />
      <BreakdownCard
        title="By model"
        rows={summary.byModel}
        currency={totals.currency}
        labelOf={(key) => key}
      />

      <section className={styles.card} aria-label="Recent calls">
        <h2 className={styles.cardTitle}>Recent calls</h2>
        <p className={styles.cardHint}>
          The latest {summary.recent.length} logged request
          {summary.recent.length === 1 ? "" : "s"}, newest first.
        </p>
        <ul className={styles.log}>
          {summary.recent.map((entry) => (
            <li key={entry.id} className={styles.logItem}>
              <div className={styles.logHead}>
                <span className={styles.logType}>
                  {requestTypeLabel(entry.requestType)}
                </span>
                <span
                  className={`${styles.badge} ${statusClass(entry.status)}`}
                >
                  {statusLabel(entry.status)}
                </span>
              </div>
              <div className={styles.logMeta}>
                <span>{entry.model}</span>
                <span>{formatTokens(entry.totalTokens)} tok</span>
                <span>{formatLatency(entry.latencyMs)}</span>
                <span className={styles.logCost}>
                  {formatUsd(entry.estimatedCost, totals.currency)}
                </span>
              </div>
              <div className={styles.logTime}>
                {formatTimestamp(entry.createdAt)}
              </div>
              {entry.errorMessage ? (
                <div className={styles.logError}>{entry.errorMessage}</div>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <p className={styles.footnote}>
        Costs are estimated from provider token pricing and read from
        PostgreSQL. Every row corresponds to one logged LLM request — there are
        no hidden calls. Session cost is shown per writing attempt because the
        schema does not link an LLM request to a lesson.
      </p>
    </>
  );
}

function LatestRequestCard({
  entry,
  currency,
}: {
  entry: RequestLogEntry;
  currency: string;
}) {
  return (
    <section className={styles.card} aria-label="Latest request">
      <h2 className={styles.cardTitle}>Latest request</h2>
      <div className={styles.scopeHead}>
        <span className={styles.scopeCost}>
          {formatUsd(entry.estimatedCost, currency)}
        </span>
        <span className={`${styles.badge} ${statusClass(entry.status)}`}>
          {statusLabel(entry.status)}
        </span>
      </div>
      <div className={styles.logMeta}>
        <span>{requestTypeLabel(entry.requestType)}</span>
        <span>{entry.model}</span>
        <span>{formatTokens(entry.totalTokens)} tok</span>
        <span>{formatLatency(entry.latencyMs)}</span>
      </div>
      <div className={styles.logTime}>{formatTimestamp(entry.createdAt)}</div>
      {entry.errorMessage ? (
        <div className={styles.logError}>{entry.errorMessage}</div>
      ) : null}
    </section>
  );
}

function WritingAttemptCard({
  scope,
  currency,
}: {
  scope: ScopedCost;
  currency: string;
}) {
  const calls = `${scope.requestCount} call${scope.requestCount === 1 ? "" : "s"}`;
  return (
    <section className={styles.card} aria-label="Latest writing attempt">
      <h2 className={styles.cardTitle}>Latest writing attempt</h2>
      <p className={styles.cardHint}>
        Total cost of every LLM call tied to your most recent writing submission
        (attempt {scope.scopeId.slice(0, 8)}…). Lessons carry no cost link, so
        this is the finest reliable scope.
      </p>
      <div className={styles.scopeHead}>
        <span className={styles.scopeCost}>
          {formatUsd(scope.estimatedCost, currency)}
        </span>
        <span className={styles.scopeMeta}>
          {calls} · {formatTokens(scope.totalTokens)} tok
        </span>
      </div>
      <div className={styles.logMeta}>
        {scope.requestTypes.map((type) => (
          <span key={type}>{requestTypeLabel(type)}</span>
        ))}
      </div>
      <div className={styles.logTime}>
        {formatTimestamp(scope.latestCreatedAt)}
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>LLM Cost &amp; Usage</h1>
      <p className={styles.subtitle}>
        Transparent, auditable spend — every LLM call is logged in PostgreSQL.
      </p>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.tile}>
      <span className={styles.tileValue}>{value}</span>
      <span className={styles.tileLabel}>{label}</span>
    </div>
  );
}

function BreakdownCard({
  title,
  rows,
  currency,
  labelOf,
}: {
  title: string;
  rows: CostBreakdownRow[];
  currency: string;
  labelOf: (key: string) => string;
}) {
  return (
    <section className={styles.card} aria-label={title}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{title.replace("By ", "")}</th>
              <th scope="col" className={styles.num}>
                Calls
              </th>
              <th scope="col" className={styles.num}>
                Tokens
              </th>
              <th scope="col" className={styles.num}>
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td>{labelOf(row.key)}</td>
                <td className={styles.num}>{row.requestCount}</td>
                <td className={styles.num}>{formatTokens(row.totalTokens)}</td>
                <td className={styles.num}>
                  {formatUsd(row.estimatedCost, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
