import Image from "next/image";
import Link from "next/link";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { Panel } from "@/components/hud/panel";
import { getHomeData } from "@/lib/api";
import {
  HUD_STATUS_STYLE,
  projectBriefing,
  projectCodename,
  projectHudStatus,
} from "@/lib/project-presentation";
import { ArrowRight, Terminal } from "lucide-react";
import { lookupTech, techIconUrl } from "@/lib/tech-registry";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Systems",
  description:
    "Shipped and in-flight software projects by Mohamed Hajith — commerce platforms, booking systems, authentication infrastructure.",
};

function LabelRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex gap-3 items-baseline">
      <div className="w-16 shrink-0 text-[9px] uppercase tracking-[0.25em] text-cyan/60 flex items-center gap-1">
        <span className="text-[8px]">▸</span> {label}
      </div>
      <div className={cn("text-[11px] leading-relaxed", accent ? "text-foreground font-medium" : "text-muted-foreground")}>{value}</div>
    </div>
  );
}

export default async function ProjectsPage() {
  const { projects, profile } = await getHomeData();

  return (
    <div className="relative min-h-screen">
      <TopBar location={profile.location} />
      <main className="relative z-10 pt-14">
        <div className="container-responsive section-gap">
          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan flex items-center gap-2">
                <span className="h-[1px] w-4 bg-cyan/50" />
                /systems
              </div>
              <h1 className="mt-4 font-display text-display font-bold text-foreground group flex items-center gap-3">
                All systems
                <span className="inline-block h-2 w-2 rounded-full bg-cyan/80 animate-pulse-dot" />
              </h1>
              <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed border-l-2 border-cyan/30 pl-4 py-1">
                Every shipped project, in-flight system, and archived module — managed from the
                CMS.
              </p>
            </div>
            <div className="hidden font-mono text-xs text-muted-foreground md:flex items-center gap-2 border border-cyan/10 bg-black/20 px-3 py-1.5 rounded-sm">
              <Terminal size={14} className="text-cyan/60" />
              {projects.length} entries
            </div>
          </header>

          <Panel label="reactor.grid" subtitle="all missions" bodyClassName="p-0">
            <div className="grid gap-px bg-cyan/10 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => {
                const status = projectHudStatus(p, i === 0);
                const briefing = projectBriefing(p);
                
                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="group relative flex flex-col overflow-hidden bg-surface-2/30 backdrop-blur-sm transition-all duration-500 hover:bg-surface-2/60 hover:shadow-[0_0_30px_rgba(92,208,255,0.05)] hover:z-10 outline outline-1 outline-transparent hover:outline-cyan/40"
                  >
                    {/* Cover Image Area */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-cyan/10 bg-black/40">
                      {p.coverImage ? (
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-grid opacity-20" />
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-2/90 via-surface-2/30 to-transparent" />
                      
                      {/* Header info layered over image */}
                      <div className="absolute left-0 top-0 flex w-full items-center justify-between p-4">
                        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan backdrop-blur-md bg-black/20 px-2 py-1 rounded border border-cyan/10">
                          {String(i + 1).padStart(2, "0")} / {projectCodename(p, i)}
                        </div>
                        <div className={cn("border px-2 py-1 text-[9px] uppercase tracking-widest rounded-sm backdrop-blur-md", HUD_STATUS_STYLE[status])}>
                          {status}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-cyan/70 uppercase tracking-widest mb-2">
                        <Terminal size={12} />
                        {p.category}
                      </div>
                      
                      <h3 className="font-display text-2xl font-bold text-foreground transition-colors group-hover:text-glow group-hover:text-cyan">
                        {p.title}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>

                      {(briefing.problem || briefing.approach || briefing.outcome) && (
                        <div className="mt-5 space-y-2.5 rounded-lg bg-black/20 p-3 font-mono text-[11px] border border-cyan/5">
                          {briefing.problem ? <LabelRow label="prob" value={briefing.problem} /> : null}
                          {briefing.approach ? <LabelRow label="arch" value={briefing.approach} /> : null}
                          {briefing.outcome ? <LabelRow label="out" value={briefing.outcome} accent /> : null}
                        </div>
                      )}

                      {/* Tech Stack */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {p.techStack.map((s) => {
                          const meta = lookupTech(s);
                          return (
                            <span
                              key={s}
                              className="flex items-center gap-1.5 rounded-full border border-cyan/15 bg-cyan/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan/80 transition-colors hover:bg-cyan/15"
                            >
                              {meta && (
                                <img src={techIconUrl(meta)} alt="" className="h-3 w-3 opacity-70" aria-hidden />
                              )}
                              {s}
                            </span>
                          );
                        })}
                      </div>

                      <div className="mt-6 pt-4 border-t border-cyan/10 flex-1 flex items-end">
                        <div className="inline-flex w-full items-center justify-between gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-cyan">
                          <span>{"> access_dossier"}</span>
                          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
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
