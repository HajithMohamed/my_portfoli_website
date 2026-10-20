import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/public-data", () => ({
  getHomeData: async () => ({
    profile: {
      name: "Mohamed Hajith",
      email: "ahammedlebbehajith@gmail.com",
      location: "Batticaloa, Sri Lanka",
    },
    certificates: [
      {
        id: "cert-1",
        title: "Full-Stack Web Development Bootcamp",
        issuer: "Udemy",
        instructor: "Dr. Angela Yu",
        durationHours: 65,
        issueDate: "2023-08-15T00:00:00.000Z",
        credentialUrl: "https://udemy.com/certificate/UC-12345",
        courseUrl: "https://udemy.com/course/web-dev",
      },
    ],
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/certificates",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

import CertificatesPage from "./page";

describe("CertificatesPage Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("renders the certificates header and verified item count", async () => {
    const Component = await CertificatesPage();
    render(Component);

    expect(screen.getAllByText(/Certificates/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Verified learning milestones/i)).toBeDefined();
  });

  it("renders certificate cards with title, issuer, and instructor", async () => {
    const Component = await CertificatesPage();
    render(Component);

    expect(screen.getByText("Full-Stack Web Development Bootcamp")).toBeDefined();
    expect(screen.getByText("Udemy")).toBeDefined();
    expect(screen.getByText("Dr. Angela Yu")).toBeDefined();
    expect(screen.getByText(/Verify certificate/i)).toBeDefined();
  });
});
