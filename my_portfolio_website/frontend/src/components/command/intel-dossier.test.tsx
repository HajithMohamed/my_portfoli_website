import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { IntelDossier } from "./intel-dossier";
import type { Certificate, Testimonial } from "@/lib/types";

const mockTestimonials: Testimonial[] = [
  {
    id: "test-1",
    author: "Elena Rostova",
    role: "VP of Engineering",
    company: "Apex Ledger",
    quote: "Hajith engineered our core data synchronization pipeline with zero downtime.",
    rating: 5,
  },
];

const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    title: "Full-Stack Web Development Bootcamp",
    issuer: "Tech Academy Global",
    issueDate: "2024-05-15",
    instructor: "Dr. Angela Yu",
    durationHours: 65,
    credentialUrl: "https://example.com/cert/1",
    description: "Intensive 65-hour full-stack engineering curriculum covering React, Node.js, and databases.",
  },
];

describe("IntelDossier Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders verified credentials and recommendation signals", () => {
    render(
      <IntelDossier
        testimonials={mockTestimonials}
        certificates={mockCertificates}
      />
    );

    expect(screen.getByText(/INTEL\.DOSSIER \/\/ THIRD-PARTY SIGNALS/i)).toBeDefined();
    expect(screen.getByText(/Verified Credentials & Recommendations/i)).toBeDefined();
    expect(screen.getByText(/Elena Rostova/i)).toBeDefined();
    expect(screen.getByText(/Apex Ledger/i)).toBeDefined();
    expect(screen.getByText(/Full-Stack Web Development Bootcamp/i)).toBeDefined();
    expect(screen.getByText(/Tech Academy Global/i)).toBeDefined();
    expect(screen.getByText(/All Certificates Archive/i)).toBeDefined();
  });

  it("returns null when both testimonials and certificates are empty", () => {
    const { container } = render(
      <IntelDossier testimonials={[]} certificates={[]} />
    );

    expect(container.firstChild).toBeNull();
  });
});
