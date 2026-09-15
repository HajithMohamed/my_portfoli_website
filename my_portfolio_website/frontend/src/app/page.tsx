import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { CommandDeck } from "@/components/command/command-deck";
import { SystemStatus } from "@/components/command/system-status";
import { GithubTelemetry } from "@/components/command/github-telemetry";
import { NowDeploying } from "@/components/command/now-deploying";
import { ProjectsShowcase } from "@/components/command/projects-showcase";
import { ArchitectureMap } from "@/components/command/architecture-map";
import { SkillsConstellation } from "@/components/command/skills-constellation";
import { IntelDossier } from "@/components/command/intel-dossier";
import { Comms } from "@/components/command/comms";
import { RecruiterModeClient } from "@/components/sections/recruiter-mode-client";
import { getHomeData } from "@/lib/public-data";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import type { GithubSummary, Project } from "@/lib/types";

/** Only these projects appear on the homepage — the full list lives at /projects. */
const HOMEPAGE_SLUGS = new Set([
  "saga-elite",
  "tech-bridge",
  "shoe-bank",                          // Shoe Bank (CMS slug from SHOE_BANK_MERNSTACK)
  "footwear-business-management-system", // Shoe Bank (story repo slug)
  "nextgen-mobile-shop",                // NEXTGEN Mobile Shop
  "library-management-system",          // University Library Management System
]);

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center w-full py-12">
      <div className="flex items-center gap-4 w-full max-w-sm mx-auto opacity-50">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-cyan" />
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-cyan">{label}</span>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-cyan" />
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
        <CommandDeck profile={profile} github={github} resume={resume} />

        <div className="container-responsive section-gap space-y-12 md:space-y-16 lg:space-y-24">
          
          {/* Status Row */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            <SystemStatus profile={profile} />
            <GithubTelemetry github={github} />
            <NowDeploying project={latestRepository} />
          </div>

          <SectionDivider label="sys.portfolio" />

          {/* Projects — curated highlights only; full list at /projects */}
          <div id="projects" className="scroll-mt-24">
            <ProjectsShowcase projects={projects.filter((p) => HOMEPAGE_SLUGS.has(p.slug))} />
          </div>

          <SectionDivider label="sys.infrastructure" />

          {/* Architecture & Skills */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-stretch">
            <ArchitectureMap />
            <SkillsConstellation skills={skills} />
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
