import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/public-data", () => ({
  getHomeData: async () => ({
    profile: {
      name: "Mohamed Hajith",
      email: "ahammedlebbehajith@gmail.com",
      location: "Batticaloa, Sri Lanka",
      bio: "Software Engineer",
      availabilityStatus: "Available",
    },
    resume: { fileUrl: "https://example.com/cv.pdf" },
    skills: [],
    certificates: [],
    projects: [],
    blogs: [],
    github: { totalContributions: 450, currentStreak: 12, publicRepos: 49 },
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/about",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

import AboutPage from "./page";

describe("AboutPage Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the hero headline and academic credentials", async () => {
    const Component = await AboutPage();
    render(Component);

    expect(screen.getByText(/ABOUT \/\/ MOHAMED HAJITH/i)).toBeDefined();
    expect(screen.getAllByText(/BICT \(Hons\)/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/University of Ruhuna/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Batticaloa, Sri Lanka/i)).toBeDefined();
  });

  it("renders chronological career milestones", async () => {
    const Component = await AboutPage();
    render(Component);

    expect(screen.getByText(/HZ Labs Digital Product Studio/i)).toBeDefined();
    expect(screen.getByText(/Footwear BMS/i)).toBeDefined();
    expect(screen.getByText(/Cross-Platform Mobile & Voice AI Engineering/i)).toBeDefined();
    expect(screen.getByText(/2023 – 2027/i)).toBeDefined();
  });

  it("renders the 4 core competency pillars", async () => {
    const Component = await AboutPage();
    render(Component);

    expect(screen.getByText("Full-Stack Web Engineering")).toBeDefined();
    expect(screen.getByText("Backend & API Architecture")).toBeDefined();
    expect(screen.getByText("Cross-Platform Mobile")).toBeDefined();
    expect(screen.getByText("AI & Workflow Automation")).toBeDefined();
  });

  it("renders links to start-project and certificates", async () => {
    const Component = await AboutPage();
    render(Component);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/start-project");
    expect(hrefs).toContain("/certificates");
  });
});
