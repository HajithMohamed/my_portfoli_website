import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { StudioHero } from "./studio-hero";

// Mock framer-motion to render static clean elements without animation loops in jsdom
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    p: ({ children, className, ...props }: any) => (
      <p className={className} {...props}>
        {children}
      </p>
    ),
    circle: ({ ...props }: any) => <circle {...props} />,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
}));

describe("StudioHero Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the approved headline and studio pill", () => {
    render(<StudioHero />);

    // Check status pill
    expect(
      screen.getByText(/Mohamed Hajith · BICT \(Hons\) · Open to Internships/i)
    ).toBeDefined();

    // Check headline text fragments
    expect(screen.getByRole("heading", { name: "Mohamed Hajith" })).toBeDefined();
    expect(screen.getByText(/Full-Stack Software Developer | Backend & Database Engineering/i)).toBeDefined();
    expect(screen.getByText(/Third-year BICT \(Hons\) undergraduate at the University of Ruhuna/i)).toBeDefined();
  });

  it("renders the primary and secondary CTA buttons with correct destinations", () => {
    render(<StudioHero />);

    const projectsBtn = screen.getByRole("link", { name: /view engineering projects/i });
    expect(projectsBtn).toBeDefined();
    expect(projectsBtn.getAttribute("href")).toBe("#projects");

    const cvBtn = screen.getByRole("link", { name: /download cv/i });
    expect(cvBtn).toBeDefined();
    expect(cvBtn.getAttribute("href")).toBe("/api/cv");

    const hireLink = screen.getByRole("link", { name: /hire hz labs/i });
    expect(hireLink).toBeDefined();
    expect(hireLink.getAttribute("href")).toBe("/start-project");
  });

  it("renders the interactive architecture visualization with 6 orbital nodes", () => {
    render(<StudioHero />);

    const diagram = screen.getByRole("region", {
      name: /HZ Labs interactive software architecture diagram/i,
    });
    expect(diagram).toBeDefined();

    // Verify key nodes exist
    expect(screen.getByText("Frontend")).toBeDefined();
    expect(screen.getByText("Cloud & Infra")).toBeDefined();
    expect(screen.getByText("DevOps")).toBeDefined();
    expect(screen.getByText("Backend")).toBeDefined();
    expect(screen.getByText("Database")).toBeDefined();
    expect(screen.getByText("Mobile")).toBeDefined();
  });

  it("displays node details tooltip on hover", async () => {
    render(<StudioHero />);

    const frontendNode = screen.getByRole("button", {
      name: /Frontend architecture tier/i,
    });
    expect(frontendNode).toBeDefined();

    // Hover over the node
    fireEvent.mouseEnter(frontendNode);

    // Verify tooltip contents
    expect(screen.getByText(/Client Tier/i)).toBeDefined();
    expect(screen.getByText(/Next\.js 16 · React 19 · TypeScript · TailwindCSS/i)).toBeDefined();

    // Mouse leave
    fireEvent.mouseLeave(frontendNode);
  });

  it("renders verified credibility badges in the hero footer", () => {
    render(<StudioHero />);

    expect(screen.getAllByText(/BICT \(Hons\) Undergraduate/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Backend & Database Design/i)).toBeDefined();
    expect(screen.getByText(/React · Next\.js · Node\.js · PostgreSQL/i)).toBeDefined();
  });
});
