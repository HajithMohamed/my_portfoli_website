import Link from "next/link";
import { notFound } from "next/navigation";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { Panel } from "@/components/hud/panel";
import { getHomeData, getProject } from "@/lib/api";
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
    title: project ? `${project.title} — Dossier` : "Dossier not found",
    description: project?.description ?? "Hz Labs project dossier.",
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, { profile }] = await Promise.all([getProject(slug), getHomeData()]);

  if (!project) {
    notFound();
  }

  const status = projectHudStatus(project, false);
  const sections = project.caseStudy?.length ? project.caseStudy : [];
  const metrics = [
    { label: "year", value: projectYear(project) },
    { label: "stack", value: `${project.techStack.length} techs` },
    { label: "class", value: project.category },
  ];

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-14">
        <div className="container-responsive section-gap space-y-6 max-w-[1200px]">
          <Link href="/projects" className="font-mono text-xs text-cyan hover:underline">
            ← back to reactor.grid
          </Link>

          <header className="hud-panel corner-brackets p-8">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em]">
              <span className="text-cyan">DOSSIER / {projectCodename(project)}</span>
              <span className={`border px-2 py-0.5 ${HUD_STATUS_STYLE[status]}`}>{status}</span>
            </div>
            <h1 className="mt-4 font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-glow">
              {project.title}
            </h1>
            <div className="mt-2 font-mono text-sm text-muted-foreground">
              {project.category} · {projectYear(project)}
            </div>
            <p className="mt-6 max-w-3xl text-lg text-foreground/90">{project.description}</p>

            {project.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.coverImage}
                alt={project.title}
                className="mt-6 max-h-96 w-full border border-cyan/20 object-cover"
              />
            ) : null}

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {metrics.map((m) => (
                <div key={m.label} className="border border-cyan/20 bg-surface/40 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">
                    {m.label}
                  </div>
                  <div className="mt-1 font-display text-2xl font-semibold text-foreground text-glow">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.2em]">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-track="github_click"
                  className="flex items-center justify-center border border-cyan/50 bg-cyan/10 px-5 py-3 text-cyan transition-all hover:bg-cyan/20 touch-target-lg w-full sm:w-auto"
                >
                  {"> source code"}
                </a>
              ) : null}
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center border border-cyan/30 bg-surface/60 px-5 py-3 text-foreground transition-colors hover:border-cyan/60 hover:text-cyan touch-target-lg w-full sm:w-auto"
                >
                  {"> live system →"}
                </a>
              ) : null}
            </div>
          </header>

          {sections.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {sections.map((section, index) => (
                <Panel
                  key={`${section.heading}-${index}`}
                  label={`0${index + 1}.${section.heading.toLowerCase().replace(/\s+/g, ".")}`}
                  subtitle="case study"
                  className={index === sections.length - 1 && sections.length % 2 === 1 ? "lg:col-span-2" : undefined}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                    {section.body}
                  </p>
                </Panel>
              ))}
            </div>
          ) : null}

          {project.outcome ? (
            <Panel label="outcome" subtitle="signal delivered">
              <p className="text-base leading-relaxed text-foreground text-glow">
                {project.outcome}
              </p>
            </Panel>
          ) : null}

          <Panel label="stack" subtitle="deployed technology">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((s) => (
                <span
                  key={s}
                  className="border border-cyan/25 bg-cyan/5 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cyan"
                >
                  {s}
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </main>
      <CommandFooter profile={profile} />
    </div>
  );
}
