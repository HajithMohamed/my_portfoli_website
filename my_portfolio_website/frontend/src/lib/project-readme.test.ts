import { describe, expect, it } from "vitest";
import { formatReadmeDate, projectSummary, recentReadmeUpdate } from "./project-readme";
import type { ProjectReadme } from "./types";

const readme = (fields: Partial<ProjectReadme> = {}): ProjectReadme => ({
  repo: "HajithMohamed/Tech_Bridge",
  htmlUrl: "https://github.com/HajithMohamed/Tech_Bridge/blob/main/README.md",
  sha: "abc",
  summary: "From the README.",
  sections: [],
  syncedAt: "2026-11-01T00:00:00.000Z",
  changedAt: null,
  ...fields,
});

describe("projectSummary", () => {
  it("prefers the README summary", () => {
    expect(projectSummary({ description: "CMS text", readme: readme() })).toBe("From the README.");
  });

  it("falls back to the CMS description when the README has no summary", () => {
    expect(projectSummary({ description: "CMS text", readme: readme({ summary: null }) })).toBe("CMS text");
    expect(projectSummary({ description: "CMS text", readme: readme({ summary: "  " }) })).toBe("CMS text");
    expect(projectSummary({ description: "CMS text" })).toBe("CMS text");
  });
});

describe("recentReadmeUpdate", () => {
  const now = new Date("2026-11-08T12:00:00.000Z");

  it("returns the change date within the highlight window", () => {
    const update = recentReadmeUpdate({ readme: readme({ changedAt: "2026-11-05T09:00:00.000Z" }) }, now);
    expect(update?.toISOString()).toBe("2026-11-05T09:00:00.000Z");
  });

  it("ignores first syncs, old changes and invalid dates", () => {
    expect(recentReadmeUpdate({ readme: readme() }, now)).toBeNull();
    expect(recentReadmeUpdate({ readme: readme({ changedAt: "2026-10-01T00:00:00.000Z" }) }, now)).toBeNull();
    expect(recentReadmeUpdate({ readme: readme({ changedAt: "not a date" }) }, now)).toBeNull();
    expect(recentReadmeUpdate({}, now)).toBeNull();
  });
});

describe("formatReadmeDate", () => {
  it("formats in Sri Lanka time", () => {
    expect(formatReadmeDate("2026-11-07T20:00:00.000Z")).toBe("8 Nov 2026");
  });
});
