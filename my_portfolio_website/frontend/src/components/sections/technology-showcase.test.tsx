import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { TechnologyShowcase } from "./technology-showcase";

describe("TechnologyShowcase Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders section title, subtitle, and toolstack badge", () => {
    render(<TechnologyShowcase />);

    expect(screen.getByText("TOOLSTACK")).toBeDefined();
    expect(screen.getByRole("heading", { name: /Tools across my work/i })).toBeDefined();
    expect(
      screen.getByText(/The core languages, frameworks, cloud services, and developer tooling/i)
    ).toBeDefined();
  });

  it("renders all three core categories", () => {
    render(<TechnologyShowcase />);

    expect(screen.getByRole("heading", { name: "Hands-on project experience" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Academic/project experience" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Currently learning" })).toBeDefined();
  });

  it("renders key technology tiles with appropriate project filter links", () => {
    render(<TechnologyShowcase />);

    const tsLink = screen.getByTitle("Filter projects by TypeScript");
    expect(tsLink).toBeDefined();
    expect(tsLink.getAttribute("href")).toBe("/projects?tech=TypeScript");

    const flutterLink = screen.getByTitle("Filter projects by Flutter");
    expect(flutterLink).toBeDefined();
    expect(flutterLink.getAttribute("href")).toBe("/projects?tech=Flutter");

    const nextLink = screen.getByTitle("Filter projects by Next.js");
    expect(nextLink).toBeDefined();
    expect(nextLink.getAttribute("href")).toBe("/projects?tech=Next.js");

    const pgLink = screen.getByTitle("Filter projects by PostgreSQL");
    expect(pgLink).toBeDefined();
    expect(pgLink.getAttribute("href")).toBe("/projects?tech=PostgreSQL");
  });

  it("renders the footer guidance with link to all repositories", () => {
    render(<TechnologyShowcase />);

    expect(
      screen.getByText(/Click any tool to filter projects built with that technology\./i)
    ).toBeDefined();

    const repoLink = screen.getByRole("link", { name: /view all public repositories/i });
    expect(repoLink).toBeDefined();
    expect(repoLink.getAttribute("href")).toBe("/projects");
  });
});
