"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/hud/panel";
import type { Project } from "@/lib/types";
import { projectCodename, projectYear } from "@/lib/project-presentation";

const LOG_LINES = [
  "▸ pull origin main ✓",
  "▸ install deps ✓",
  "▸ typecheck ✓ 0 errors",
  "▸ build client ✓",
  "▸ build server ✓",
  "▸ prisma migrate deploy ✓",
  "▸ rollout · canary 20% ✓",
  "▸ rollout · 100% · healthy",
  "▸ deploy complete",
];

export function NowDeploying({ project }: { project: Project | null }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % (LOG_LINES.length + 3));
    }, 800);
    return () => clearInterval(id);
  }, []);

  if (!project) return null;

  return (
    <Panel label="now.deploying" subtitle={projectCodename(project)} live>
      <div className="mb-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">
          currently in flight
        </div>
        <div className="mt-1 font-display text-lg font-semibold text-foreground">
          {project.title}
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          {project.category} · {projectYear(project)}
        </div>
      </div>

      <div className="border border-cyan/15 bg-black/40 p-3 font-mono text-[11px] leading-relaxed">
        {LOG_LINES.slice(0, Math.min(step + 1, LOG_LINES.length)).map((line, i) => (
          <div key={i} className="text-signal-green">
            <span className="text-cyan/60">
              [{String(6 + Math.floor(i / 3)).padStart(2, "0")}:
              {String((i * 7) % 60).padStart(2, "0")}]
            </span>{" "}
            {line}
          </div>
        ))}
        {step < LOG_LINES.length && (
          <div className="text-cyan animate-flicker">
            <span className="text-cyan/60">[...]</span> working
            <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-cyan" />
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.techStack.map((s) => (
          <span
            key={s}
            className="border border-cyan/20 bg-cyan/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-cyan/90"
          >
            {s}
          </span>
        ))}
      </div>
    </Panel>
  );
}
