import { ExternalLink, GitCommit, Github, Globe2 } from "lucide-react";
import { Panel } from "@/components/hud/panel";
import { projectCodename, projectYear } from "@/lib/project-presentation";
import type { Project } from "@/lib/types";

function displayDate(value?: string) {
  if (!value || Number.isNaN(Date.parse(value))) return "Date not supplied by GitHub";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

/**
 * Shows GitHub's latest public repository activity. It deliberately does not
 * claim that a build, release, or deployment is happening.
 */
export function NowDeploying({ project }: { project: Project | null }) {
  if (!project) {
    return (
      <Panel label="github.activity" subtitle="sync unavailable" className="h-full">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Public repository activity could not be loaded right now. Visit Mohamed Hajith&apos;s GitHub profile for the live record.
        </p>
      </Panel>
    );
  }

  const evidence = project.readinessEvidence ?? [];

  return (
    <Panel label="github.activity" subtitle={project.repositoryFullName ?? projectCodename(project)} live className="h-full">
      <div className="flex h-full flex-col">
        <div className="mb-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">
            <GitCommit size={12} className="text-cyan" />
            most recently pushed public repository
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground">{project.title}</h2>
          <div className="mt-1 font-mono text-xs text-muted-foreground">
            Last pushed: <span className="text-cyan/90">{displayDate(project.updatedAt)}</span>
            <span className="mx-2 text-cyan/30">/</span>
            {projectYear(project)}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.isHosted ? (
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-signal-green/30 bg-signal-green/10 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-signal-green">
              <Globe2 size={11} /> public website listed
            </span>
          ) : null}
          {evidence.map((item) => (
            <a
              key={`${item.kind}-${item.url}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-sm border border-cyan/30 bg-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-cyan hover:bg-cyan/20"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <div className="flex flex-wrap gap-2">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                data-track="github_click"
                className="inline-flex items-center gap-2 border border-cyan/40 bg-cyan/10 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-cyan hover:bg-cyan/20"
              >
                <Github size={13} /> repository <ExternalLink size={12} />
              </a>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-cyan/20 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground hover:border-cyan/50 hover:text-cyan"
              >
                <Globe2 size={13} /> listed site <ExternalLink size={12} />
              </a>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 5).map((technology) => (
              <span key={technology} className="border border-cyan/15 bg-surface/40 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-cyan/80">
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
