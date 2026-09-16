"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ExternalLink,
  GitBranch,
  GitCommit,
  GitFork,
  Github,
  RefreshCw,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { adminFetch } from "@/lib/api";
import type { GithubSummary } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type Suggestion = {
  id: string;
  source: string;
  title: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

export default function AdminGithubPage() {
  const [github, setGithub] = useState<GithubSummary | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [ghData, suggData] = await Promise.all([
        adminFetch<GithubSummary | null>("/github/summary"),
        adminFetch<Suggestion[]>("/admin/suggestions"),
      ]);
      setGithub(ghData);
      setSuggestions(suggData);
    } catch (err) {
      console.error("Failed to load GitHub data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function triggerSync() {
    setSyncing(true);
    setStatusMsg("Syncing with GitHub API...");
    try {
      await adminFetch("/admin/github/sync", { method: "POST", body: "{}" });
      await loadData();
      setStatusMsg("GitHub sync completed successfully.");
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err) {
      setStatusMsg(`Sync failed: ${err instanceof Error ? err.message : "Internal error"}`);
    } finally {
      setSyncing(false);
    }
  }

  async function handleSuggestion(id: string, action: "approve" | "reject") {
    try {
      await adminFetch(`/admin/suggestions/${id}/${action}`, { method: "POST", body: "{}" });
      await loadData();
    } catch (err) {
      alert(`Failed to ${action} suggestion`);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              GitHub Telemetry & Synchronization
            </h1>
            <span className="font-mono text-xs text-cyan border border-cyan/30 px-2 py-0.5 rounded-full bg-cyan/10">
              Live Gateway
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Synchronized repository intelligence, commit facts, and automated catalog suggestions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={loadData}
            disabled={loading}
            className="font-mono text-xs"
          >
            <RefreshCw size={13} className={cn("mr-1.5", loading && "animate-spin")} />
            Reload
          </Button>

          <Button
            size="sm"
            onClick={triggerSync}
            disabled={syncing}
            className="bg-cyan text-slate-950 hover:bg-cyan-soft font-mono text-xs font-semibold"
          >
            <RefreshCw size={13} className={cn("mr-1.5", syncing && "animate-spin")} />
            {syncing ? "Syncing..." : "Trigger Manual Sync"}
          </Button>
        </div>
      </div>

      {statusMsg && (
        <div className="font-mono text-xs p-3 rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
          {statusMsg}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Public Repositories
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {github?.repositoryCount ?? "—"}
          </div>
          <div className="mt-1 font-mono text-[10px] text-cyan">
            Active on GitHub profile
          </div>
        </Card>

        <Card className="p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Total Stars Earned
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {github?.contributionData?.totalStars ?? "—"}
          </div>
          <div className="mt-1 font-mono text-[10px] text-muted-foreground">
            Aggregated star ratings
          </div>
        </Card>

        <Card className="p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Total Forks
          </div>
          <div className="mt-2 text-2xl font-bold font-display text-foreground">
            {github?.contributionData?.totalForks ?? "—"}
          </div>
          <div className="mt-1 font-mono text-[10px] text-muted-foreground">
            Community downstream forks
          </div>
        </Card>

        <Card className="p-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Last Synchronized
          </div>
          <div className="mt-2 text-sm font-bold font-mono text-foreground truncate">
            {github?.syncedAt ? formatDate(github.syncedAt) : "Never"}
          </div>
          <div className="mt-1 font-mono text-[10px] text-emerald-400">
            Automated hourly cadence
          </div>
        </Card>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Top Synced Repositories */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Github size={18} className="text-cyan" />
                <h2 className="font-display font-semibold text-foreground text-sm">
                  Telemetry Snapshot Repositories
                </h2>
              </div>
              <a
                href="https://github.com/HajithMohamed"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-cyan hover:underline flex items-center gap-1"
              >
                <span>HajithMohamed</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="space-y-2.5">
              {github?.recentRepos?.length ? (
                github.recentRepos.map((repo) => (
                  <div
                    key={repo.name}
                    className="p-3 rounded-lg border border-border/70 bg-surface-2/30 hover:bg-surface-2/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono font-bold text-xs text-cyan hover:underline flex items-center gap-1.5"
                        >
                          <span>{repo.name}</span>
                          <ExternalLink size={11} className="text-muted-foreground" />
                        </a>
                        {repo.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {repo.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5 font-mono text-xs shrink-0 text-muted-foreground">
                        {repo.language && (
                          <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400" />
                          {repo.stars ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork size={12} />
                          {repo.forks ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center font-mono text-xs text-muted-foreground rounded-lg border border-dashed border-border">
                  No repository data cached yet. Click &quot;Trigger Manual Sync&quot; above.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Automated Suggestions */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <GitBranch size={18} className="text-amber-400" />
                <h2 className="font-display font-semibold text-foreground text-sm">
                  Repository Ingestion Suggestions
                </h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {suggestions.filter((s) => s.status === "PENDING").length} pending
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {suggestions.filter((s) => s.status === "PENDING").length > 0 ? (
                suggestions
                  .filter((s) => s.status === "PENDING")
                  .map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 space-y-2.5"
                    >
                      <div className="font-bold text-foreground">{suggestion.title}</div>
                      <div className="text-[11px] text-muted-foreground">
                        Discovered from {suggestion.source} on {formatDate(suggestion.createdAt)}
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={() => handleSuggestion(suggestion.id, "approve")}
                          className="h-7 text-xs bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold"
                        >
                          <Check size={12} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSuggestion(suggestion.id, "reject")}
                          className="h-7 text-xs text-signal-red border-signal-red/30"
                        >
                          <X size={12} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-6 text-center text-muted-foreground font-mono text-xs rounded-lg border border-dashed border-border">
                  No pending repository suggestions. All detected repositories have been processed.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
