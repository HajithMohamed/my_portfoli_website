import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { CommandDeck } from "@/components/command/command-deck";
import { SystemStatus } from "@/components/command/system-status";
import { GithubTelemetry } from "@/components/command/github-telemetry";
import { NowDeploying } from "@/components/command/now-deploying";
import { ProjectsShowcase } from "@/components/command/projects-showcase";
import { ArchitectureMap } from "@/components/command/architecture-map";
import { SkillsConstellation } from "@/components/command/skills-constellation";
import { SignalLog } from "@/components/command/signal-log";
import { IntelDossier } from "@/components/command/intel-dossier";
import { Comms } from "@/components/command/comms";
import { RecruiterModeClient } from "@/components/sections/recruiter-mode-client";
import { getHomeData } from "@/lib/api";

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

export default async function Home() {
  const { profile, skills, projects, blogs, resume, github, testimonials, certificates } =
    await getHomeData();

  const inFlight =
    projects.find((p) => p.featured) ?? (projects.length ? projects[0] : null);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
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

        <div className="mx-auto max-w-[1400px] space-y-16 px-4 py-20">
          
          {/* Status Row */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
            <SystemStatus profile={profile} />
            <GithubTelemetry github={github} />
            <NowDeploying project={inFlight} />
          </div>

          <SectionDivider label="sys.portfolio" />

          {/* Projects */}
          <div id="projects" className="scroll-mt-24">
            <ProjectsShowcase projects={projects} />
          </div>

          <SectionDivider label="sys.infrastructure" />

          {/* Architecture & Skills */}
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-stretch">
            <ArchitectureMap />
            <SkillsConstellation skills={skills} />
          </div>

          <SectionDivider label="sys.intelligence" />

          {/* Blog & Intel */}
          <div className="space-y-6">
            <SignalLog posts={blogs} />
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
