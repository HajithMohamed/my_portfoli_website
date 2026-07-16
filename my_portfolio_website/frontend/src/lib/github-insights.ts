import type { ContributionDay, GithubSummary } from "./types";

/** All calendar days flattened, oldest → newest. */
export function calendarDays(github: GithubSummary): ContributionDay[] {
  const weeks = github.contributionData?.calendar?.weeks ?? [];
  return weeks.flatMap((w) => w.days);
}

/**
 * Current contribution streak in days — consecutive days with count > 0,
 * ending at the latest calendar day (today may not be pushed yet, so a
 * zero-count final day is skipped before counting).
 */
export function computeStreak(github: GithubSummary): number {
  const days = calendarDays(github);
  if (!days.length) return 0;
  let i = days.length - 1;
  if (days[i] && days[i].count === 0) i -= 1; // today not committed (yet)
  let streak = 0;
  while (i >= 0 && days[i].count > 0) {
    streak += 1;
    i -= 1;
  }
  return streak;
}

/**
 * Heatmap intensity levels (0–4) for the last `weeks` weeks, column-major:
 * week by week, each week top (Sun) → bottom (Sat). Matches a
 * `grid-flow-col grid-rows-7` CSS grid.
 */
export function heatmapLevels(github: GithubSummary, weeks = 12): number[] {
  const all = github.contributionData?.calendar?.weeks ?? [];
  return all.slice(-weeks).flatMap((w) => w.days.map((d) => d.level));
}

export type LanguageShare = { name: string; pct: number };

/** Top languages by byte share, with the remainder folded into "Other". */
export function languageShares(github: GithubSummary, top = 4): LanguageShare[] {
  const languages = github.languages;
  if (!languages || Array.isArray(languages)) return [];
  const entries = Object.entries(languages).filter(([, bytes]) => bytes > 0);
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (!total) return [];
  const sorted = entries
    .map(([name, bytes]) => ({ name, pct: Math.round((bytes / total) * 100) }))
    .sort((a, b) => b.pct - a.pct);
  const head = sorted.slice(0, top);
  const rest = 100 - head.reduce((sum, l) => sum + l.pct, 0);
  if (rest > 0) head.push({ name: "Other", pct: rest });
  return head;
}
