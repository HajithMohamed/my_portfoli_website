import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, ButtonLink } from "./button";
import { Badge } from "./badge";
import { Card } from "./card";

describe("Studio UI Components", () => {
  describe("Button & ButtonLink", () => {
    it("renders primary button with radiant gradient pill styling", () => {
      render(<Button variant="primary">Explore Work</Button>);
      const btn = screen.getByRole("button", { name: /explore work/i });
      expect(btn).toBeDefined();
      expect(btn.className).toContain("from-violet-600");
      expect(btn.className).toContain("rounded-full");
    });

    it("renders secondary button with glass pill styling", () => {
      render(<Button variant="secondary">Documentation</Button>);
      const btn = screen.getByRole("button", { name: /documentation/i });
      expect(btn.className).toContain("bg-white/5");
      expect(btn.className).toContain("backdrop-blur-md");
    });

    it("renders outline button with cyan border styling", () => {
      render(<Button variant="outline">View Repo</Button>);
      const btn = screen.getByRole("button", { name: /view repo/i });
      expect(btn.className).toContain("border-cyan/40");
      expect(btn.className).toContain("text-cyan");
    });

    it("renders copper button with amber/orange gradient styling", () => {
      render(<Button variant="copper">High Priority</Button>);
      const btn = screen.getByRole("button", { name: /high priority/i });
      expect(btn.className).toContain("from-amber-500");
    });

    it("renders internal ButtonLink using Next.js Link", () => {
      render(<ButtonLink href="/start-project">Start a Project</ButtonLink>);
      const link = screen.getByRole("link", { name: /start a project/i });
      expect(link.getAttribute("href")).toBe("/start-project");
      expect(link.getAttribute("target")).toBeNull();
    });

    it("renders external ButtonLink with target='_blank' and rel='noreferrer'", () => {
      render(<ButtonLink href="https://github.com/HajithMohamed">GitHub</ButtonLink>);
      const link = screen.getByRole("link", { name: /github/i });
      expect(link.getAttribute("href")).toBe("https://github.com/HajithMohamed");
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toContain("noreferrer");
    });
  });

  describe("Badge Component", () => {
    it("renders default glass badge", () => {
      render(<Badge>Full-Stack</Badge>);
      const badge = screen.getByText("Full-Stack");
      expect(badge.className).toContain("rounded-full");
      expect(badge.className).toContain("bg-white/5");
    });

    it("renders violet badge with violet border and shadow", () => {
      render(<Badge variant="violet">Architecture</Badge>);
      const badge = screen.getByText("Architecture");
      expect(badge.className).toContain("border-violet-500/30");
      expect(badge.className).toContain("text-violet-300");
    });

    it("renders cyan badge with cyan border and glow", () => {
      render(<Badge variant="cyan">Active System</Badge>);
      const badge = screen.getByText("Active System");
      expect(badge.className).toContain("border-cyan-500/30");
      expect(badge.className).toContain("text-cyan-300");
    });

    it("renders copper badge with amber styling", () => {
      render(<Badge variant="copper">Featured</Badge>);
      const badge = screen.getByText("Featured");
      expect(badge.className).toContain("border-amber-500/30");
      expect(badge.className).toContain("text-amber-300");
    });

    it("renders success badge with emerald styling", () => {
      render(<Badge variant="success">Production Ready</Badge>);
      const badge = screen.getByText("Production Ready");
      expect(badge.className).toContain("border-emerald-500/30");
      expect(badge.className).toContain("text-emerald-300");
    });
  });

  describe("Card Component", () => {
    it("renders glassmorphic card with rounded-2xl and backdrop blur", () => {
      render(<Card data-testid="test-card">Card Content</Card>);
      const card = screen.getByTestId("test-card");
      expect(card.className).toContain("rounded-2xl");
      expect(card.className).toContain("border-white/[0.08]");
      expect(card.className).toContain("backdrop-blur-xl");
    });
  });
});
