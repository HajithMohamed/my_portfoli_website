"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Panel } from "@/components/hud/panel";
import { computeStreak, heatmapLevels, languageShares } from "@/lib/github-insights";
import type { CurrentRepositoryStatus, GithubSummary } from "@/lib/types";
import { motion } from "framer-motion";
import { CircleDot, ExternalLink, GitBranch, GitCommit, GitFork, Star } from "lucide-react";

const LEVEL_BG = [
  "rgba(92,208,255,0.03)",
  "rgba(92,208,255,0.2)",
  "rgba(92,208,255,0.45)",
  "rgba(92,208,255,0.75)",
  "rgba(92,208,255,1)",
];

const STATUS_TONES: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  green: {
    text: "text-signal-green",
    border: "border-signal-green/30",
    bg: "bg-signal-green/10",
    dot: "bg-signal-green",
  },
  amber: {
    text: "text-signal-amber",
    border: "border-signal-amber/30",
    bg: "bg-signal-amber/10",
    dot: "bg-signal-amber",
  },
  red: {
    text: "text-signal-red",
    border: "border-signal-red/30",
    bg: "bg-signal-red/10",
    dot: "bg-signal-red",
  },
  cyan: {
    text: "text-cyan",
    border: "border-cyan/30",
    bg: "bg-cyan/10",
    dot: "bg-cyan",
  },
};

function relativeTime(value?: string | null) {
  if (!value) return "sync pending";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "sync pending";

  const diffMs = time - Date.now();
  const absMs = Math.abs(diffMs);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31_536_000_000],
    ["month", 2_592_000_000],
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
  ];
  const [unit, size] = units.find(([, unitSize]) => absMs >= unitSize) ?? ["minute", 60_000];
  return formatter.format(Math.round(diffMs / size), unit);
}

function currentRepoFor(github: GithubSummary): CurrentRepositoryStatus | null {
  return github.currentRepo ?? github.contributionData?.currentRepo ?? null;
}

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 1500;
    const startTime = Date.now();
    
    const tick = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  
  return <>{count.toLocaleString()}</>;
}

function Stat({ label, value, numValue, accent }: { label: string; value: string | ReactNode; numValue?: number; accent?: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-md border border-cyan/15 bg-surface-2/40 p-3 transition-colors hover:border-cyan/30 hover:bg-surface-2">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10 text-[9px] uppercase tracking-[0.25em] text-cyan/60 transition-colors group-hover:text-cyan">{label}</div>
      <div
        className={`relative z-10 mt-1.5 font-display text-2xl font-bold tabular-nums ${accent ? "text-cyan text-glow" : "text-foreground group-hover:text-cyan/90"}`}
      >
        {numValue !== undefined ? <AnimatedCounter value={numValue} /> : value}
      </div>
    </div>
  );
}

function CurrentRepoCard({ repo }: { repo: CurrentRepositoryStatus }) {
  const tone = STATUS_TONES[repo.statusTone ?? "cyan"] ?? STATUS_TONES.cyan;
  const pushedAt = repo.pushedAt ?? repo.updatedAt;
  const stats = [
    { icon: Star, label: `${repo.stars ?? 0}` },
    { icon: GitFork, label: `${repo.forks ?? 0}` },
    { icon: CircleDot, label: `${repo.openIssues ?? 0}` },
    { icon: GitBranch, label: repo.defaultBranch ?? "main" },
  ];

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer"
      data-track="github_click"
      className={`group block rounded-md border ${tone.border} ${tone.bg} p-3 transition-all hover:border-cyan/60 hover:bg-cyan/10`}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-cyan/70">
            <span>current repo</span>
            <span className={`flex shrink-0 items-center gap-1 rounded-sm border ${tone.border} px-1.5 py-0.5 ${tone.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
              {repo.statusLabel ?? "synced"}
            </span>
          </div>
          <div className="mt-2 flex min-w-0 items-center gap-2">
            <span className="truncate font-display text-lg font-semibold text-foreground group-hover:text-cyan">
              {repo.name}
            </span>
            <ExternalLink size={13} className="shrink-0 text-cyan/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
          <div className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
            {repo.fullName}
          </div>
        </div>
        <div className="shrink-0 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          pushed
          <div className={`mt-1 normal-case tracking-normal ${tone.text}`}>{relativeTime(pushedAt)}</div>
        </div>
      </div>

      <div className="mt-3 flex min-w-0 items-start gap-2 rounded-sm border border-cyan/10 bg-black/20 p-2 font-mono text-[10px] text-muted-foreground">
        <GitCommit size={13} className="mt-0.5 shrink-0 text-cyan/70" />
        <div className="min-w-0">
          <div className="truncate text-foreground">
            {repo.latestCommit?.message ?? "Waiting for first live GitHub sync"}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {repo.latestCommit?.sha ? <span>{repo.latestCommit.sha}</span> : null}
            {repo.latestCommit?.author ? <span>@{repo.latestCommit.author}</span> : null}
            <span>{relativeTime(repo.latestCommit?.authoredAt ?? pushedAt)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[10px] text-muted-foreground">
        {stats.map(({ icon: Icon, label }, index) => (
          <span key={`${label}-${index}`} className="flex items-center gap-1.5">
            <Icon size={12} className="text-cyan/70" />
            {label}
          </span>
        ))}
        <span className="ml-auto rounded-sm border border-cyan/15 px-2 py-0.5 uppercase tracking-[0.18em] text-cyan/70">
          {repo.visibility ?? "public"}
        </span>
      </div>
    </a>
  );
}

export function GithubTelemetry({ github }: { github: GithubSummary }) {
  const contributions = github.contributionData?.totalContributions ?? github.commitCount;
  const streak = computeStreak(github);
  const stars = github.contributionData?.totalStars ?? 0;
  const currentRepo = currentRepoFor(github);
  
  // Need to ensure heatmap is properly sized for grid
  const rawHeatmap = heatmapLevels(github, 14); 
  const heatmap = rawHeatmap.length ? rawHeatmap : Array(14 * 7).fill(0);
  
  const languages = languageShares(github, 3); // Reduced to 3 to fit better in height

  return (
    <Panel label="github.telemetry" subtitle={currentRepo?.fullName ?? `@${github.username}`} live className="h-full">
      <div className="flex h-full flex-col gap-5">
        {currentRepo ? <CurrentRepoCard repo={currentRepo} /> : null}

        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <Stat label="commits/yr" value={contributions.toLocaleString()} numValue={contributions} />
          <Stat label="streak" value={`${streak}d`} accent />
          <Stat label="repos" value={github.repositoryCount.toString()} numValue={github.repositoryCount} />
          <Stat label="stars" value={stars.toLocaleString()} numValue={stars} />
        </div>

        {heatmap.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
              <span className="text-cyan/70">contribution matrix</span>
              <span className="text-[9px] text-muted-foreground">{heatmap.length} days</span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] rounded-md border border-cyan/10 bg-black/20 p-2 overflow-x-auto touch-pan-x hide-scrollbar">
              {heatmap.map((v, i) => (
                <div
                  key={i}
                  className="h-2 w-full rounded-[1px] transition-all hover:scale-150 hover:z-10"
                  style={{ 
                    background: LEVEL_BG[v] ?? LEVEL_BG[0],
                    boxShadow: v > 2 ? `0 0 8px ${LEVEL_BG[v]}` : 'none'
                  }}
                  title={`intensity ${v}`}
                />
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="space-y-2.5 font-mono text-[11px]">
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">languages</div>
            {languages.map((l, i) => (
              <div key={l.name} className="group flex items-center gap-3">
                <span className="w-20 truncate text-muted-foreground transition-colors group-hover:text-foreground">{l.name}</span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-cyan/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan to-violet"
                  />
                </div>
                <span className="w-8 text-right font-semibold tabular-nums text-foreground">{l.pct}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
