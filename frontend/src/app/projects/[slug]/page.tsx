import { notFound } from "next/navigation";
import { ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProject } from "@/lib/api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  return {
    title: project?.title ?? "Project",
    description: project?.description ?? "HZ Labs project case study.",
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 text-slate-50 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <ButtonLink href="/projects" variant="ghost">
          Projects
        </ButtonLink>
        <header className="mt-12">
          <Badge>{project.category}</Badge>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold tracking-normal">{project.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">{project.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {project.githubUrl ? (
              <ButtonLink href={project.githubUrl}>
                <Github className="h-4 w-4" />
                GitHub
              </ButtonLink>
            ) : null}
            {project.liveUrl ? (
              <ButtonLink href={project.liveUrl} variant="secondary">
                Live
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            ) : null}
          </div>
        </header>

        <section className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {project.techStack.map((tech) => (
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200" key={tech}>
              {tech}
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-5">
          {(project.caseStudy?.length
            ? project.caseStudy
            : [
                { heading: "Problem", body: "The system needed a focused product workflow and durable implementation foundation." },
                { heading: "Solution", body: "HZ Labs designed a modular frontend, API, database, and admin flow around maintainable product primitives." },
                { heading: "Architecture", body: "Next.js -> NestJS API -> PostgreSQL -> JWT Authentication" },
                { heading: "Outcome", body: project.outcome ?? "A reusable product foundation ready for iteration." },
              ]
          ).map((section) => (
            <Card key={section.heading}>
              <h2 className="font-display text-2xl font-semibold">{section.heading}</h2>
              <p className="mt-3 leading-7 text-slate-400">{section.body}</p>
            </Card>
          ))}
        </section>
      </article>
    </main>
  );
}
