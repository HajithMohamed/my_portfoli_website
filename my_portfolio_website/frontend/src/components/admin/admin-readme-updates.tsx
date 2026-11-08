"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenCheck, Check, ExternalLink, GitCommitHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { adminFetch } from "@/lib/api";
import { README_CHECK_FLAG, formatReadmeDate } from "@/lib/project-readme";

type ReadmeCheck = {
  projectId: string;
  slug: string;
  title: string;
  repo: string | null;
  status: "baseline" | "changed" | "unchanged" | "missing" | "skipped" | "error";
  message?: string;
};

type ReadmeSyncReport = {
  checkedAt: string;
  checked: number;
  changed: number;
  failed: number;
  results: ReadmeCheck[];
};

type ReadmeUpdate = {
  id: string;
  createdAt: string;
  title: string;
  record: {
    slug: string;
    title: string;
    repo: string;
    htmlUrl: string;
    summary: string | null;
    detectedAt: string;
    commit: { sha: string; message: string; url: string; author: string | null } | null;
  };
};

type ReadmeUpdates = { pending: ReadmeUpdate[]; recent: ReadmeUpdate[] };

/** True once after each sign-in (the login form sets the flag). */
function takeLoginFlag(): boolean {
  try {
    const afterLogin = sessionStorage.getItem(README_CHECK_FLAG) === "pending";
    sessionStorage.removeItem(README_CHECK_FLAG);
    return afterLogin;
  } catch {
    // Storage can be unavailable (private mode); "Check now" still works.
    return false;
  }
}

/**
 * Dashboard card for README changes in published project repositories.
 * The login form sets README_CHECK_FLAG, so READMEs are fetched from GitHub
 * once after every sign-in; "Check now" runs the same check on demand.
 */
export function ReadmeUpdatesPanel() {
  const [updates, setUpdates] = useState<ReadmeUpdates>({ pending: [], recent: [] });
  const [report, setReport] = useState<ReadmeSyncReport | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUpdates = useCallback(async () => {
    try {
      setUpdates(await adminFetch<ReadmeUpdates>("/admin/readme/updates"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load README updates.");
    }
  }, []);

  const check = useCallback(async () => {
    setChecking(true);
    setError(null);
    try {
      setReport(
        await adminFetch<ReadmeSyncReport>("/admin/readme/sync", { method: "POST", body: "{}" }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "README check failed.");
    } finally {
      setChecking(false);
      await loadUpdates();
    }
  }, [loadUpdates]);

  useEffect(() => {
    // Deferred, and the flag is only consumed when the timer fires, so a
    // cancelled first run (React strict mode) cannot swallow the check.
    const timer = window.setTimeout(() => {
      if (takeLoginFlag()) void check();
      else void loadUpdates();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [check, loadUpdates]);

  async function acknowledge(id: string) {
    try {
      await adminFetch(`/admin/readme/updates/${id}/acknowledge`, { method: "POST", body: "{}" });
      await loadUpdates();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not mark the update as reviewed.");
    }
  }

  const problems = report?.results.filter((result) => result.status === "error" || result.status === "missing") ?? [];

  return (
    <Card className="p-5 space-y-3" aria-labelledby="readme-updates-heading">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <BookOpenCheck size={16} className="text-cyan" aria-hidden="true" />
          <h2 id="readme-updates-heading" className="font-display font-semibold text-foreground text-sm">
            README updates
          </h2>
          {updates.pending.length > 0 && (
            <span className="rounded-full bg-cyan/15 px-2 py-0.5 font-mono text-[10px] text-cyan">
              {updates.pending.length} new
            </span>
          )}
        </div>
        <Button size="sm" variant="secondary" onClick={() => void check()} disabled={checking} className="h-7 text-xs">
          <RefreshCw size={12} className={`mr-1.5 ${checking ? "animate-spin" : ""}`} aria-hidden="true" />
          {checking ? "Checking…" : "Check now"}
        </Button>
      </div>

      <p className="font-mono text-[11px] text-muted-foreground" role="status">
        {checking
          ? "Checking the README of every published project on GitHub…"
          : report
            ? `Checked ${report.checked} published project${report.checked === 1 ? "" : "s"}: ${report.changed} README${report.changed === 1 ? "" : "s"} changed${report.failed ? `, ${report.failed} could not be checked` : ""}.`
            : "READMEs are checked on GitHub each time you sign in. Changed summaries appear on the site straight away."}
      </p>

      {error && (
        <p role="alert" className="rounded-lg border border-signal-red/30 bg-signal-red/10 p-2.5 font-mono text-[11px] text-signal-red">
          {error}
        </p>
      )}

      {problems.length > 0 && (
        <ul className="space-y-1 font-mono text-[11px] text-amber-400">
          {problems.map((problem) => (
            <li key={problem.projectId}>
              {problem.title}: {problem.message ?? problem.status}
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2.5">
        {updates.pending.length > 0 ? (
          updates.pending.map((update) => (
            <article key={update.id} className="rounded-lg border border-cyan/30 bg-cyan/5 p-3 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-foreground text-sm">{update.record.title}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {update.record.repo} · detected {formatReadmeDate(update.record.detectedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/projects/${update.record.slug}`}
                    target="_blank"
                    className="inline-flex h-7 items-center gap-1 rounded-md border border-border px-2 font-mono text-[11px] text-foreground hover:text-cyan"
                  >
                    View on site <ExternalLink size={11} aria-hidden="true" />
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => void acknowledge(update.id)}
                    className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-2.5"
                  >
                    <Check size={12} className="mr-1" aria-hidden="true" />
                    Mark reviewed
                  </Button>
                </div>
              </div>
              {update.record.commit && (
                <a
                  href={update.record.commit.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-cyan"
                >
                  <GitCommitHorizontal size={12} aria-hidden="true" />
                  {update.record.commit.message}
                  {update.record.commit.author ? ` · ${update.record.commit.author}` : ""}
                </a>
              )}
              {update.record.summary && (
                <p className="text-xs leading-relaxed text-muted-foreground">{update.record.summary}</p>
              )}
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border p-4 text-center font-mono text-xs text-muted-foreground">
            No unreviewed README changes.
            {updates.recent[0] && ` Last change: ${updates.recent[0].record.title}, ${formatReadmeDate(updates.recent[0].record.detectedAt)}.`}
          </p>
        )}
      </div>
    </Card>
  );
}
