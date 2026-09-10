import type { Project } from "./types";

/**
 * Deterministic HUD codename from the project slug,
 * e.g. "commerce-platform" → "CMRC-01".
 */
export function projectCodename(project: Project, index = 0): string {
  const consonants = project.slug
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .replace(/[AEIOU]/g, "");
  const code = (consonants || project.slug.toUpperCase().replace(/[^A-Z]/g, "")).slice(0, 4);
  return `${code.padEnd(4, "X")}-${String(index + 1).padStart(2, "0")}`;
}

export function projectYear(project: Project): string {
  if (!project.updatedAt) return new Date().getFullYear().toString();
  return new Date(project.updatedAt).getFullYear().toString();
}

export type HudStatus = "in-flight" | "shipped" | "maintenance";

/** Most recently updated project reads as in-flight; the rest as shipped. */
export function projectHudStatus(project: Project, isLatest: boolean): HudStatus {
  if (project.status === "ARCHIVED") return "maintenance";
  if (isLatest) return "in-flight";
  return "shipped";
}

export const HUD_STATUS_STYLE: Record<HudStatus, string> = {
  "in-flight": "text-signal-amber bg-signal-amber/10 border-signal-amber/30",
  shipped: "text-signal-green bg-signal-green/10 border-signal-green/30",
  maintenance: "text-muted-foreground bg-surface border-cyan/15",
};

/** Pull a named section body out of the project's case study. */
export function caseStudySection(project: Project, headings: string[]): string | null {
  const sections = project.caseStudy ?? [];
  for (const heading of headings) {
    const match = sections.find((s) =>
      s.heading.toLowerCase().includes(heading.toLowerCase()),
    );
    if (match?.body) return match.body;
  }
  return null;
}

export function projectBriefing(project: Project) {
  return {
    problem: caseStudySection(project, ["problem"]),
    approach: caseStudySection(project, ["solution", "approach", "architecture"]),
    outcome: project.outcome ?? caseStudySection(project, ["outcome", "result"]),
  };
}
