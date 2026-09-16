import Link from "next/link";
import { Panel } from "@/components/hud/panel";
import type { Project } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/project-card";

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <Panel
      label="projects.showcase"
      subtitle={`${projects.length} systems`}
      actions={
        <Link
          href="/projects"
          className="group flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-cyan hover:text-cyan-glow transition-colors"
        >
          view all <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </Link>
      }
      bodyClassName="p-0"
    >
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:p-6">
        {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
      </div>
    </Panel>
  );
}
