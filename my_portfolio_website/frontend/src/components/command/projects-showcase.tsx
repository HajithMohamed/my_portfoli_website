import Link from "next/link";
import Image from "next/image";
import { Panel } from "@/components/hud/panel";
import type { Project } from "@/lib/types";
import {
  HUD_STATUS_STYLE,
  projectBriefing,
  projectCodename,
  projectHudStatus,
  projectYear,
} from "@/lib/project-presentation";
import { ArrowRight, Box, Calendar, Layers, Terminal } from "lucide-react";
import { lookupTech, techIconUrl } from "@/lib/tech-registry";
import { cn } from "@/lib/utils";

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
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
        {projects.map((p, i) => {
          const status = projectHudStatus(p, i === 0);
          const briefing = projectBriefing(p);
          
          return (
            <article
              key={p.slug}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-cyan/15 bg-surface-2/30 backdrop-blur-sm transition-all duration-500 hover:border-cyan/40 hover:bg-surface-2/60 hover:shadow-[0_0_30px_rgba(92,208,255,0.05)]"
            >
              {/* Cover Image Area */}
              <div className="relative h-40 w-full overflow-hidden border-b border-cyan/10 bg-black/40">
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
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan backdrop-blur-md bg-black/20 px-2 py-1 rounded">
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

                <div className="mt-6 pt-4 border-t border-cyan/10">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex w-full items-center justify-between gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-cyan"
                  >
                    <span>{"> access_dossier"}</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
