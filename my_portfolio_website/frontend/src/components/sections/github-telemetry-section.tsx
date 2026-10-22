"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitCommit,
  GitBranch,
  Star,
  GitFork,
  ArrowUpRight,
  Flame,
  Code2,
  Calendar,
  Layers,
  Terminal,
  Activity,
} from "lucide-react";
import { computeStreak, languageShares } from "@/lib/github-insights";
import type { GithubSummary, CurrentRepositoryStatus } from "@/lib/types";

interface GithubTelemetryProps {
  github: GithubSummary;
}

const HEATMAP_COLORS = [
  "bg-slate-900/90 border-slate-800/80", // Level 0
  "bg-violet-950/70 border-violet-800/50 shadow-[0_0_6px_rgba(139,92,246,0.2)]", // Level 1
  "bg-indigo-800/70 border-indigo-600/60 shadow-[0_0_8px_rgba(99,102,241,0.3)]", // Level 2
  "bg-cyan-700/80 border-cyan-500/70 shadow-[0_0_10px_rgba(6,182,212,0.4)]", // Level 3
  "bg-cyan-400 border-cyan-200 shadow-[0_0_14px_rgba(6,182,212,0.7)]", // Level 4
];

function relativeTime(value?: string | null): string {
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

export function GithubTelemetrySection({ github }: GithubTelemetryProps) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
  } | null>(null);

  const streak = computeStreak(github);
  const languages = languageShares(github, 4);
  const currentRepo: CurrentRepositoryStatus | null =
    github.currentRepo ?? github.contributionData?.currentRepo ?? null;
  const totalContributions =
    github.contributionData?.totalContributions ?? github.commitCount ?? 0;
  const publicReposCount =
    github.contributionData?.stats?.publicRepositories ??
    github.repositoryCount ??
    0;

  // Flatten calendar weeks into a 16-week window
  const weeks = github.contributionData?.calendar?.weeks?.slice(-16) ?? [];
  const profileUrl = `https://github.com/${github.username || "HajithMohamed"}`;

  return (
    <section
      id="telemetry"
      className="py-12 md:py-16 relative overflow-hidden"
      aria-label="GitHub Telemetry and Real-Time Commit Stream"
    >
      <div className="container-responsive space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.25em] text-cyan uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan" />
              </span>
              <span>TELEMETRY // LIVE CODE ACTIVITY</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Real-Time Development Telemetry
            </h2>
            <p className="font-mono text-xs sm:text-sm text-slate-400 max-w-2xl">
              Live commit telemetry, repository velocity, and language distribution tracked directly from GitHub.
            </p>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg studio-glass-interactive text-slate-300 hover:text-white border border-slate-700 text-xs font-mono tracking-wider uppercase transition-all shrink-0"
          >
            <span>GitHub Profile</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Total Contributions */}
          <div className="studio-glass border border-slate-800/80 p-4 sm:p-5 rounded-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
              <span>Annual Contributions</span>
              <Activity size={16} className="text-cyan" />
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {totalContributions > 0 ? totalContributions.toLocaleString() : "Active"}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
              <Flame size={13} className="text-amber-400" />
              <span>{totalContributions > 0 && streak > 0 ? `${streak} day streak` : "Verified repository history"}</span>
            </div>
          </div>

          {/* 2. Public Repositories */}
          <div className="studio-glass border border-slate-800/80 p-4 sm:p-5 rounded-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
              <span>Public Repos</span>
              <Code2 size={16} className="text-violet-400" />
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {publicReposCount}
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
            >
              <span>Explore all projects</span>
              <ArrowUpRight size={11} />
            </Link>
          </div>

          {/* 3. Total Stars & Forks */}
          <div className="studio-glass border border-slate-800/80 p-4 sm:p-5 rounded-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
              <span>Community Impact</span>
              <Star size={16} className="text-amber-400" />
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-baseline gap-3">
              <span>{github.contributionData?.totalStars ?? 0}</span>
              <span className="font-mono text-xs text-slate-400 font-normal">stars</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <GitFork size={12} />
              <span>{github.contributionData?.totalForks ?? 0} forks recorded</span>
            </div>
          </div>

          {/* 4. Active Status */}
          <div className="studio-glass border border-slate-800/80 p-4 sm:p-5 rounded-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
              <span>Pipeline Status</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="font-display text-lg sm:text-xl font-bold text-emerald-400 tracking-tight">
              {currentRepo?.statusLabel && !currentRepo.statusLabel.toLowerCase().includes("prod")
                ? currentRepo.statusLabel
                : "Active / Main Branch"}
            </div>
            <p className="font-mono text-[11px] text-slate-400 truncate">
              Last push: {relativeTime(currentRepo?.pushedAt)}
            </p>
          </div>

        </div>

        {/* Middle Row: Heatmap & Pulse Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Commit Activity Heatmap (7 cols on lg) */}
          <div className="lg:col-span-7 studio-glass border border-slate-800/80 p-5 sm:p-6 rounded-xl space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-cyan" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Commit Velocity (Past 16 Weeks)
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                {hoveredDay ? `${hoveredDay.count} commits on ${hoveredDay.date}` : "Hover squares for details"}
              </span>
            </div>

            {/* Heatmap Grid */}
            {weeks.length > 0 ? (
              <div className="overflow-x-auto pb-2">
                <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 min-w-full">
                  {weeks.map((week, wIdx) =>
                    week.days.map((day, dIdx) => (
                      <div
                        key={`${wIdx}-${dIdx}`}
                        tabIndex={0}
                        role="img"
                        aria-label={`${day.count} contributions on ${day.date}`}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        onFocus={() => setHoveredDay(day)}
                        onBlur={() => setHoveredDay(null)}
                        className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 hover:scale-125 cursor-pointer ${
                          HEATMAP_COLORS[day.level] || HEATMAP_COLORS[0]
                        }`}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center rounded-lg bg-slate-950/50 border border-slate-800/60 font-mono text-xs text-slate-400">
                Commit velocity stream synchronized with verified GitHub repositories.
              </div>
            )}

            {/* Heatmap Legend & Language Share bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/60 font-mono text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                {HEATMAP_COLORS.map((col, idx) => (
                  <span
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-xs border ${col}`}
                  />
                ))}
                <span>More</span>
              </div>

              {/* Language distribution preview */}
              <div className="flex items-center gap-3">
                {languages.slice(0, 3).map((lang) => (
                  <div key={lang.name} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                    <span>{lang.name} {lang.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Repository Pulse Card (5 cols on lg) */}
          <div className="lg:col-span-5 studio-glass border border-slate-800/80 p-5 sm:p-6 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan">
                  <Terminal size={14} />
                  <span>Latest Code Deployment</span>
                </div>
                <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-semibold">
                  {currentRepo?.statusLabel || "Active"}
                </span>
              </div>

              {/* Repo Name */}
              <div>
                <a
                  href={currentRepo?.url || `https://github.com/HajithMohamed`}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 font-display text-xl font-bold text-white hover:text-cyan transition-colors"
                >
                  <span className="truncate">{currentRepo?.name || "Tech Bridge"}</span>
                  <ArrowUpRight size={16} className="text-slate-400 group-hover:text-cyan transition-colors" />
                </a>
                <p className="font-mono text-xs text-slate-400 line-clamp-2 mt-1">
                  {currentRepo?.description || "High-performance full-stack system repository."}
                </p>
              </div>

              {/* Latest Commit Snippet */}
              {currentRepo?.latestCommit && (
                <div className="rounded-lg bg-slate-950/80 border border-slate-800 p-3 space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1.5 text-cyan">
                      <GitCommit size={13} />
                      <span>{currentRepo.latestCommit.sha}</span>
                    </div>
                    <span>{relativeTime(currentRepo.latestCommit.authoredAt)}</span>
                  </div>
                  <p className="text-slate-300 truncate">
                    &quot;{currentRepo.latestCommit.message}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Repo Tags */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <GitBranch size={13} className="text-slate-400" />
                <span>{currentRepo?.defaultBranch || "main"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-slate-800/80 text-[11px] text-slate-300">
                  {currentRepo?.language || "TypeScript"}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
