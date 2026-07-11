"use client";

import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DatabaseZap, Github, Layers3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useCountUp } from "@/lib/hooks";
import type { GithubSummary } from "@/lib/types";

const DONUT_COLORS = ["#3b82f6", "#22d3ee", "#818cf8", "#a78bfa", "#34d399", "#f472b6", "#fbbf24", "#f87171"];
const EASE = [0.22, 1, 0.36, 1] as const;

type LanguageStat = { name: string; value: number; pct: number };

function toLanguageStats(languages: GithubSummary["languages"]): LanguageStat[] {
  const entries: Array<[string, number]> = Array.isArray(languages)
    ? languages.map((name, index) => [name, languages.length - index])
    : Object.entries(languages);
  const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1;
  return entries
    .map(([name, value]) => ({ name, value, pct: (value / total) * 100 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function Metric({ label, value, active }: { label: string; value: number; active: boolean }) {
  const display = useCountUp(value, active, 1.4);
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <div className="text-3xl font-semibold tabular-nums text-white">{display}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}

function LanguageDonut({ stats, active }: { stats: LanguageStat[]; active: boolean }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0">
        <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
          <circle cx={80} cy={80} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={16} />
          {stats.map((stat, index) => {
            const dash = (stat.pct / 100) * circumference;
            const segment = (
              <motion.circle
                key={stat.name}
                cx={80}
                cy={80}
                r={radius}
                fill="none"
                stroke={DONUT_COLORS[index % DONUT_COLORS.length]}
                strokeWidth={16}
                strokeLinecap="butt"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offsetAcc}
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              />
            );
            offsetAcc += dash;
            return segment;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-white">{stats.length}</span>
          <span className="text-xs text-slate-400">languages</span>
        </div>
      </div>

      <ul className="grid w-full gap-2">
        {stats.map((stat, index) => (
          <li key={stat.name} className="flex items-center gap-3 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }}
            />
            <span className="flex-1 text-slate-200">{stat.name}</span>
            <span className="tabular-nums text-slate-500">{Math.round(stat.pct)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type GithubChartsProps = {
  github: GithubSummary;
  projectsCount: number;
  exploring: string[];
};

export function GithubCharts({ github, projectsCount, exploring }: GithubChartsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const active = useInView(rootRef, { once: true, margin: "-100px" });
  const languageStats = useMemo(() => toLanguageStats(github.languages), [github.languages]);

  const metrics: Array<{ label: string; value: number }> = [
    { label: "Repositories", value: github.repositoryCount },
    { label: "Recent commits", value: github.commitCount },
    { label: "Projects shipped", value: projectsCount },
    { label: "Languages", value: languageStats.length },
  ];

  return (
    <div ref={rootRef} className="grid gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Metric key={metric.label} label={metric.label} value={metric.value} active={active} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <Github className="h-6 w-6 text-blue-300" />
            <h3 className="font-display text-xl font-semibold text-white">Language distribution</h3>
          </div>
          <LanguageDonut stats={languageStats} active={active} />
          <p className="mt-6 text-sm text-slate-500">Last sync: {formatDate(github.syncedAt)}</p>
        </Card>

        <Card>
          <div className="mb-6 flex items-center gap-3">
            <Layers3 className="h-6 w-6 text-blue-300" />
            <h3 className="font-display text-xl font-semibold text-white">Currently exploring</h3>
          </div>
          <div className="grid gap-3">
            {exploring.map((item, index) => (
              <motion.div
                key={item}
                className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3"
                initial={{ opacity: 0, x: -8 }}
                animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
                transition={{ delay: index * 0.08, duration: 0.4, ease: EASE }}
              >
                <DatabaseZap className="h-4 w-4 text-blue-300" />
                <span className="text-sm text-slate-200">{item}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {github.recentRepos.length ? (
        <Card>
          <h3 className="mb-4 font-display text-xl font-semibold text-white">Most active repositories</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {github.recentRepos.slice(0, 4).map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-md border border-white/10 bg-white/[0.03] p-4 transition hover:border-blue-400/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{repo.name}</span>
                  {repo.language ? (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-100">
                      {repo.language}
                    </span>
                  ) : null}
                </div>
                {repo.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{repo.description}</p>
                ) : null}
              </a>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
