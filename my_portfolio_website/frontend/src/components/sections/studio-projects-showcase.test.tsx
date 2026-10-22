import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { StudioProjectsShowcase } from "./studio-projects-showcase";
import type { Project } from "@/lib/types";

describe("StudioProjectsShowcase Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  const mockProjects: Project[] = [
    {
      id: "proj-1",
      title: "Saga Elite — Full-Stack E-Commerce Platform",
      slug: "saga-elite",
      description: "Collaborative e-commerce application developed by a four-member team.",
      techStack: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Socket.IO", "Playwright", "GitHub Actions"],
      category: "Full-Stack E-Commerce",
      status: "ACTIVE",
      featured: true,
      githubUrl: "https://github.com/Hz-Labs-studio/Saga-Elite-Web-project",
      liveUrl: "https://saga-elite.shop/",
    },
    {
      id: "proj-2",
      title: "BenchBook — Laboratory Resource Reservation System",
      slug: "benchbook",
      description: "Database-driven resource reservation platform.",
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Vitest"],
      category: "Database Engineering",
      status: "ACTIVE",
      featured: true,
      githubUrl: "https://github.com/HajithMohamed/Medical-Lab-Resource-Reservation-System",
      liveUrl: null,
    },
    {
      id: "proj-3",
      title: "BloodBridge — Advanced Database Management System",
      slug: "bloodbridge",
      description: "Collaborative academic prototype for blood donation registries.",
      techStack: ["PostgreSQL", "PL/pgSQL", "React", "Node.js", "Docker", "GitHub Actions"],
      category: "ADBMS Prototype",
      status: "ACTIVE",
      featured: true,
      githubUrl: "https://github.com/akalanka001/-BloodBridge--ADBMS",
      liveUrl: null,
    },
  ];

  it("renders the section header and featured projects title", () => {
    render(<StudioProjectsShowcase projects={mockProjects} />);
    expect(screen.getByText(/SELECTED WORK/i)).toBeDefined();
    expect(screen.getByText(/Featured projects/i)).toBeDefined();
  });

  it("renders the hero featured project card for Saga Elite with team leadership", () => {
    render(<StudioProjectsShowcase projects={mockProjects} />);
    expect(
      screen.getByText(/Saga Elite — Full-Stack E-Commerce Platform/i)
    ).toBeDefined();
    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Redux Toolkit")).toBeDefined();
    expect(screen.getByText("Socket.IO")).toBeDefined();
    expect(screen.getByText("Playwright")).toBeDefined();
  });

  it("renders the secondary featured project cards (BenchBook & BloodBridge)", () => {
    render(<StudioProjectsShowcase projects={mockProjects} />);
    expect(screen.getByText(/BenchBook — Laboratory Resource Reservation System/i)).toBeDefined();
    expect(screen.getByText(/BloodBridge — Advanced Database Management System/i)).toBeDefined();
  });

  it("renders tertiary featured systems (HZ Labs & Shoe Bank PHP/MySQL)", () => {
    render(<StudioProjectsShowcase projects={mockProjects} />);
    expect(
      screen.getByText(/HZ Labs Portfolio & Content Management Platform/i)
    ).toBeDefined();
    expect(
      screen.getByText(/Shoe Bank — Footwear Business Management System/i)
    ).toBeDefined();
    expect(screen.getAllByText("PHP").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("MySQL").length).toBeGreaterThanOrEqual(1);
  });
});
