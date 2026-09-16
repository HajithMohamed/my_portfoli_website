"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/types";

const MAX_TECH = 4;

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.48, delay: Math.min(index * 0.06, 0.42), ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduceMotion ? undefined : { y: -10, scale: 1.015 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cyan/25 bg-surface/90 shadow-[0_18px_55px_rgba(0,0,0,0.24)] transition-colors duration-300 hover:border-cyan/80 hover:shadow-[0_22px_70px_var(--cyan-glow)]"
    >
      <Link href={`/projects/${project.slug}`} className="flex h-full flex-col p-4 focus-visible:outline-none">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-cyan/20 bg-black/40">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.coverImageAlt ?? project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
              className="object-cover transition duration-700 group-hover:scale-105 group-hover:saturate-125"
            />
          ) : (
            <div className="absolute inset-0 bg-grid opacity-35" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/35 to-transparent" />
          {project.isCurrent ? <span className="absolute right-3 top-3 rounded-full border border-cyan/40 bg-surface/85 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan backdrop-blur">New</span> : null}
        </div>

        <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
          <h3 className="font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-cyan">{project.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.techStack.slice(0, MAX_TECH).map((technology) => (
              <span key={technology} className="rounded-full border border-cyan/30 bg-cyan/[0.04] px-3 py-1 font-mono text-[10px] text-cyan/90">{technology}</span>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-3 pt-7 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan">
            View project <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-2" />
          </div>
        </div>
      </Link>
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-cyan/70 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.article>
  );
}
