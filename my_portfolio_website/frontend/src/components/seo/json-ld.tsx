import React from "react";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import { getSiteUrl } from "@/lib/site-url";

interface JsonLdProps {
  type?: "website" | "article" | "project";
  data?: Record<string, any>;
}

export function JsonLd({ type = "website", data }: JsonLdProps) {
  const siteUrl = getSiteUrl();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSONAL_IDENTITY.name,
    jobTitle: PERSONAL_IDENTITY.title,
    description: PERSONAL_IDENTITY.bio,
    url: siteUrl,
    email: `mailto:${PERSONAL_IDENTITY.email}`,
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University of Ruhuna",
      department: "Faculty of Technology",
    },
    knowsAbout: [
      "Full-Stack Web Development",
      "Software Architecture",
      "Next.js",
      "React",
      "TypeScript",
      "NestJS",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "Docker",
      "Distributed Systems",
    ],
    sameAs: [
      "https://github.com/HajithMohamed",
      PERSONAL_IDENTITY.linkedInUrl,
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "HZ Labs Studio",
    url: siteUrl,
    description: "Enterprise full-stack systems engineering, software consulting, and web architecture.",
    founder: {
      "@type": "Person",
      name: PERSONAL_IDENTITY.name,
    },
    areaServed: "Worldwide",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${PERSONAL_IDENTITY.name} | HZ Labs Studio`,
    url: siteUrl,
    description: "Enterprise software engineering portfolio, case study dossiers, and technical notes by Mohamed Hajith.",
  };

  const schemas: Array<Record<string, any>> = [personSchema, organizationSchema, websiteSchema];
  if (data) {
    schemas.push(data);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemas),
      }}
    />
  );
}
