import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getHomeData } from "@/lib/api";

export const metadata = {
  title: "Projects",
  description: "CMS-managed HZ Labs projects and case studies.",
};

export default async function ProjectsPage() {
  const { projects } = await getHomeData();

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ButtonLink href="/" variant="ghost">
          HZ Labs
        </ButtonLink>
        <div className="mt-12 max-w-3xl">
          <Badge>Projects</Badge>
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-normal">Full-stack systems and product foundations</h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            Dynamic projects managed from the CMS, each ready for deeper problem, solution, architecture, and outcome storytelling.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Card className="flex flex-col" key={project.id}>
              <Badge className="w-fit">{project.category}</Badge>
              <h2 className="mt-5 text-2xl font-semibold">{project.title}</h2>
              <p className="mt-3 flex-1 leading-7 text-slate-400">{project.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300" key={tech}>
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={`/projects/${project.slug}`} variant="secondary">
                  Case study
                </ButtonLink>
                {project.githubUrl ? (
                  <ButtonLink href={project.githubUrl} variant="ghost">
                    Source
                    <ArrowUpRight className="h-4 w-4" />
                  </ButtonLink>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
