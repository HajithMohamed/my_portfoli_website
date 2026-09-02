import Link from "next/link";
import Image from "next/image";
import { Panel } from "@/components/hud/panel";
import type { Project } from "@/lib/types";
import {
  HUD_STATUS_STYLE,
  projectCodename,
  projectHudStatus,
} from "@/lib/project-presentation";
import { ArrowRight, Terminal } from "lucide-react";
import { lookupTech, techIconUrl } from "@/lib/tech-registry";
import { cn } from "@/lib/utils";

const MAX_CHIPS = 3;

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
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:p-6">
        {projects.map((p, i) => {
          const status = projectHudStatus(p, i === 0);
          const extraChips = p.techStack.length - MAX_CHIPS;

          return (
            <article
              key={p.slug}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-cyan/15 bg-surface-2/30 backdrop-blur-sm transition-all duration-500 hover:border-cyan/40 hover:bg-surface-2/60 hover:shadow-[0_0_30px_rgba(92,208,255,0.05)]"
            >
              {/* Cover image, product-card style */}
              <Link
                href={`/projects/${p.slug}`}
                className="relative block aspect-[4/3] w-full overflow-hidden border-b border-cyan/10 bg-black/40"
              >
                {p.coverImage ? (
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-90"
                  />
                ) : (
                  <div className="absolute inset-0 bg-grid opacity-20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-2/90 via-transparent to-transparent" />

                {/* Codename + status badges over the image */}
                <div className="absolute left-0 top-0 flex w-full items-center justify-between p-2.5">
                  <span className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan backdrop-blur-md">
                    {String(i + 1).padStart(2, "0")} / {projectCodename(p, i)}
                  </span>
                  <span
                    className={cn(
                      "rounded-sm border px-1.5 py-0.5 text-[8px] uppercase tracking-widest backdrop-blur-md",
                      HUD_STATUS_STYLE[status],
                    )}
                  >
                    {status}
                  </span>
                </div>
              </Link>

              {/* Compact body */}
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-cyan/70">
                  <Terminal size={10} />
                  {p.category}
                </div>

                <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-cyan">
                  {p.title}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.techStack.slice(0, MAX_CHIPS).map((s) => {
                    const meta = lookupTech(s);
                    return (
                      <span
                        key={s}
                        className="flex items-center gap-1 rounded-full border border-cyan/15 bg-cyan/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan/80"
                      >
                        {meta && (
                          <img src={techIconUrl(meta)} alt="" className="h-2.5 w-2.5 opacity-70" aria-hidden />
                        )}
                        {s}
                      </span>
                    );
                  })}
                  {extraChips > 0 && (
                    <span className="rounded-full border border-cyan/15 bg-cyan/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan/60">
                      +{extraChips}
                    </span>
                  )}
                </div>

                <div className="mt-auto border-t border-cyan/10 pt-3">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="inline-flex w-full items-center justify-between gap-2 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-cyan"
                  >
                    <span>{"> dossier"}</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
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
