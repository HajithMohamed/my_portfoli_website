import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ServicesShowcase } from "./services-showcase";

describe("ServicesShowcase Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the section header and title matching Lovable design", () => {
    render(<ServicesShowcase />);
    expect(screen.getByText("SERVICES")).toBeDefined();
    expect(screen.getByText("What I build")).toBeDefined();
    expect(screen.getByText("Full Services Catalog")).toBeDefined();
  });

  it("renders all 6 service cards with their titles", () => {
    render(<ServicesShowcase />);
    expect(screen.getByText("Web & SaaS platforms")).toBeDefined();
    expect(screen.getByText("Mobile apps (In Development)")).toBeDefined();
    expect(screen.getByText("E-commerce")).toBeDefined();
    expect(screen.getByText("Backend & APIs")).toBeDefined();
    expect(screen.getByText("Admin dashboards")).toBeDefined();
    expect(screen.getByText("AI & automation")).toBeDefined();
  });

  it("renders technology stack tags for services", () => {
    render(<ServicesShowcase />);
    expect(screen.getAllByText("Next.js").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Flutter (Exploring)")).toBeDefined();
    expect(screen.getByText("Dart")).toBeDefined();
    expect(screen.getByText("NestJS")).toBeDefined();
  });

  it("links to /services and /start-project with query parameters", () => {
    render(<ServicesShowcase />);
    const catalogLinks = screen.getAllByRole("link");
    const hrefs = catalogLinks.map((link) => link.getAttribute("href"));

    expect(hrefs).toContain("/services");
    expect(hrefs.some((h) => h?.includes("/start-project?service=web-saas"))).toBe(true);
    expect(hrefs.some((h) => h?.includes("/start-project?service=ecommerce"))).toBe(true);
  });
});
