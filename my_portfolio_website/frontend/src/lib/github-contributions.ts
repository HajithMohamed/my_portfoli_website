import contributionsCache from "./github-contributions-cache.json";

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionDataset {
  total: number;
  contributions: ContributionDay[];
}

export interface AllContributionsData {
  lastYear: ContributionDataset;
  "2026": ContributionDataset;
  "2025": ContributionDataset;
  "2024": ContributionDataset;
}

export const REAL_CONTRIBUTIONS_CACHE: AllContributionsData =
  contributionsCache as AllContributionsData;

export interface WeekColumn {
  days: (ContributionDay | null)[];
}

export interface MonthLabel {
  weekIndex: number;
  month: string;
}

/**
 * Transforms an array of daily contributions into 53 weeks of 7 days (Sunday - Saturday),
 * perfectly padded so day 0 is always Sunday and day 6 is always Saturday.
 */
export function formatToWeeks(days: ContributionDay[]): WeekColumn[] {
  if (!days || !days.length) return [];
  const weeks: WeekColumn[] = [];
  let currentWeek: (ContributionDay | null)[] = [];

  // Pad the first week with nulls if it doesn't start on Sunday
  const [firstY, firstM, firstD] = days[0].date.split("-").map(Number);
  const firstDate = new Date(firstY, firstM - 1, firstD);
  const firstDow = firstDate.getDay(); // 0 = Sunday
  for (let i = 0; i < firstDow; i++) {
    currentWeek.push(null);
  }

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push({ days: currentWeek });
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push({ days: currentWeek });
  }

  return weeks;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Computes exact week column indices where each new month begins across the 53 weeks.
 */
export function getMonthLabels(weeks: WeekColumn[]): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let lastMonth = -1;

  weeks.forEach((week, wIdx) => {
    const validDay = week.days.find((d) => d !== null);
    if (!validDay) return;
    const [y, m] = validDay.date.split("-").map(Number);
    const monthIndex = m - 1;
    if (monthIndex !== lastMonth) {
      labels.push({ weekIndex: wIdx, month: MONTH_NAMES[monthIndex] });
      lastMonth = monthIndex;
    }
  });

  return labels;
}

export const THEME_HEATMAP_COLORS = [
  "bg-[#0a0f24] border-[#1e2640]",                                                 // Level 0: Idle
  "bg-[#064e3b] border-emerald-700/60 shadow-[0_0_4px_rgba(5,150,105,0.2)]",        // Level 1: Low
  "bg-[#047857] border-emerald-500/70 shadow-[0_0_8px_rgba(16,185,129,0.35)]",      // Level 2: Medium
  "bg-[#10b981] border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.55)]",        // Level 3: High
  "bg-[#34d399] border-cyan-200 shadow-[0_0_16px_rgba(52,211,153,0.85)]",           // Level 4: Surge
];
