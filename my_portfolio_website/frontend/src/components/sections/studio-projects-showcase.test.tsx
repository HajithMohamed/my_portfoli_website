import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import styles from "@/components/projects/project-views.module.css";
import { StudioProjectsShowcase } from "./studio-projects-showcase";
import type { Project } from "@/lib/types";

afterEach(cleanup);
const project = (id: string, fields: Partial<Project> = {}): Project => ({
  id,
  slug: id,
  title: `Project ${id}`,
  description: "An administrator's project description.",
  techStack: ["React"],
  category: "Web application",
  status: "ACTIVE",
  featured: true,
  ...fields,
});

describe("Homepage project selection", () => {
  it("renders supplied CMS projects in editorial order without invented cards", () => {
    render(
      <StudioProjectsShowcase
        projects={[project("first"), project("second")]}
      />,
    );
    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .map((node) => node.textContent),
    ).toEqual(["Project first", "Project second"]);
    expect(screen.queryByText(/Shoe Bank/)).toBeNull();
    expect(
      screen
        .getByRole("link", { name: /Case study for Project first/i })
        .getAttribute("href"),
    ).toBe("/projects/first");
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(2);
    expect(cards[0].className).toContain(styles.card);
    expect(cards[0].className).not.toContain(styles.lead);
  });

  it("does not substitute unfeatured, held, or explicitly hidden projects", () => {
    render(
      <StudioProjectsShowcase
        projects={[
          project("draft", { status: "DRAFT" }),
          project("unfeatured", { featured: false }),
          project("hidden", { showOnHomepage: false }),
        ]}
      />,
    );
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
    expect(screen.getByText(/No featured projects/i)).toBeDefined();
  });
});
