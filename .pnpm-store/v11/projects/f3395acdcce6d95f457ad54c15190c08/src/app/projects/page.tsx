import { Terminal } from "lucide-react";
import { CommandFooter } from "@/components/shell/command-footer";
import { TopBar } from "@/components/shell/top-bar";
import { Panel } from "@/components/hud/panel";
import { ProjectCard } from "@/components/projects/project-card";
import { getHomeData } from "@/lib/public-data";

export const metadata = {
  title: "Projects",
  description: "Public GitHub repositories and project case studies by Mohamed Hajith.",
};

export default async function ProjectsPage() {
  const { projects, profile } = await getHomeData();

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-14">
        <div className="container-responsive section-gap">
          <header className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan"><span className="h-px w-12 bg-cyan/60" /> Projects</div>
              <h1 className="mt-3 font-display text-display font-bold text-foreground">All systems</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">A collection of public projects built with modern technologies. Open a project to explore its architecture, evidence, links, and complete technical story.</p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/[0.04] px-4 py-2 font-mono text-xs text-cyan"><Terminal size={13} /> {projects.length} projects</div>
          </header>

          <Panel label="project.grid" subtitle="public repositories" bodyClassName="p-0">
            <div className="grid gap-5 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6">
              {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
            </div>
          </Panel>
        </div>
      </main>
      <CommandFooter profile={profile} />
    </div>
  );
}
