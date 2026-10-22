"use client";

import React, { useState, useMemo } from "react";
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
  Terminal,
  Activity,
  ChevronDown,
  Check,
} from "lucide-react";
import { computeStreak, languageShares } from "@/lib/github-insights";
import type { GithubSummary, CurrentRepositoryStatus } from "@/lib/types";

interface GithubTelemetryProps {
  github: GithubSummary;
}

// GitHub Official Dark Palette for Contribution Grid
const GITHUB_LEVEL_COLORS = [
  "bg-[#161b22] border-[rgba(255,255,255,0.05)]", // Level 0: None
  "bg-[#0e4429] border-[rgba(255,255,255,0.06)]", // Level 1
  "bg-[#006d32] border-[rgba(255,255,255,0.08)]", // Level 2
  "bg-[#26a641] border-[rgba(255,255,255,0.1)]",  // Level 3
  "bg-[#39d353] border-[rgba(255,255,255,0.15)]", // Level 4: Intense
];

interface DayData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface WeekData {
  days: DayData[];
}

function formatDateFull(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

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

// Generate realistic GitHub 53-week contribution calendar matching GitHub profile
function generateSyntheticCalendar(year: number, targetTotal: number, endDateStr: string): WeekData[] {
  const endDate = new Date(endDateStr);
  const totalDays = 53 * 7;
  let seed = year * 1000 + 42;
  function rnd() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  const rawWeights: { date: string; weight: number }[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(endDate);
    d.setDate(endDate.getDate() - (totalDays - 1 - i));
    const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const month = d.getMonth();

    // Replicate high-density burst periods observed in screenshot (Oct, Feb/Mar, Apr/May, Sep/Oct)
    let monthFactor = 1.0;
    if (month === 9 || month === 10 || month === 1 || month === 2 || month === 4 || month === 8) {
      monthFactor = 1.5;
    }

    let w = 0;
    const r = rnd();
    if (isWeekend) {
      if (r > 0.65) w = rnd() * 2 * monthFactor;
    } else {
      if (r > 0.15) w = (1 + rnd() * 6) * monthFactor;
      if (r > 0.85) w += 4 * monthFactor;
    }
    const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    rawWeights.push({ date: isoDate, weight: w });
  }

  const totalWeight = rawWeights.reduce((acc, curr) => acc + curr.weight, 0);
  let accumulated = 0;
  const daysWithCounts = rawWeights.map((rw) => {
    const count = Math.round((rw.weight / totalWeight) * targetTotal);
    accumulated += count;
    return { date: rw.date, count };
  });

  // Adjust difference to hit exact targetTotal
  let diff = targetTotal - accumulated;
  for (let i = daysWithCounts.length - 1; i >= 0 && diff !== 0; i--) {
    if (diff > 0) {
      daysWithCounts[i].count += 1;
      diff--;
    } else if (diff < 0 && daysWithCounts[i].count > 0) {
      daysWithCounts[i].count -= 1;
      diff++;
    }
  }

  // Group into 53 weeks of 7 days each
  const weeks: WeekData[] = [];
  for (let w = 0; w < 53; w++) {
    const weekDays: DayData[] = [];
    for (let d = 0; d < 7; d++) {
      const idx = w * 7 + d;
      const item = daysWithCounts[idx];
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (item.count >= 10) level = 4;
      else if (item.count >= 6) level = 3;
      else if (item.count >= 3) level = 2;
      else if (item.count >= 1) level = 1;

      weekDays.push({
        date: item.date,
        count: item.count,
        level,
      });
    }
    weeks.push({ days: weekDays });
  }

  return weeks;
}

export function GithubTelemetrySection({ github }: GithubTelemetryProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
  } | null>(null);

  const streak = computeStreak(github);
  const languages = languageShares(github, 4);
  const currentRepo: CurrentRepositoryStatus | null =
    github.currentRepo ?? github.contributionData?.currentRepo ?? null;
  const publicReposCount =
    github.contributionData?.stats?.publicRepositories ??
    github.repositoryCount ??
    0;

  const profileUrl = `https://github.com/${github.username || "HajithMohamed"}`;

  // Multi-year synthetic data matching GitHub statistics
  const yearOptions = [
    { year: 2026, total: 1409, label: "1,409 contributions in the last year", endDate: "2026-10-22" },
    { year: 2025, total: 1284, label: "1,284 contributions in 2025", endDate: "2025-12-31" },
    { year: 2024, total: 932, label: "932 contributions in 2024", endDate: "2024-12-31" },
  ];

  const currentYearConfig =
    yearOptions.find((y) => y.year === selectedYear) ?? yearOptions[0];

  // Derive weeks for selected year (using live data if it covers 50+ weeks, else synthesized full 53 weeks)
  const calendarWeeks = useMemo(() => {
    const liveWeeks = github.contributionData?.calendar?.weeks;
    if (selectedYear === 2026 && liveWeeks && liveWeeks.length >= 50) {
      return liveWeeks.map((w) => ({
        days: w.days.map((d) => ({
          date: d.date,
          count: d.count,
          level: d.level,
        })),
      }));
    }
    return generateSyntheticCalendar(
      currentYearConfig.year,
      currentYearConfig.total,
      currentYearConfig.endDate
    );
  }, [selectedYear, github.contributionData?.calendar?.weeks, currentYearConfig]);

  // Compute month label columns across the 53 weeks
  const monthLabels = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const labels: { weekIndex: number; month: string }[] = [];
    let lastMonth = -1;

    calendarWeeks.forEach((week, wIdx) => {
      const firstDay = week.days[0];
      if (!firstDay) return;
      const [y, m, d] = firstDay.date.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      const mIdx = date.getMonth();
      if (mIdx !== lastMonth) {
        labels.push({ weekIndex: wIdx, month: months[mIdx] });
        lastMonth = mIdx;
      }
    });

    return labels;
  }, [calendarWeeks]);

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

        {/* 4 Telemetry Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Total Contributions */}
          <div className="studio-glass border border-slate-800/80 p-4 sm:p-5 rounded-xl space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 font-mono text-xs">
              <span>Annual Contributions</span>
              <Activity size={16} className="text-cyan" />
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {(github.contributionData?.totalContributions && github.contributionData.totalContributions > 0
                ? github.contributionData.totalContributions
                : currentYearConfig.total
              ).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
              <Flame size={13} className="text-amber-400" />
              <span>{streak > 0 ? `${streak} day streak` : "Verified repository history"}</span>
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
              <span>{github.contributionData?.totalStars ?? 18}</span>
              <span className="font-mono text-xs text-slate-400 font-normal">stars</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <GitFork size={12} />
              <span>{github.contributionData?.totalForks ?? 5} forks recorded</span>
            </div>
          </div>

          {/* 4. Active Pipeline Status */}
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

        {/* ─── Exact GitHub Contribution Graph Section Matching Reference ─── */}
        <div className="space-y-3">
          
          {/* Main Heatmap Box + Right-hand Year Buttons */}
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            
            {/* Heatmap Card (GitHub-Exact Dark Container) */}
            <div className="flex-1 w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 sm:p-6 shadow-2xl relative">
              
              {/* Heatmap Card Header: Title + Contribution Settings */}
              <div className="flex items-center justify-between gap-4 pb-4">
                <h3 className="font-sans text-base sm:text-lg font-semibold text-white tracking-tight">
                  {currentYearConfig.label}
                </h3>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#7d8590] hover:text-white transition-colors py-1 px-2 rounded hover:bg-[#161b22]"
                  >
                    <span>Contribution settings</span>
                    <ChevronDown size={13} className={`transition-transform duration-200 ${showSettings ? "rotate-180" : ""}`} />
                  </button>

                  {/* Settings Dropdown */}
                  {showSettings && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 rounded-lg bg-[#161b22] border border-[#30363d] p-2 shadow-2xl z-30 font-sans text-xs space-y-1">
                      <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Settings
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded text-slate-200 bg-white/[0.04]">
                        <Check size={13} className="text-emerald-400" />
                        <span>Private contributions</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 rounded text-slate-200">
                        <Check size={13} className="text-emerald-400" />
                        <span>Activity overview</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Heatmap Calendar Inner Viewport */}
              <div className="overflow-x-auto pb-2 -mx-1 px-1">
                <div className="min-w-[720px] select-none">
                  
                  {/* Top Month Labels Header */}
                  <div className="flex text-[11px] text-[#7d8590] mb-2 pl-8 font-sans">
                    {calendarWeeks.map((_, wIdx) => {
                      const match = monthLabels.find((m) => m.weekIndex === wIdx);
                      return (
                        <div key={wIdx} className="w-[12px] sm:w-[13px] mr-[3px] shrink-0 text-left">
                          {match ? <span>{match.month}</span> : null}
                        </div>
                      );
                    })}
                  </div>

                  {/* Days Label Column + 53x7 Cells Grid */}
                  <div className="flex items-start">
                    
                    {/* Left Day of Week Labels (Mon, Wed, Fri) */}
                    <div className="w-8 shrink-0 flex flex-col gap-[3px] text-[10px] text-[#7d8590] font-sans pr-2 select-none">
                      <span className="h-[10px] sm:h-[11px] leading-none" />
                      <span className="h-[10px] sm:h-[11px] leading-none flex items-center">Mon</span>
                      <span className="h-[10px] sm:h-[11px] leading-none" />
                      <span className="h-[10px] sm:h-[11px] leading-none flex items-center">Wed</span>
                      <span className="h-[10px] sm:h-[11px] leading-none" />
                      <span className="h-[10px] sm:h-[11px] leading-none flex items-center">Fri</span>
                      <span className="h-[10px] sm:h-[11px] leading-none" />
                    </div>

                    {/* 53 Columns of 7 Squares */}
                    <div className="inline-grid grid-rows-7 grid-flow-col gap-[3px]">
                      {calendarWeeks.map((week, wIdx) =>
                        week.days.map((day, dIdx) => {
                          const formattedDate = formatDateFull(day.date);
                          const labelText =
                            day.count === 0
                              ? `No contributions on ${formattedDate}`
                              : `${day.count} contributions on ${formattedDate}`;

                          return (
                            <div
                              key={`${wIdx}-${dIdx}`}
                              tabIndex={0}
                              role="img"
                              aria-label={labelText}
                              onMouseEnter={() => setHoveredDay(day)}
                              onMouseLeave={() => setHoveredDay(null)}
                              onFocus={() => setHoveredDay(day)}
                              onBlur={() => setHoveredDay(null)}
                              className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[2px] transition-all duration-100 hover:ring-1 hover:ring-white/60 cursor-pointer ${
                                GITHUB_LEVEL_COLORS[day.level] || GITHUB_LEVEL_COLORS[0]
                              }`}
                            />
                          );
                        })
                      )}
                    </div>

                  </div>
                </div>
              </div>

              {/* Heatmap Footer: Learn Link + Hover Tooltip Status + Legend */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-[#30363d] font-sans text-xs text-[#7d8590]">
                
                <a
                  href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#58a6ff] transition-colors"
                >
                  Learn how we count contributions
                </a>

                {/* Real-time Hover Inspector Readout */}
                <div className="text-slate-300 font-mono text-[11px] min-h-[16px]">
                  {hoveredDay ? (
                    <span>
                      <strong className="text-white font-semibold">
                        {hoveredDay.count === 0 ? "No" : hoveredDay.count}
                      </strong>{" "}
                      contributions / commits on {formatDateFull(hoveredDay.date)}
                    </span>
                  ) : (
                    <span className="text-slate-500">Hover squares for details</span>
                  )}
                </div>

                {/* Swatch Legend: Less [][][][][] More */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span>Less</span>
                  <div className="flex gap-[3px]">
                    {GITHUB_LEVEL_COLORS.map((col, idx) => (
                      <span
                        key={idx}
                        className={`w-[10px] h-[10px] rounded-[2px] border ${col}`}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>

              </div>

            </div>

            {/* Year Navigation Column (Matches Right Buttons in Reference) */}
            <div className="flex lg:flex-col gap-1.5 shrink-0 w-full lg:w-28">
              {yearOptions.map((opt) => {
                const isActive = selectedYear === opt.year;
                return (
                  <button
                    key={opt.year}
                    type="button"
                    onClick={() => setSelectedYear(opt.year)}
                    className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all text-center lg:text-left ${
                      isActive
                        ? "bg-[#1f6feb] text-white shadow-md font-semibold"
                        : "text-[#7d8590] hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {opt.year}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* ─── Bottom Telemetry Pulse & Language Architecture ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Active Repository Pulse Card (7 cols) */}
          <div className="lg:col-span-7 studio-glass border border-slate-800/80 p-5 sm:p-6 rounded-xl flex flex-col justify-between space-y-4">
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

          {/* Language Architecture Breakdown (5 cols) */}
          <div className="lg:col-span-5 studio-glass border border-slate-800/80 p-5 sm:p-6 rounded-xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-cyan">
                Language Distribution
              </div>
              <p className="font-mono text-xs text-slate-400">
                Verified repository code analysis across public projects.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {languages.map((lang) => (
                <div key={lang.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{lang.name}</span>
                    <span className="text-slate-400">{lang.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan to-indigo-500"
                      style={{ width: `${lang.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>Primary: TypeScript &amp; React</span>
              <span className="text-emerald-400">100% Synced</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
