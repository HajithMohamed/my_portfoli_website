import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ProjectArchitectureVisualizer } from "@/components/projects/project-architecture-visualizer";
import { ProjectDossierView } from "@/components/projects/project-dossier-view";
import type { Project } from "@/lib/types";

// Mock Next.js navigation and image
vi.mock("next/navigation", () => ({
  usePathname: () => "/projects/shoe-bank",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock("next/image", () => ({
  default: ({ fill, priority, ...props }: any) => <img {...props} />,
}));

const mockProject: Project = {
  id: "test-shoe-bank",
  title: "Footwear Business Management System",
  slug: "shoe-bank",
  description: "Enterprise footwear business and inventory management platform.",
  techStack: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
  category: "Enterprise System",
  status: "ACTIVE",
  featured: true,
  outcome: "Engineered high-concurrency inventory tracking with zero race conditions.",
  githubUrl: "https://github.com/HajithMohamed/Footwear_Business_Management_System",
  liveUrl: "https://shoebank.lk",
  coverImage: "/projects/shoe-bank-cover.png",
  caseStudy: [
    {
      heading: "System Architecture & Scope",
      body: "Designed multi-tenant inventory architecture with distributed locking.",
    },
    {
      heading: "Inventory Synchronization",
      body: "Optimized MongoDB schema indexing for real-time stock balance queries.",
    },
  ],
};

describe("ProjectArchitectureVisualizer Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders architecture heading and initial client tier", () => {
    render(
      <ProjectArchitectureVisualizer
        projectTitle={mockProject.title}
        techStack={mockProject.techStack}
        category={mockProject.category}
      />
    );

    expect(screen.getByText(/INTERACTIVE ARCHITECTURE TOPOLOGY/i)).toBeTruthy();
    expect(screen.getByText(/Footwear Business Management System System Architecture/i)).toBeTruthy();
    expect(screen.getAllByText(/Presentation & Client Tier/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/API Gateway & Security Proxy/i).length).toBeGreaterThanOrEqual(1);
  });

  it("updates active tier when clicking a different tier button", () => {
    render(
      <ProjectArchitectureVisualizer
        projectTitle={mockProject.title}
        techStack={mockProject.techStack}
        category={mockProject.category}
      />
    );

    // Click on Persistence & Data Store tier
    const dataTierBtn = screen.getByRole("button", { name: /Persistence & Data Store/i });
    fireEvent.click(dataTierBtn);

    // Verify active tier inspection updates
    expect(screen.getByText(/Storage tier engineered for ACID transaction guarantees/i)).toBeTruthy();
  });
});

describe("ProjectDossierView Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders hero card with title, codename, telemetry metrics, and repo link", () => {
    render(
      <ProjectDossierView
        project={mockProject}
        status="PRODUCTION"
        codename="OP-SHOE-BANK"
        year="2026"
        sections={mockProject.caseStudy || []}
        relatedProjects={[]}
      />
    );

    expect(screen.getByText("Footwear Business Management System")).toBeTruthy();
    expect(screen.getByText(/DOSSIER \/\/ OP-SHOE-BANK/i)).toBeTruthy();
    expect(screen.getByText("Layered MVC / REST")).toBeTruthy();
    const repoLink = screen.getByRole("link", { name: /View Repository/i });
    expect(repoLink.getAttribute("href")).toBe(
      "https://github.com/HajithMohamed/Footwear_Business_Management_System"
    );
  });

  it("switches tabs between Architecture, Case Study, and Tech Modules", () => {
    render(
      <ProjectDossierView
        project={mockProject}
        status="PRODUCTION"
        codename="OP-SHOE-BANK"
        year="2026"
        sections={mockProject.caseStudy || []}
        relatedProjects={[]}
      />
    );

    // Click Case Study tab
    const caseStudyTab = screen.getByRole("button", { name: /Case Study Dossier/i });
    fireEvent.click(caseStudyTab);
    expect(screen.getByText("System Architecture & Scope")).toBeTruthy();
    expect(screen.getByText("Inventory Synchronization")).toBeTruthy();

    // Click Tech Modules tab
    const techTab = screen.getByRole("button", { name: /Technology Modules/i });
    fireEvent.click(techTab);
    expect(screen.getByText(/FULL PRODUCTION DEPENDENCY MATRIX/i)).toBeTruthy();
    expect(screen.getByText("MongoDB")).toBeTruthy();
  });

  it("renders consultation CTA linking to /start-project", () => {
    render(
      <ProjectDossierView
        project={mockProject}
        status="PRODUCTION"
        codename="OP-SHOE-BANK"
        year="2026"
        sections={mockProject.caseStudy || []}
        relatedProjects={[]}
      />
    );

    const ctaLink = screen.getByRole("link", { name: /Initiate Architecture Scope/i });
    expect(ctaLink.getAttribute("href")).toBe("/start-project?service=enterprise-systems&project=shoe-bank");
  });
});
