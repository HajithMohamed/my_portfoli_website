"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { RevealAnimation } from "@/components/ui/reveal-animation";
import type { Project } from "@/lib/types";

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <RevealAnimation>
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge>Projects</Badge>
            <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
              Case-study ready platform work
            </h2>
          </div>
          <ButtonLink href="/projects" variant="secondary" className="self-start sm:self-auto">
            View all
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </RevealAnimation>

      <div className="grid gap-6 lg:grid-cols-3">
        {projects.slice(0, 3).map((project, i) => (
          <RevealAnimation key={project.id} delay={i * 0.1} variant="slide-up">
            <TiltCard className="h-full">
              <div className="flex flex-col h-full rounded-xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 hover:border-blue-500/30 transition-all duration-300 group">
                {/* Top accent bar */}
                <div className="h-1 w-full rounded-full bg-gradient-to-r from-blue-500/60 via-violet-500/60 to-blue-500/60 mb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <Badge className="w-fit">{project.category}</Badge>
                <h3 className="mt-5 text-xl font-semibold text-white group-hover:text-blue-200 transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{project.description}</p>

                {project.outcome && (
                  <div className="mt-4 rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2">
                    <p className="text-xs text-blue-300 leading-5">{project.outcome}</p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      className="rounded-md bg-white/5 border border-white/8 px-2 py-1 text-xs text-slate-300 hover:bg-white/10 transition-colors duration-150"
                      key={tech}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <ButtonLink
                    className="flex-1"
                    href={`/projects/${project.slug}`}
                    variant="secondary"
                  >
                    Case study
                    <ArrowRight className="h-3.5 w-3.5" />
                  </ButtonLink>
                  {project.githubUrl && (
                    <ButtonLink href={project.githubUrl} variant="ghost" size="sm" className="px-3">
                      <Github className="h-4 w-4" />
                    </ButtonLink>
                  )}
                  {project.liveUrl && (
                    <ButtonLink href={project.liveUrl} variant="ghost" size="sm" className="px-3">
                      <ExternalLink className="h-4 w-4" />
                    </ButtonLink>
                  )}
                </div>
              </div>
            </TiltCard>
          </RevealAnimation>
        ))}
      </div>
    </section>
  );
}
