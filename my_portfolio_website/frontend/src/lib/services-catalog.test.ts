import { describe, it, expect } from "vitest";
import {
  SERVICES_CATALOG,
  getAllServices,
  getServiceById,
  getRelatedProjectsForService,
  buildServiceInquiryUrl,
} from "./services-catalog";
import type { Project } from "./types";

describe("Services Catalog Module", () => {
  it("provides exactly 6 core engineering services", () => {
    const services = getAllServices();
    expect(services).toHaveLength(6);
    expect(SERVICES_CATALOG).toHaveLength(6);
  });

  it("verifies each service has valid metadata, deliverables, and tech stack", () => {
    const services = getAllServices();

    for (const service of services) {
      expect(service.id).toBeTruthy();
      expect(service.slug).toBeTruthy();
      expect(service.title).toBeTruthy();
      expect(service.shortTitle).toBeTruthy();
      expect(service.subtitle).toBeTruthy();
      expect(service.description).toBeTruthy();
      expect(service.deliverables.length).toBeGreaterThanOrEqual(4);
      expect(service.techStack.length).toBeGreaterThanOrEqual(4);
      expect(service.relatedProjectSlugs.length).toBeGreaterThanOrEqual(1);
      expect(service.wizardServiceId).toBeTruthy();
      expect(service.keyBenefit).toBeTruthy();
    }
  });

  it("retrieves a service by exact id", () => {
    const webSaas = getServiceById("web-saas");
    expect(webSaas).toBeDefined();
    expect(webSaas?.title).toBe("Web & SaaS platforms");
    expect(webSaas?.wizardServiceId).toBe("web-app");

    const ecommerce = getServiceById("ecommerce");
    expect(ecommerce).toBeDefined();
    expect(ecommerce?.title).toBe("E-commerce");
    expect(ecommerce?.wizardServiceId).toBe("online-store");
  });

  it("retrieves a service by slug", () => {
    const mobile = getServiceById("mobile-applications-flutter");
    expect(mobile).toBeDefined();
    expect(mobile?.id).toBe("mobile-apps");

    const ai = getServiceById("ai-workflow-automation");
    expect(ai).toBeDefined();
    expect(ai?.id).toBe("ai-automation");
  });

  it("returns undefined when query does not match any service", () => {
    const unknown = getServiceById("quantum-teleportation");
    expect(unknown).toBeUndefined();
  });

  it("builds the correct start-project inquiry URL with service query parameter", () => {
    const webSaas = getServiceById("web-saas")!;
    const url = buildServiceInquiryUrl(webSaas);
    expect(url).toBe("/start-project?service=web-saas");
  });

  it("filters and matches related projects for a service", () => {
    const mockProjects: Project[] = [
      {
        id: "p1",
        title: "Saga Elite Web Store",
        slug: "saga-elite",
        description: "E-commerce platform",
        techStack: ["Next.js", "React"],
        category: "E-Commerce",
        status: "ACTIVE",
        featured: true,
        githubUrl: "https://github.com/...",
        liveUrl: null,
      },
      {
        id: "p2",
        title: "Goyo Elite Voice Project",
        slug: "goyo-voice",
        description: "Voice assistant",
        techStack: ["Python", "PyTorch"],
        category: "AI",
        status: "ACTIVE",
        featured: true,
        githubUrl: "https://github.com/...",
        liveUrl: null,
      },
      {
        id: "p3",
        title: "Unrelated Project",
        slug: "unrelated-tool",
        description: "Some other tool",
        techStack: ["Rust"],
        category: "Utility",
        status: "ACTIVE",
        featured: false,
        githubUrl: "https://github.com/...",
        liveUrl: null,
      },
    ];

    const ecommerce = getServiceById("ecommerce")!;
    const relatedToEcommerce = getRelatedProjectsForService(ecommerce, mockProjects);
    expect(relatedToEcommerce.map((p) => p.slug)).toContain("saga-elite");
    expect(relatedToEcommerce.map((p) => p.slug)).not.toContain("unrelated-tool");

    const ai = getServiceById("ai-automation")!;
    const relatedToAi = getRelatedProjectsForService(ai, mockProjects);
    expect(relatedToAi.map((p) => p.slug)).toContain("goyo-voice");
    expect(relatedToAi.map((p) => p.slug)).not.toContain("saga-elite");
  });
});
