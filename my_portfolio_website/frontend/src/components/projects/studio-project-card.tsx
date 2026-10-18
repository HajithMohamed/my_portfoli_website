"use client";

import { useState, useRef, useCallback, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Sparkles } from "lucide-react";
import type { Project } from "@/lib/types";

export function StudioProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
  }, []);

  const hasImage = Boolean(project.coverImage);

  // Determine accent theme color based on project category or tech
  const isAmber =
    project.slug.includes("shoe") ||
    project.slug.includes("footwear") ||
    project.techStack.includes("PHP");

  const isViolet =
    project.slug.includes("voice") ||
    project.slug.includes("goyo") ||
    project.techStack.includes("Python");

  const glowColor = isAmber
    ? "rgba(245, 158, 11, 0.15)"
    : isViolet
    ? "rgba(139, 92, 246, 0.15)"
    : "rgba(6, 182, 212, 0.15)";

  const borderHoverClass = isAmber
    ? "group-hover:border-amber-500/50"
    : isViolet
    ? "group-hover:border-violet-500/50"
    : "group-hover:border-cyan/50";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/[0.08] bg-surface/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${borderHoverClass}`}
    >
      {/* Dynamic Cursor Spotlight */}
      {mousePos && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}

      <div>
        {/* Visual Cover or Code Matrix Preview */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/[0.06] bg-black/40">
          {hasImage ? (
            <Image
              src={project.coverImage!}
              alt={project.coverImageAlt ?? project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-br from-white/[0.03] to-transparent">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-cyan/70">
                <span>sys.repo</span>
                <span>{project.techStack[0] ?? "TypeScript"}</span>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground/60">
                $ git clone {project.repositoryFullName ?? `hajith/${project.slug}`}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />

          {/* Status Badges Overlay */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {project.featured && (
              <span className="flex items-center gap-1 rounded border border-amber-500/40 bg-black/80 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
                <Sparkles size={10} />
                <span>Featured</span>
              </span>
            )}
            {project.isCurrent && (
              <span className="rounded border border-emerald-500/40 bg-black/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-400 backdrop-blur-md">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Category Eyebrow */}
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {project.category ?? "Software Engineering"}
          </div>

          {/* Title */}
          <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-cyan line-clamp-1">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground/60">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer / Action Links */}
      <div className="px-5 py-3.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-cyan transition-colors"
              title="View GitHub Repository"
            >
              <Github size={12} />
              <span>Repo</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Open Live Demonstration"
            >
              <ExternalLink size={12} />
              <span>Live</span>
            </a>
          )}
        </div>

        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-cyan hover:text-cyan-soft transition-colors"
        >
          <span>Dossier</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
