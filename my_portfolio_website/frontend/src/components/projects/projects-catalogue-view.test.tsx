import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import styles from "./project-views.module.css";
import { ProjectsCatalogueView } from "./projects-catalogue-view";
import type { Project } from "@/lib/types";

describe("ProjectsCatalogueView Component", () => {
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
      slug: "shoe-bank",
      description: "Wholesale management platform.",
      techStack: ["PHP", "MySQL", "Tailwind CSS"],
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
    {
      id: "proj-3",
      title: "Saga Elite Web Platform",
      slug: "saga-elite",
      description: "Fashion drop ecommerce system.",
      techStack: ["React", "Node.js", "Express", "MongoDB"],
      category: "Group project case study",
      status: "ACTIVE",
      featured: false,
      githubUrl: "https://github.com/HajithMohamed/Saga-Elite-Web-project",
      liveUrl: "https://saga-elite.example.com",
    },
    {
      id: "proj-4",
      title: "Tech Bridge Network",
      slug: "tech-bridge",
      description: "Developer collaboration network.",
      techStack: ["React", "Node.js", "TypeScript"],
      category: "Collaboration Platform",
      status: "ACTIVE",
      featured: false,
      isCurrent: true,
      githubUrl: "https://github.com/HajithMohamed/Tech_Bridge",
      liveUrl: null,
    },
  ];

  it("renders category tabs with accurate project counts", () => {
    render(<ProjectsCatalogueView projects={mockProjects} />);
    expect(screen.getByRole("button", { name: /All Projects/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Featured/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Currently Building/i })).toBeDefined();
    expect(
      screen.getAllByText((_, element) => element?.textContent === "Showing 4 of 4 projects").length
    ).toBeGreaterThan(0);
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(4);
    expect(articles[0].className).toContain(styles.lead);
  });

  it("filters projects when clicking Featured category tab", () => {
    render(<ProjectsCatalogueView projects={mockProjects} />);
    const featuredBtn = screen.getByRole("button", { name: /Featured/i });
    fireEvent.click(featuredBtn);

    expect(
      screen.getByText("Footwear Business Management System")
    ).toBeDefined();
    expect(screen.getByText("Goyo Elite Voice Project")).toBeDefined();
    expect(screen.queryByText("Saga Elite Web Platform")).toBeNull();
  });

  it("filters projects dynamically via search query input", () => {
    render(<ProjectsCatalogueView projects={mockProjects} />);
    const searchInput = screen.getByPlaceholderText(
      /Search by title, stack, or keywords/i
    );
    fireEvent.change(searchInput, { target: { value: "Voice" } });

    expect(screen.getByText("Goyo Elite Voice Project")).toBeDefined();
    expect(
      screen.queryByText("Footwear Business Management System")
    ).toBeNull();
  });

  it("displays empty state and allows resetting filters when query matches nothing", () => {
    render(<ProjectsCatalogueView projects={mockProjects} />);
    const searchInput = screen.getByPlaceholderText(
      /Search by title, stack, or keywords/i
    );
    fireEvent.change(searchInput, { target: { value: "nonexistentquery123" } });

    expect(
      screen.getByText("No projects match your filter")
    ).toBeDefined();

    const resetBtn = screen.getByRole("button", { name: /Reset All Filters/i });
    fireEvent.click(resetBtn);

    expect(
      screen.getByText("Footwear Business Management System")
    ).toBeDefined();
    expect(screen.getByText("Saga Elite Web Platform")).toBeDefined();
  });
});
