import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { CommandDeck } from "@/components/command/command-deck";
import { SystemStatus } from "@/components/command/system-status";
import { GithubTelemetry } from "@/components/command/github-telemetry";
import { NowDeploying } from "@/components/command/now-deploying";
import { ProjectsShowcase } from "@/components/command/projects-showcase";
import { SkillsConstellation } from "@/components/command/skills-constellation";
import { IntelDossier } from "@/components/command/intel-dossier";
import { Comms } from "@/components/command/comms";
import { RecruiterModeClient } from "@/components/sections/recruiter-mode-client";
import { getHomeData } from "@/lib/public-data";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import type { GithubSummary, Project } from "@/lib/types";

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
        <CommandDeck profile={profile} github={github} resume={resume} />

        <div className="container-responsive section-gap space-y-12 md:space-y-16 lg:space-y-24">
          
          {/* Status Row */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            <SystemStatus profile={profile} />
            <GithubTelemetry github={github} />
            <NowDeploying project={latestRepository} />
          </div>

          <SectionDivider label="sys.portfolio" />

          {/* Featured projects are curated in the Projects admin page; the full list lives at /projects. */}
          <div id="projects" className="scroll-mt-24">
            <ProjectsShowcase projects={homepageProjects} />
          </div>

          <SectionDivider label="sys.skills" />

          {/* Skills — Technologies I Work With */}
          <div id="skills" className="scroll-mt-24">
            <SkillsConstellation skills={skills} projects={projects} />
          </div>

          <SectionDivider label="sys.intelligence" />

          {/* Credentials & testimonials */}
          <div className="space-y-6">
            <IntelDossier testimonials={testimonials} certificates={certificates} />
          </div>

          <SectionDivider label="sys.intake" />

          {/* Request a Project Showcase Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-cyan/30 bg-surface/80 p-6 sm:p-8 backdrop-blur-xl transition-all hover:border-cyan/60 hover:shadow-[0_0_35px_rgba(6,182,212,0.15)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan/10 blur-3xl" />
            <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan animate-pulse" />
                  <span>sys.intake // client projects & web systems</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  Have a Project in Mind? Let&apos;s Build It.
                </h3>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                  Looking for a full-stack engineer to build a production web application, MVP, or API? Submit your project goals, scope, and timeline for an intake review.
                </p>
              </div>
              <a
                href="/start-project"
                data-track="home_project_request_cta"
                className="group flex items-center justify-center gap-2.5 shrink-0 rounded-lg border border-cyan/60 bg-cyan px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-soft hover:shadow-[0_0_20px_var(--cyan-glow)] w-full sm:w-auto"
              >
                <BriefcaseBusiness size={16} />
                <span>Request a Project</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
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
