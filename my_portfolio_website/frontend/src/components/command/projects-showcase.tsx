import Link from "next/link";
import { Panel } from "@/components/hud/panel";
import type { Project } from "@/lib/types";
import {
  HUD_STATUS_STYLE,
  projectBriefing,
  projectCodename,
  projectHudStatus,
  projectYear,
} from "@/lib/project-presentation";

function LabelRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="w-16 shrink-0 text-[9px] uppercase tracking-[0.25em] text-cyan/70">
        {label}
      </div>
      <div className={accent ? "text-foreground" : "text-muted-foreground"}>{value}</div>
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
          className="text-[10px] uppercase tracking-[0.25em] text-cyan hover:underline"
        >
          view all →
        </Link>
      }
      bodyClassName="p-0"
    >
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto p-4 pb-6">
        {projects.map((p, i) => {
          const status = projectHudStatus(p, i === 0);
          const briefing = projectBriefing(p);
          const metrics = [
            { label: "year", value: projectYear(p) },
            { label: "stack", value: `${p.techStack.length} techs` },
            { label: "class", value: p.category.split(" ")[0] },
          ];
          return (
            <article
              key={p.slug}
              className="hud-panel-solid corner-brackets group flex min-h-[420px] w-[85vw] max-w-[640px] shrink-0 snap-start flex-col p-6 transition-all hover:border-cyan/50"
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
                <span className="text-cyan">
                  {String(i + 1).padStart(2, "0")} / {projectCodename(p, i)}
                </span>
                <span className={`border px-2 py-0.5 ${HUD_STATUS_STYLE[status]}`}>{status}</span>
              </div>

              <div className="mt-4">
                <div className="font-mono text-[10px] text-muted-foreground">
                  {p.category} · {projectYear(p)}
                </div>
                <h3 className="mt-1 font-display text-3xl font-semibold text-foreground group-hover:text-glow">
                  {p.title}
                </h3>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

              {(briefing.problem || briefing.approach || briefing.outcome) && (
                <div className="mt-4 space-y-2 border-y border-cyan/10 py-3 font-mono text-[11px]">
                  {briefing.problem ? <LabelRow label="problem" value={briefing.problem} /> : null}
                  {briefing.approach ? (
                    <LabelRow label="approach" value={briefing.approach} />
                  ) : null}
                  {briefing.outcome ? (
                    <LabelRow label="outcome" value={briefing.outcome} accent />
                  ) : null}
                </div>
              )}

              <div className="mt-3 grid grid-cols-3 gap-2 font-mono">
                {metrics.map((m) => (
                  <div key={m.label} className="border border-cyan/15 bg-surface/40 p-2">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-cyan/70">
                      {m.label}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>

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

              <div className="mt-auto pt-4">
                <Link
                  href={`/projects/${p.slug}`}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan hover:text-glow"
                >
                  {"> open dossier"}{" "}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
