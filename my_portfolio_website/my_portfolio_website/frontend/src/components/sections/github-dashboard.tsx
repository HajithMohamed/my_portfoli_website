"use client";

import { useMemo } from "react";
import { Github, Star, Database, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { RevealAnimation } from "@/components/ui/reveal-animation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { GithubSummary } from "@/lib/types";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  PHP: "#777bb4",
  SQL: "#e38c00",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00add8",
  Rust: "#dea584",
};

function getLangColor(lang: string): string {
  return LANG_COLORS[lang] ?? "#64748b";
}

function ContributionDot({ level }: { level: number }) {
  const colors = [
    "bg-white/5",
    "bg-blue-900/60",
    "bg-blue-700/70",
    "bg-blue-500/80",
    "bg-blue-400",
  ];
  return (
    <div
      className={`w-3 h-3 rounded-sm ${colors[level]} transition-colors duration-200 hover:ring-1 hover:ring-blue-400/60`}
    />
  );
}

// Deterministic PRNG (mulberry32) — seeded so the grid is identical on the
// server and the client. Using Math.random() here broke hydration because each
// render produced different cell colors.
function makeRng(seed: number) {
  let state = (seed || 1) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateContributionGrid(seed: number): number[][] {
  // Illustrative 52-week × 7-day activity grid. Deterministic so SSR and client
  // hydration match. Swap for real GitHub GraphQL contribution data when wired.
  const rand = makeRng(seed);
  return Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, (_, day) => {
      const isWeekend = day === 0 || day === 6;
      const r = rand();
      if (isWeekend) return r > 0.85 ? Math.floor(r * 3) : 0;
      return r > 0.4 ? Math.floor(r * 5) : 0;
    }),
  );
}

export function GithubDashboard({ github }: { github: GithubSummary }) {
  // Prefer the real GitHub contribution calendar; fall back to the deterministic
  // illustrative grid only when no sync has populated real data yet.
  const grid = useMemo<number[][]>(() => {
    const weeks = github.contributionData?.calendar?.weeks;
    if (weeks && weeks.length > 0) {
      return weeks.map((week) => {
        const days = week.days.map((day) => day.level);
        while (days.length < 7) days.push(0);
        return days;
      });
    }
    return generateContributionGrid(github.commitCount || github.repositoryCount || 1);
  }, [github]);

  const hasRealCalendar = (github.contributionData?.calendar?.weeks?.length ?? 0) > 0;
  const totalContributions = github.contributionData?.totalContributions ?? github.commitCount;

  const languageList: string[] = Array.isArray(github.languages)
    ? github.languages
    : Object.entries(github.languages as Record<string, number>)
        .sort((a, b) => b[1] - a[1])
        .map(([lang]) => lang);

  // Calculate percentages for language bar
  const langEntries: [string, number][] = Array.isArray(github.languages)
    ? (github.languages as string[]).map((l, i) => [l, 100 / (github.languages as string[]).length])
    : Object.entries(github.languages as Record<string, number>).sort((a, b) => b[1] - a[1]);
  const total = langEntries.reduce((s, [, v]) => s + v, 0);

  return (
    <section className="border-y border-white/10 bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <RevealAnimation>
          <div className="mb-12">
            <Badge>GitHub Intelligence</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
              Activity &amp; Contributions
            </h2>
          </div>
        </RevealAnimation>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-10 md:grid-cols-4">
          {[
            { icon: Database, label: "Repositories", value: github.repositoryCount },
            { icon: Github, label: "Contributions", value: totalContributions },
            { icon: Star, label: "Stars", value: github.contributionData?.totalStars ?? 0 },
            { icon: Code2, label: "Languages", value: languageList.length },
          ].map(({ icon: Icon, label, value }, i) => (
            <RevealAnimation key={label} delay={i * 0.08} variant="slide-up">
              <Card className="text-center p-4">
                <Icon className="h-5 w-5 text-blue-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  <AnimatedCounter value={value} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{label}</div>
              </Card>
            </RevealAnimation>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Contribution heatmap */}
          <RevealAnimation variant="fade">
            <Card>
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">Contribution Activity</h3>
                {hasRealCalendar ? (
                  <span className="text-xs text-slate-500">
                    {totalContributions.toLocaleString()} contributions in the last year
                  </span>
                ) : null}
              </div>
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-1 min-w-max">
                  {grid.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                      {week.map((level, di) => (
                        <ContributionDot key={di} level={level} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <ContributionDot key={l} level={l} />
                ))}
                <span>More</span>
              </div>
              {github.syncedAt && (
                <p className="text-xs text-slate-600 mt-3">Last sync: {formatDate(github.syncedAt)}</p>
              )}
            </Card>
          </RevealAnimation>

          {/* Languages */}
          <RevealAnimation variant="slide-up" delay={0.15}>
            <Card>
              <h3 className="text-sm font-semibold text-white mb-4">Languages</h3>
              {/* Stacked bar */}
              <div className="flex h-3 w-full rounded-full overflow-hidden mb-4">
                {langEntries.slice(0, 6).map(([lang, val]) => (
                  <div
                    key={lang}
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${(val / total) * 100}%`,
                      backgroundColor: getLangColor(lang),
                    }}
                  />
                ))}
              </div>
              <div className="grid gap-2">
                {langEntries.slice(0, 6).map(([lang, val]) => (
                  <div key={lang} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getLangColor(lang) }}
                      />
                      <span className="text-slate-300">{lang}</span>
                    </div>
                    <span className="text-slate-500 text-xs">
                      {Math.round((val / total) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </RevealAnimation>
        </div>

        {/* Recent repos */}
        {github.recentRepos?.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {github.recentRepos.slice(0, 3).map((repo, i) => (
              <RevealAnimation key={repo.name} delay={i * 0.08} variant="slide-up">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-white/10 bg-slate-950/50 p-4 hover:border-blue-500/30 hover:bg-slate-950/80 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                      {repo.name}
                    </span>
                    {repo.language && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: `${getLangColor(repo.language)}22`,
                          color: getLangColor(repo.language),
                        }}
                      >
                        {repo.language}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="mt-1.5 text-xs text-slate-400 leading-5 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                </a>
              </RevealAnimation>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
