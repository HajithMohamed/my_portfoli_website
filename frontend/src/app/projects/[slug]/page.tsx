import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
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

  const sections = project.caseStudy?.length
    ? project.caseStudy
    : [
        { heading: "Problem", body: "The system needed a focused product workflow and durable implementation foundation." },
        { heading: "Solution", body: "HZ Labs designed a modular frontend, API, database, and admin flow around maintainable product primitives." },
        { heading: "Architecture", body: "Next.js -> NestJS API -> PostgreSQL -> JWT Authentication" },
        { heading: "Outcome", body: project.outcome ?? "A reusable product foundation ready for iteration." },
      ];

  return (
    <main className="min-h-screen bg-[#050816] text-slate-50">
      <div className="engineering-grid border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <ButtonLink href="/projects" variant="ghost">
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </ButtonLink>

          {project.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImage}
              alt={project.title}
              className="mt-8 max-h-80 w-full rounded-lg border border-white/10 object-cover"
            />
          ) : null}

          <header className="mt-10">
            <Badge>{project.category}</Badge>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold tracking-normal sm:text-5xl">
              {project.title}
            </h1>
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
                  Live demo
                  <ArrowUpRight className="h-4 w-4" />
                </ButtonLink>
              ) : null}
            </div>
          </header>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div className="grid gap-5">
          {sections.map((section, index) => (
            <Reveal delay={index * 0.05} key={`${section.heading}-${index}`}>
              <Card>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500/15 font-mono text-sm text-blue-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-2xl font-semibold">{section.heading}</h2>
                </div>
                <p className="mt-4 whitespace-pre-line leading-7 text-slate-400">{section.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tech Stack</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-200"
                  key={tech}
                >
                  {tech}
                </span>
              ))}
            </div>
          </Card>

          {project.outcome ? (
            <Card>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Outcome</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{project.outcome}</p>
            </Card>
          ) : null}

          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Details</h3>
            <dl className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Category</dt>
                <dd className="text-slate-200">{project.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Status</dt>
                <dd className="text-slate-200">{project.status}</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </main>
  );
}
