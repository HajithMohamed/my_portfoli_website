import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { BioSection } from "./bio-section";

describe("BioSection Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the approved biographical text with degree credentials", () => {
    render(<BioSection />);

    expect(screen.getByText(/Mohamed Hajith/i)).toBeDefined();
    // Verify BICT (Hons) appears in the bio
    const bictElements = screen.getAllByText(/BICT \(Hons\)/i);
    expect(bictElements.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/I build practical web applications, secure REST APIs, and database-driven business systems/i)
    ).toBeDefined();
  });

  it("renders verified status badges and GitHub link", () => {
    render(<BioSection />);

    expect(screen.getByText(/BICT \(Hons\) Undergraduate/i)).toBeDefined();
    expect(screen.getByText(/Verified Public Code/i)).toBeDefined();

    const githubLink = screen.getByRole("link", { name: /@HajithMohamed/i });
    expect(githubLink).toBeDefined();
    expect(githubLink.getAttribute("href")).toBe("https://github.com/HajithMohamed");
  });

  it("renders link to full about profile", () => {
    render(<BioSection />);

    const profileLink = screen.getByRole("link", { name: /full profile/i });
    expect(profileLink).toBeDefined();
    expect(profileLink.getAttribute("href")).toBe("/about");
  });
});
