import { Terminal } from "lucide-react";
import { CommandFooter } from "@/components/shell/command-footer";
import { TopBar } from "@/components/shell/top-bar";
import { ProjectsCatalogueView } from "@/components/projects/projects-catalogue-view";
import { getHomeData } from "@/lib/public-data";

export const metadata = {
  title: "Projects & Engineering Work",
  description:
    "Explore production web applications, open-source repositories, and technical case studies by Mohamed Hajith.",
};

export default async function ProjectsPage() {
  const { projects: publishedProjects, profile } = await getHomeData();
  const projects = publishedProjects.filter(
    (project) => project.showOnProjectsPage !== false,
  );

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-16 pb-24">
        <div className="container-responsive section-gap space-y-8">
          <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end border-b border-white/[0.08] pb-8">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                <span>ARCHIVE // ENGINEERING CATALOGUE</span>
              </div>
              <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                All projects &amp; systems
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Explore published applications, open-source work, and academic
                projects. Filter by stack or keyword to find screenshots, demos,
                and technical case studies.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/[0.06] px-4 py-2 font-mono text-xs text-cyan shrink-0">
              <Terminal size={13} />
              <span>{projects.length} Published Projects</span>
            </div>
          </header>

          <ProjectsCatalogueView projects={projects} />
        </div>
      </main>
      <CommandFooter profile={profile} />
    </div>
  );
}
