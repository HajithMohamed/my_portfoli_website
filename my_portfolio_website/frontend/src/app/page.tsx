import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { StudioHero } from "@/components/sections/studio-hero";
import { BioSection } from "@/components/sections/bio-section";
import { TechnologyShowcase } from "@/components/sections/technology-showcase";
import { GithubTelemetrySection } from "@/components/sections/github-telemetry-section";
import { SystemStatus } from "@/components/command/system-status";
import { GithubTelemetry } from "@/components/command/github-telemetry";
import { StudioProjectsShowcase } from "@/components/sections/studio-projects-showcase";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { IntelDossier } from "@/components/command/intel-dossier";
import { Comms } from "@/components/command/comms";
import { RecruiterModeClient } from "@/components/sections/recruiter-mode-client";
import { getHomeData } from "@/lib/public-data";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import type { GithubSummary, Project } from "@/lib/types";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center w-full py-10">
      <div className="flex items-center gap-4 w-full max-w-sm mx-auto opacity-60">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-violet-500/40" />
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-slate-400">{label}</span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-cyan-500/40" />
      </div>
    </div>
  );
}

function titleFromRepoName(name: string) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function projectFromCurrentRepo(github: GithubSummary): Project | null {
  const repo = github.currentRepo ?? github.contributionData?.currentRepo ?? null;
  if (!repo) {
    return null;
  }

  return {
    id: repo.fullName,
    title: titleFromRepoName(repo.name),
    slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    description: repo.description ?? "Most recently pushed public repository on GitHub.",
    techStack: repo.languages?.length ? repo.languages : [repo.language ?? "MERN Stack"].filter(Boolean),
    githubUrl: repo.url,
    liveUrl: repo.homepage,
    category: "GitHub repository",
    status: repo.isArchived ? "ARCHIVED" : "ACTIVE",
    featured: true,
    updatedAt: repo.pushedAt ?? repo.updatedAt ?? undefined,
  };
}

export default async function Home() {
  const { profile, skills, projects, resume, github, testimonials, certificates } =
    await getHomeData();

  const currentRepoUrl = (github.currentRepo ?? github.contributionData?.currentRepo)?.url;
  const latestRepository =
    projects.find((p) => currentRepoUrl && p.githubUrl?.toLowerCase() === currentRepoUrl.toLowerCase()) ??
    projectFromCurrentRepo(github) ??
    projects.find((p) => p.featured) ??
    (projects.length ? projects[0] : null);
  // The Projects admin page controls this selection through its Featured flag.
  // If nothing is featured yet, retain a sensible public fallback.
  const homepageProjects = (projects.filter((project) => project.featured).length
    ? projects.filter((project) => project.featured)
    : projects
  ).slice(0, 3);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Beach Road Palamunai-11",
      addressLocality: "Arayampathy",
      addressRegion: "Batticaloa",
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
        <StudioHero />
        <BioSection />

        <GithubTelemetrySection github={github} />

        <div className="container-responsive section-gap space-y-12 md:space-y-16 lg:space-y-24">
          
          {/* Services Catalog — What I Build */}
          <ServicesShowcase />

          <SectionDivider label="sys.portfolio" />

          {/* Selected Work — Featured Projects */}
          <div id="projects" className="scroll-mt-24">
            <StudioProjectsShowcase projects={projects} />
          </div>

          <SectionDivider label="sys.skills" />

          {/* Tools across my work — Technology Showcase */}
          <div id="skills" className="scroll-mt-24">
            <TechnologyShowcase />
          </div>

          <SectionDivider label="sys.intelligence" />

          {/* Credentials & testimonials */}
          <div className="space-y-6">
            <IntelDossier testimonials={testimonials} certificates={certificates} />
          </div>

          <SectionDivider label="sys.communication" />

          {/* Contact */}
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
