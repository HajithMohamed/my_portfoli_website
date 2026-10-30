import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { getAboutDataMock, getHomeDataMock } = vi.hoisted(() => ({
  getAboutDataMock: vi.fn(async () => ({
    profile: {
      name: "Mohamed Hajith",
      title: "Full-Stack Software Developer",
      tagline: "Building practical web applications",
      email: "ahammedlebbehajith@gmail.com",
      location: "Batticaloa, Sri Lanka",
      bio: "Software Engineer",
      philosophy: "Architecture first",
      availabilityStatus: "Available",
      currentlyExploring: [],
      socialLinks: [],
    },
    resume: {
      id: "cv-1",
      title: "Mohamed Hajith CV",
      fileUrl: "https://example.com/cv.pdf",
      version: 1,
      isActive: true,
    },
  })),
  getHomeDataMock: vi.fn(),
}));

vi.mock("@/lib/public-data", () => ({
  getAboutData: getAboutDataMock,
  getHomeData: getHomeDataMock,
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
    getAboutDataMock.mockClear();
    getHomeDataMock.mockClear();
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
    expect(screen.getAllByText(/Sri Lanka/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders chronological career milestones", async () => {
    const Component = await AboutPage();
    render(Component);

    expect(screen.getByText(/Full-Stack Web & Relational Systems Engineering/i)).toBeDefined();
    expect(screen.getByText(/Shoe Bank/i)).toBeDefined();
    expect(screen.getByText(/Collaborative Engineering & Database Systems/i)).toBeDefined();
    expect(screen.getByText(/2023 – 2027/i)).toBeDefined();
  });

  it("renders the 4 core competency pillars", async () => {
    const Component = await AboutPage();
    render(Component);

    expect(screen.getByText("Full-Stack Web Engineering")).toBeDefined();
    expect(screen.getByText("Backend & Database Architecture")).toBeDefined();
    expect(screen.getByText("Testing, CI/CD & DevOps")).toBeDefined();
    expect(screen.getByText("Mobile & Applied Exploration")).toBeDefined();
  });

  it("renders links to start-project and certificates", async () => {
    const Component = await AboutPage();
    render(Component);

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));

    expect(hrefs).toContain("/start-project");
    expect(hrefs).toContain("/certificates");
    expect(hrefs).toContain("/api/cv");
  });

  it("loads isolated About data without invoking full home/GitHub aggregation", async () => {
    const Component = await AboutPage();
    render(Component);

    expect(getAboutDataMock).toHaveBeenCalledTimes(1);
    expect(getHomeDataMock).not.toHaveBeenCalled();
  });
});
