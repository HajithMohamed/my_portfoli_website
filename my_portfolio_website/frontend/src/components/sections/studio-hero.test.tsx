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
      screen.getByText(/HZ LABS · Available for Client Projects/i)
    ).toBeDefined();

    // Check headline text fragments
    expect(screen.getByText(/Engineering ideas/i)).toBeDefined();
    expect(screen.getByText(/intelligent/i)).toBeDefined();
    expect(screen.getByText(/digital products/i)).toBeDefined();
  });

  it("renders the primary and secondary CTA buttons with correct destinations", () => {
    render(<StudioHero />);

    const exploreBtn = screen.getByRole("link", { name: /explore work/i });
    expect(exploreBtn).toBeDefined();
    expect(exploreBtn.getAttribute("href")).toBe("#projects");

    const timelineBtn = screen.getByRole("link", { name: /see my timeline/i });
    expect(timelineBtn).toBeDefined();
    expect(timelineBtn.getAttribute("href")).toBe("/about");
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

    expect(screen.getByText(/Verified Public Repos/i)).toBeDefined();
    expect(screen.getByText(/Clean Architecture/i)).toBeDefined();
    expect(screen.getByText(/Next\.js 16 \+ NestJS \+ Flutter/i)).toBeDefined();
  });
});
