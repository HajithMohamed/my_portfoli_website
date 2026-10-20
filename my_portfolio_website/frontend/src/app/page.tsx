import { ArrowRight, BriefcaseBusiness } from "lucide-react";
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

          <SectionDivider label="sys.intake" />

          {/* Request a Project Showcase Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-950/30 via-indigo-950/20 to-purple-950/20 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-cyan/40">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 font-mono text-xs uppercase tracking-widest text-cyan">
                  <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                  <span>SYS.INTAKE // CLIENT PROJECTS &amp; WEB SYSTEMS</span>
                </div>
                <h3 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                  Have a Project in Mind? Let&apos;s Build It.
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
                  Looking for a full-stack engineer to build a production web application, MVP, or API? Submit your project goals, scope, and timeline for an architectural review and estimation.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 font-mono text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    24h Turnaround
                  </span>
                  <span>·</span>
                  <span className="text-slate-300">Milestone-Driven</span>
                  <span>·</span>
                  <span className="text-slate-300">Production-Ready Code</span>
                </div>
              </div>
              <a
                href="/start-project"
                data-track="home_project_request_cta"
                className="group inline-flex items-center justify-center gap-2.5 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 px-8 py-4 font-display text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] w-full sm:w-auto"
              >
                <BriefcaseBusiness size={18} />
                <span>Request a Project</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
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
