import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import styles from "@/components/projects/project-views.module.css";
import { StudioProjectsShowcase } from "./studio-projects-showcase";
import type { Project } from "@/lib/types";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
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

/** jsdom has no layout, so give the scroll row and its cards real sizes. */
function fakeLayout({ cardWidth = 300, visibleWidth = 600, totalWidth = 1240 } = {}) {
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(cardWidth);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(visibleWidth);
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(totalWidth);
}

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

describe("Homepage project row", () => {
  it("shows every selected project in one scrollable row", () => {
    render(
      <StudioProjectsShowcase
        projects={["a", "b", "c", "d", "e", "f"].map((id) => project(id))}
      />,
    );
    const row = screen.getByRole("list", { name: /Featured projects/i });
    expect(row.className).toContain(styles.carouselTrack);
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(screen.getByRole("listitem", { name: "1 of 6: Project a" })).toBeDefined();
  });

  it("moves one card at a time with the arrow buttons and never scrolls on its own", () => {
    fakeLayout();
    const scrollBy = vi.fn();
    HTMLElement.prototype.scrollBy = scrollBy;
    render(
      <StudioProjectsShowcase
        projects={["a", "b", "c", "d"].map((id) => project(id))}
      />,
    );
    const previous = screen.getByRole("button", { name: "Previous project" });
    const next = screen.getByRole("button", { name: "Next project" });
    expect(scrollBy).not.toHaveBeenCalled();
    expect((previous as HTMLButtonElement).disabled).toBe(true);
    expect((next as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(next);
    expect(scrollBy).toHaveBeenCalledWith({ left: 300, behavior: "smooth" });

    const row = screen.getByRole("list", { name: /Featured projects/i });
    vi.spyOn(row, "scrollLeft", "get").mockReturnValue(640);
    fireEvent.scroll(row);
    expect((previous as HTMLButtonElement).disabled).toBe(false);
    expect((next as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(previous);
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -300, behavior: "smooth" });
  });

  it("hides the arrows when there is only one project", () => {
    render(<StudioProjectsShowcase projects={[project("solo")]} />);
    expect(screen.queryByRole("button", { name: /project$/ })).toBeNull();
  });
});
