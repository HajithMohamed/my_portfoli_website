import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "./json-ld";

describe("JsonLd Component", () => {
  it("renders structured JSON-LD schema with Person, ProfessionalService, and WebSite", () => {
    const { container } = render(<JsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();

    const parsed = JSON.parse(script?.innerHTML || "[]");
    expect(Array.isArray(parsed)).toBe(true);

    const person = parsed.find((item: any) => item["@type"] === "Person");
    expect(person).toBeDefined();
    expect(person.name).toBe("Mohamed Hajith");
    expect(person.alumniOf.name).toBe("University of Ruhuna");

    const org = parsed.find((item: any) => item["@type"] === "ProfessionalService");
    expect(org).toBeDefined();
    expect(org.name).toBe("HZ Labs Studio");

    const website = parsed.find((item: any) => item["@type"] === "WebSite");
    expect(website).toBeDefined();
  });

  it("appends custom schema data when provided", () => {
    const customData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Shoe Bank Footwear BMS",
    };
    const { container } = render(<JsonLd data={customData} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const parsed = JSON.parse(script?.innerHTML || "[]");

    const app = parsed.find((item: any) => item["@type"] === "SoftwareApplication");
    expect(app).toBeDefined();
    expect(app.name).toBe("Shoe Bank Footwear BMS");
  });
});
