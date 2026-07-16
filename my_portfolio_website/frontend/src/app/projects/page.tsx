import Link from "next/link";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { Panel } from "@/components/hud/panel";
import { getHomeData } from "@/lib/api";
import {
  HUD_STATUS_STYLE,
  projectCodename,
  projectHudStatus,
} from "@/lib/project-presentation";

export const metadata = {
  title: "Systems",
  description:
    "Shipped and in-flight software projects by Mohamed Hajith — commerce platforms, booking systems, authentication infrastructure.",
};

export default async function ProjectsPage() {
  const { projects, profile } = await getHomeData();

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-14">
        <div className="mx-auto max-w-[1400px] px-4 py-12">
          <header className="mb-8 flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
                /systems
              </div>
              <h1 className="mt-2 font-display text-4xl font-bold text-foreground md:text-5xl">
                All systems
              </h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Every shipped project, in-flight system, and archived module — managed from the
                CMS.
              </p>
            </div>
            <div className="hidden font-mono text-xs text-muted-foreground md:block">
              {projects.length} entries
            </div>
          </header>

          <Panel label="reactor.grid" subtitle="all missions" bodyClassName="p-0">
            <div className="grid gap-px bg-cyan/10 md:grid-cols-2">
              {projects.map((p, i) => {
                const status = projectHudStatus(p, i === 0);
                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="group bg-background p-6 transition-colors hover:bg-surface"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                      <span className="text-cyan">
                        {String(i + 1).padStart(2, "0")} / {projectCodename(p, i)}
                      </span>
                      <span className={`border px-2 py-0.5 ${HUD_STATUS_STYLE[status]}`}>
                        {status}
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-semibold text-foreground group-hover:text-cyan">
                      {p.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.techStack.map((s) => (
                        <span
                          key={s}
                          className="border border-cyan/20 bg-cyan/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan/90"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 font-mono text-[11px] text-cyan/80">
                      {"> open dossier →"}
                    </div>
                  </Link>
                );
              })}
            </div>
          </Panel>
        </div>
      </main>
      <CommandFooter profile={profile} />
    </div>
  );
}
