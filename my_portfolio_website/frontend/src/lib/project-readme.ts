import type { Project } from "./types";

/** How long a README change stays highlighted on the public site. */
export const README_UPDATE_WINDOW_DAYS = 14;

/** Set by the admin login form so the dashboard checks READMEs once per sign-in. */
export const README_CHECK_FLAG = "hz:readme-check-after-login";

/**
 * The text shown on project cards and at the top of the project page: the
 * README's own description when it has one, otherwise the CMS description.
 */
export function projectSummary(project: Pick<Project, "description" | "readme">): string {
  return project.readme?.summary?.trim() || project.description;
}

/** The date of a recent README change, or null when there is none to show. */
export function recentReadmeUpdate(
  project: Pick<Project, "readme">,
  now: Date = new Date(),
): Date | null {
  const changedAt = project.readme?.changedAt;
  if (!changedAt) return null;
  const date = new Date(changedAt);
  const age = now.getTime() - date.getTime();
  if (Number.isNaN(age) || age < 0 || age > README_UPDATE_WINDOW_DAYS * 86_400_000) {
    return null;
  }
  return date;
}

export function formatReadmeDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Colombo",
  }).format(new Date(date));
}
