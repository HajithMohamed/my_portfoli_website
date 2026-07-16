"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/hud/panel";
import type { Project } from "@/lib/types";
import { projectCodename, projectYear } from "@/lib/project-presentation";
import { Terminal, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const LOG_LINES = [
  "git pull origin main ✓",
  "resolving dependencies...",
  "install deps ✓",
  "typecheck ✓ 0 errors",
  "build client [████████--]",
  "build client ✓",
  "build server ✓",
  "prisma migrate deploy ✓",
  "rollout · canary 20% ✓",
  "rollout · 100% · healthy",
  "deploy complete",
];

export function NowDeploying({ project }: { project: Project | null }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % (LOG_LINES.length + 3));
    }, 1200); // slightly slower for better readability
    return () => clearInterval(id);
  }, []);

  if (!project) return null;
  
  const progressPercent = Math.min(100, Math.floor((step / LOG_LINES.length) * 100));

  return (
    <Panel label="now.deploying" subtitle={projectCodename(project)} live className="h-full">
      <div className="flex h-full flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">
            <Cpu size={12} className="text-cyan animate-pulse" />
            active build pipeline
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-foreground">
            {project.title}
          </div>
          <div className="mt-1 font-mono text-xs text-muted-foreground flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-sm bg-cyan/10 text-cyan border border-cyan/20">{project.category}</span>
            <span>{projectYear(project)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 space-y-1.5">
          <div className="flex justify-between font-mono text-[10px] text-cyan/80">
            <span>deploy_progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-cyan/10">
            <motion.div 
              className="h-full bg-cyan shadow-[0_0_10px_rgba(92,208,255,0.8)]"
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            />
          </div>
        </div>

        {/* Terminal */}
        <div className="relative flex-1 overflow-hidden rounded-md border border-cyan/20 bg-[#030712] p-4 font-mono text-[11px] leading-relaxed shadow-inner">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan/40 to-transparent" />
          <div className="absolute right-2 top-2">
            <Terminal size={14} className="text-cyan/30" />
          </div>
          
          <div className="space-y-1">
            {LOG_LINES.slice(0, Math.min(step + 1, LOG_LINES.length)).map((line, i) => {
              const isLast = i === Math.min(step, LOG_LINES.length - 1);
              return (
                <div key={i} className={`flex gap-2 ${line.includes('✓') ? 'text-signal-green' : 'text-cyan/90'} transition-opacity duration-300`}>
                  <span className="text-cyan/40 shrink-0">
                    [{String(6 + Math.floor(i / 3)).padStart(2, "0")}:
                    {String((i * 13) % 60).padStart(2, "0")}]
                  </span>{" "}
                  <span className={`${isLast && !line.includes('✓') ? 'animate-pulse text-white' : ''}`}>
                    {line}
                  </span>
                </div>
              );
            })}
            
            {step < LOG_LINES.length && (
              <div className="flex gap-2 text-cyan">
                 <span className="text-cyan/40 shrink-0">
                    [{String(6 + Math.floor(step / 3)).padStart(2, "0")}:
                    {String(((step+1) * 13) % 60).padStart(2, "0")}]
                  </span>
                <span className="flex items-center">
                  executing
                  <span className="ml-1 inline-block h-[12px] w-[6px] bg-cyan animate-flicker" />
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full border border-cyan/30 bg-cyan/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-cyan/90 transition-colors hover:bg-cyan/20"
            >
              {s}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="rounded-full border border-cyan/10 bg-transparent px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              +{project.techStack.length - 4} more
            </span>
          )}
        </div>
      </div>
    </Panel>
  );
}
