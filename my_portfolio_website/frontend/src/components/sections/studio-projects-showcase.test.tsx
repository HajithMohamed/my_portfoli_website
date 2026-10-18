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
      title: "Footwear Business Management System",
      slug: "footwear-business-management-system",
      description: "Wholesale management platform designed for the footwear industry.",
      techStack: ["PHP", "MySQL", "Tailwind CSS", "Alpine.js", "Docker"],
      category: "Enterprise System",
      status: "ACTIVE",
      featured: true,
      githubUrl: "https://github.com/HajithMohamed/Footwear_Business_Management_System",
      liveUrl: null,
    },
    {
      id: "proj-2",
      title: "Goyo Elite Voice Project",
      slug: "goyo-voice",
      description: "Voice AI assistant and interface.",
      techStack: ["Python", "Voice AI", "PyTorch"],
      category: "Voice AI",
      status: "ACTIVE",
      featured: true,
      githubUrl: "https://github.com/HajithMohamed/goyo-voice",
      liveUrl: null,
    },
  ];

  it("renders the section header and featured projects title", () => {
    render(<StudioProjectsShowcase projects={mockProjects} />);
    expect(screen.getByText(/SELECTED WORK/i)).toBeDefined();
    expect(screen.getByText(/Featured projects/i)).toBeDefined();
  });

  it("renders the hero featured project card for Footwear BMS with tech tags", () => {
    render(<StudioProjectsShowcase projects={mockProjects} />);
    expect(
      screen.getByText("Footwear Business Management System")
    ).toBeDefined();
    expect(screen.getByText("PHP")).toBeDefined();
    expect(screen.getByText("MySQL")).toBeDefined();
    expect(screen.getByText("Alpine.js")).toBeDefined();
  });

  it("renders the secondary featured project cards (Goyo Voice & HZ Labs)", () => {
    render(<StudioProjectsShowcase projects={mockProjects} />);
    expect(screen.getByText("Goyo Elite Voice Project")).toBeDefined();
    expect(screen.getByText("HZ Labs Portfolio Platform")).toBeDefined();
  });

  it("renders the currently building section with status badges", () => {
    render(<StudioProjectsShowcase projects={mockProjects} />);
    const buildingElements = screen.getAllByText(/Currently building/i);
    expect(buildingElements.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText("Medical Laboratory Business Automation")
    ).toBeDefined();
    expect(
      screen.getByText("Tech Bridge Collaboration Network")
    ).toBeDefined();
  });
});
