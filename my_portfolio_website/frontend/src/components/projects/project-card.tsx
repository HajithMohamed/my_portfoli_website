"use client";

import { useState, useRef, useCallback, MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Star } from "lucide-react";
import type { Project } from "@/lib/types";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useMediaQuery } from "@/lib/use-media-query";

const MAX_TECH = 5;

export function ProjectCard({
  project,
  index = 0,
  featured = false,
}: {
  project: Project;
  index?: number;
  featured?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Spotlight coordinates
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });

      // Tilt only on desktop and only when reduced motion is not requested
      if (isDesktop && !reduceMotion) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const tiltX = Math.max(-4, Math.min(4, -((y - cy) / cy) * 4));
        const tiltY = Math.max(-4, Math.min(4, ((x - cx) / cx) * 4));
        setTilt({ x: tiltX, y: tiltY });
      }
    },
    [isDesktop, reduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
    setTilt({ x: 0, y: 0 });
  }, []);

  const hasImage = Boolean(project.coverImage);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform:
          isDesktop && !reduceMotion && (tilt.x !== 0 || tilt.y !== 0)
            ? `perspective(1000px) rotateX(${tilt.x.toFixed(1)}deg) rotateY(${tilt.y.toFixed(1)}deg)`
            : undefined,
        transition: "transform 0.2s ease-out, border-color 0.25s ease, box-shadow 0.25s ease",
      }}
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-cyan/20 bg-surface/90 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/60 hover:shadow-[0_12px_36px_var(--cyan-glow)] focus-within:ring-2 focus-within:ring-cyan ${
        hasImage ? "min-h-[380px]" : "min-h-[290px]"
      }`}
    >
      {/* Radial cursor spotlight */}
      {mousePos && !reduceMotion && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, var(--accent-glow, rgba(92, 208, 255, 0.12)), transparent 70%)`,
          }}
        />
      )}

      {/* Visual Cover or Code Matrix Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-cyan/15 bg-black/40">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.coverImageAlt ?? project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between p-4 bg-grid opacity-30">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-cyan/60">
              <span>sys.repo</span>
              <span>{project.techStack[0] ?? "TypeScript"}</span>
            </div>
            <div className="font-mono text-[10px] text-cyan/40">
              $ git clone {project.repositoryFullName ?? `hajith/${project.slug}`}
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />

        {/* Tags / Telemetry */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {project.isCurrent && (
            <span className="rounded-sm border border-signal-green/40 bg-signal-green/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-signal-green backdrop-blur">
              active
            </span>
          )}
          {project.category && (
            <span className="rounded-sm border border-cyan/30 bg-surface/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan backdrop-blur">
              {project.category.replace(/ case study| repository/i, "")}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <Link
          href={`/projects/${project.slug}`}
          className="focus-visible:outline-none"
        >
          <h3 className="font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-cyan">
            {project.title}
          </h3>
        </Link>

        {/* One-line description */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {/* Staggered Tech Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, MAX_TECH).map((tech, i) => (
            <span
              key={tech}
              style={{
                transitionDelay: `${i * 40}ms`,
              }}
              className="rounded-sm border border-cyan/20 bg-cyan/5 px-2 py-0.5 font-mono text-[10px] text-cyan/90 transition-colors group-hover:border-cyan/40 group-hover:bg-cyan/10"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > MAX_TECH && (
            <span className="px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              +{project.techStack.length - MAX_TECH}
            </span>
          )}
        </div>

        {/* Footer Actions — Live button is absent if no live URL, never disabled */}
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-cyan/10">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan transition-colors hover:text-cyan-glow"
          >
            <span>inspect</span>
            <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          <div className="flex items-center gap-2 opacity-70 transition-opacity group-hover:opacity-100">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                data-track="github_click"
                aria-label={`View ${project.title} on GitHub`}
                className="flex h-7 w-7 items-center justify-center rounded-sm border border-cyan/20 bg-cyan/5 text-cyan hover:border-cyan hover:bg-cyan/20 hover:text-cyan-glow transition-all"
              >
                <Github size={13} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open live site for ${project.title}`}
                className="flex h-7 items-center gap-1 px-2.5 rounded-sm border border-cyan/30 bg-cyan/10 text-cyan font-mono text-[10px] uppercase tracking-[0.15em] hover:border-cyan hover:bg-cyan/25 hover:text-cyan-glow transition-all"
              >
                <ExternalLink size={12} />
                <span>live</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
