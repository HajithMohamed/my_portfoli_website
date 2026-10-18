import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Sparkles, Terminal, Code2, Globe2 } from "lucide-react";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { getHomeData, getProject } from "@/lib/public-data";
import {
  HUD_STATUS_STYLE,
  projectCodename,
  projectHudStatus,
  projectYear,
} from "@/lib/project-presentation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  return {
    title: project ? `${project.title} — Technical Dossier | HZ Labs` : "Project Not Found | HZ Labs",
    description: project?.description ?? "Technical architecture dossier by Mohamed Hajith.",
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, { profile, projects }] = await Promise.all([getProject(slug), getHomeData()]);

  if (!project) {
    notFound();
  }

  const status = projectHudStatus(project, false);
  const sections = project.caseStudy?.length ? project.caseStudy : [];
  const metrics = [
    { label: "Year", value: projectYear(project) },
    { label: "Architecture", value: `${project.techStack.length} Technologies` },
    { label: "Classification", value: project.category ?? "System Engineering" },
  ];

  // Suggest other projects excluding current
  const relatedProjects = projects
    .filter((p) => p.slug !== project.slug)
    .slice(0, 2);

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-16 pb-24">
        <div className="container-responsive section-gap space-y-8 max-w-[1100px]">
          {/* Breadcrumb Navigation */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-cyan transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Projects Archive</span>
          </Link>

          {/* Project Header Studio Card */}
          <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/90 p-6 sm:p-10 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                <span>DOSSIER // {projectCodename(project)}</span>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {status}
              </span>
            </div>

            <h1 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>

            <div className="mt-2 font-mono text-xs text-muted-foreground">
              {project.category} · {projectYear(project)}
            </div>

            <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-foreground/90">
              {project.description}
            </p>

            {project.coverImage ? (
              <figure className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                <div className="relative aspect-[16/8] w-full">
                  <Image
                    src={project.coverImage}
                    alt={project.coverImageAlt ?? project.title}
                    fill
                    sizes="(max-width: 1100px) 100vw, 1100px"
                    className="object-cover"
                  />
                </div>
                {project.coverImageKind === "concept" ? (
                  <figcaption className="p-3 border-t border-white/[0.06] font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground text-center">
                    Concept illustration generated from repository architecture and README specification.
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {/* Metrics Strip */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
                    {m.label}
                  </div>
                  <div className="mt-1 font-display text-xl font-bold text-foreground">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Actions Strip */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-track="github_click"
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-cyan hover:bg-cyan/20 transition-all"
                >
                  <Github size={14} />
                  <span>View Repository</span>
                  <ExternalLink size={12} />
                </a>
              ) : null}

              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20 transition-all"
                >
                  <Globe2 size={14} />
                  <span>Open Live Platform</span>
                  <ExternalLink size={12} />
                </a>
              ) : null}

              {project.sourceUrl && project.sourceUrl !== project.githubUrl ? (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
                >
                  <span>README Specification</span>
                  <ExternalLink size={12} />
                </a>
              ) : null}
            </div>
          </header>

          {/* Case Study Sections */}
          {sections.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {sections.map((section, index) => (
                <div
                  key={`${section.heading}-${index}`}
                  className={`rounded-2xl border border-white/[0.08] bg-surface/80 p-6 backdrop-blur-xl ${
                    index === sections.length - 1 && sections.length % 2 === 1 ? "md:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                    <span>{`0${index + 1} // ${section.heading}`}</span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-bold text-foreground">
                    {section.heading}
                  </h3>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {/* Outcome / Impact Signal */}
          {project.outcome ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.03] p-6 backdrop-blur-md">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400">
                <Sparkles size={12} />
                <span>OUTCOME &amp; DELIVERABLE IMPACT</span>
              </div>
              <p className="mt-2 text-base leading-relaxed text-foreground">
                {project.outcome}
              </p>
            </div>
          ) : null}

          {/* Full Technology Stack */}
          <div className="rounded-2xl border border-white/[0.08] bg-surface/80 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
              <Code2 size={13} />
              <span>TECHNOLOGY SPECIFICATION</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-cyan/20 bg-cyan/[0.05] px-3 py-1 font-mono text-xs uppercase tracking-wider text-cyan"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Related Projects Footer */}
          {relatedProjects.length > 0 && (
            <div className="pt-8 space-y-4 border-t border-white/[0.08]">
              <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                More Projects From The Archive
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedProjects.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="group flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-cyan/40 hover:bg-white/[0.04]"
                  >
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-cyan">
                        {p.category ?? "Case Study"}
                      </div>
                      <h4 className="mt-1 font-display text-lg font-bold text-foreground group-hover:text-cyan transition-colors">
                        {p.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 font-mono text-xs text-cyan">
                      <span>Read Dossier</span>
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <CommandFooter profile={profile} />
    </div>
  );
}
