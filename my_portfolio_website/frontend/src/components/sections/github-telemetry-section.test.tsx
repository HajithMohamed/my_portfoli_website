import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { GithubTelemetrySection } from "./github-telemetry-section";
import type { GithubSummary } from "@/lib/types";

const mockGithubData: GithubSummary = {
  username: "HajithMohamed",
  repositoryCount: 27,
  commitCount: 480,
  languages: {
    TypeScript: 85000,
    Dart: 45000,
    Python: 25000,
  },
  currentRepo: {
    name: "Tech_Bridge",
    fullName: "HajithMohamed/Tech_Bridge",
    url: "https://github.com/HajithMohamed/Tech_Bridge",
    description: "Production web platform with clean architecture.",
    language: "TypeScript",
    languages: ["TypeScript", "CSS"],
    topics: ["nextjs", "react"],
    defaultBranch: "main",
    updatedAt: "2026-10-18T10:00:00Z",
    pushedAt: "2026-10-18T10:00:00Z",
    homepage: "https://techbridge.studio",
    stars: 12,
    forks: 3,
    openIssues: 0,
    visibility: "public",
    isArchived: false,
    activityStatus: "active",
    statusLabel: "active now",
    statusTone: "green",
    latestCommit: {
      sha: "7f8a9b1",
      url: "https://github.com/HajithMohamed/Tech_Bridge/commit/7f8a9b1",
      message: "feat: telemetry live metrics",
      authoredAt: "2026-10-18T09:45:00Z",
      author: "HajithMohamed",
    },
  },
  recentRepos: [],
  recentActivity: [],
  contributionData: {
    schemaVersion: 2,
    totalContributions: 540,
    totalStars: 18,
    totalForks: 5,
    technologies: ["TypeScript", "Dart", "Python"],
    followers: 45,
    following: 12,
    currentRepo: null,
    repositories: [],
    stats: {
      publicRepositories: 27,
      privateRepositories: 4,
      collaborationRepositories: 3,
      totalCollaborations: 3,
      createdRepositories: 27,
      activeRepositories: 12,
      newRepositories: 5,
      hostedProjects: 8,
      productionReadyProjects: 6,
    },
    calendar: {
      totalContributions: 540,
      weeks: Array.from({ length: 16 }, (_, w) => ({
        days: Array.from({ length: 7 }, (_, d) => ({
          date: `2026-0${Math.floor(w / 4) + 6}-${String((w % 4) * 7 + d + 1).padStart(2, "0")}`,
          count: (w + d) % 5,
          level: ((w + d) % 5) as 0 | 1 | 2 | 3 | 4,
        })),
      })),
    },
    provenance: {
      sourceUrl: "https://github.com/HajithMohamed",
      syncedAt: "2026-10-18T10:00:00Z",
      activityWindowDays: 30,
      hostedDefinition: "",
      productionReadyDefinition: "",
      readinessComplete: true,
      languageRepositoriesSampled: 5,
    },
  },
};

describe("GithubTelemetrySection Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the telemetry header, eyebrow, and GitHub profile link", () => {
    render(<GithubTelemetrySection github={mockGithubData} />);

    expect(screen.getByText(/TELEMETRY \/\/ LIVE CODE ACTIVITY/i)).toBeDefined();
    expect(
      screen.getByRole("heading", { name: /Real-Time Development Telemetry/i })
    ).toBeDefined();

    const profileLink = screen.getByRole("link", { name: /github profile/i });
    expect(profileLink).toBeDefined();
    expect(profileLink.getAttribute("href")).toBe("https://github.com/HajithMohamed");
  });

  it("renders key metric counters: contributions, streak, and public repositories", () => {
    render(<GithubTelemetrySection github={mockGithubData} />);

    expect(screen.getByText("540")).toBeDefined();
    expect(screen.getByText(/day streak/i)).toBeDefined();
    expect(screen.getByText("27")).toBeDefined();
    expect(screen.getByText(/5 forks recorded/i)).toBeDefined();
  });

  it("renders the 53-week GitHub commit heatmap grid and handles hover inspection", () => {
    render(<GithubTelemetrySection github={mockGithubData} />);

    expect(screen.getByText(/1,409 contributions in the last year/i)).toBeDefined();

    const squares = screen.getAllByRole("img");
    expect(squares.length).toBeGreaterThanOrEqual(365); // 53 weeks (~365-371 days)

    // Hover first square
    fireEvent.mouseEnter(squares[0]);
    expect(screen.getByText(/commits on/i)).toBeDefined();

    // Leave
    fireEvent.mouseLeave(squares[0]);

    // Test year selection: Switch to 2025
    const btn2025 = screen.getByRole("button", { name: "2025" });
    fireEvent.click(btn2025);
    expect(screen.getByText(/399 contributions in 2025/i)).toBeDefined();
  });

  it("renders the active repository pulse card with commit details", () => {
    render(<GithubTelemetrySection github={mockGithubData} />);

    expect(screen.getByText("Tech_Bridge")).toBeDefined();
    expect(screen.getByText("7f8a9b1")).toBeDefined();
    expect(screen.getAllByText("active now").length).toBeGreaterThanOrEqual(1);
  });
});
