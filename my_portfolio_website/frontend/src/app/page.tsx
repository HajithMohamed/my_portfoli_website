import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { StudioHero } from "@/components/sections/studio-hero";
import { BioSection } from "@/components/sections/bio-section";
import { TechnologyShowcase } from "@/components/sections/technology-showcase";
import { GithubTelemetrySection } from "@/components/sections/github-telemetry-section";

import { StudioProjectsShowcase } from "@/components/sections/studio-projects-showcase";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { IntelDossier } from "@/components/command/intel-dossier";
import { Comms } from "@/components/command/comms";
import { RecruiterModeClient } from "@/components/sections/recruiter-mode-client";
import { getHomeData } from "@/lib/public-data";
import { PERSONAL_IDENTITY } from "@/lib/identity";
export default async function Home() {
  const {
    profile,
    skills,
    projects,
    resume,
    github,
    testimonials,
    certificates,
  } = await getHomeData();

  // Public homepage placement and order come from the project CMS.
  const homepageProjects = projects
    .filter(
      (project) =>
        project.status === "ACTIVE" &&
        (project.showOnHomepage ?? project.featured),
    )
    .sort((a, b) => (a.homepageOrder ?? 0) - (b.homepageOrder ?? 0));

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    address: {
      "@type": "PostalAddress",
      addressCountry: "LK",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: PERSONAL_IDENTITY.university,
      department: PERSONAL_IDENTITY.faculty,
    },
    image: profile.profileImageUrl ?? undefined,
    sameAs: profile.socialLinks?.map((link) => link.url).filter(Boolean),
    knowsAbout: skills.map((skill) => skill.name),
  };

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <TopBar location={profile.location} />

      <main className="relative z-10">
        {/* 01 // INTRODUCTION */}
        <StudioHero />

        <div className="container-responsive pt-6 md:pt-10 lg:pt-12 pb-24 space-y-16 md:space-y-20 lg:space-y-24">
          {/* 02 // FEATURED ENGINEERING WORK */}
          <div id="projects" className="scroll-mt-24 pb-4 md:pb-6">
            <StudioProjectsShowcase projects={homepageProjects} />
          </div>

          {/* 03 // ABOUT & ENGINEERING APPROACH */}
          <div id="about" className="scroll-mt-24">
            <BioSection />
          </div>

          {/* 04 // TECHNICAL SKILLS */}
          <div id="skills" className="scroll-mt-24">
            <TechnologyShowcase />
          </div>

          {/* 05 // GITHUB ACTIVITY â€” Compact, Reliable Development Activity */}
          <div id="telemetry" className="scroll-mt-24">
            <GithubTelemetrySection github={github} />
          </div>

          {/* 06 // HZ LABS SERVICES â€” Separate Offerings for Clients */}
          <div id="services" className="scroll-mt-24">
            <ServicesShowcase />
          </div>

          {/* 07 // CREDENTIALS & TESTIMONIALS */}
          <div className="scroll-mt-24">
            <IntelDossier
              testimonials={testimonials}
              certificates={certificates}
            />
          </div>

          {/* 08 // CONTACT */}
          <div id="comms" className="scroll-mt-24">
            <Comms profile={profile} />
          </div>
        </div>
      </main>

      <CommandFooter profile={profile} />

      {/* Recruiter mode overlay */}
      <RecruiterModeClient
        profile={profile}
        skills={skills}
        projects={projects}
        github={github}
        resume={resume}
      />
    </div>
  );
}
