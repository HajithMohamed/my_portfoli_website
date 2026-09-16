"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/components/hud/panel";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/lib/types";
import { ArrowRight, ExternalLink, Github, Layers, Terminal, Sparkles } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  const [activeBeat, setActiveBeat] = useState(0);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReduced = useReducedMotion();

  if (!projects.length) return null;

  // The primary featured project
  const featured =
    projects.find((p) => p.featured && (p.caseStudy?.length || p.coverImage)) ||
    projects[0];

  // Remaining secondary projects for the asymmetric 2-up grid
  const secondaryProjects = projects.filter((p) => p.slug !== featured.slug);

  // 3 Detail Beats for the featured project
  const sections = featured.caseStudy ?? [];
  const beats = [
    {
      index: "01/03",
      label: "Architecture & Goal",
      heading: sections[0]?.heading ?? "System Architecture",
      body:
        sections[0]?.body ??
        featured.description ??
        "Designed and engineered for resilient operations and high-throughput workflows.",
      highlight: featured.techStack.slice(0, 3).join(" · "),
    },
    {
      index: "02/03",
      label: "Technical Implementation",
      heading: sections[1]?.heading ?? "Core Implementation",
      body:
        sections[1]?.body ??
        "Production-grade separation of concerns with modern stack primitives, API contracts, and scalable storage.",
      highlight: featured.techStack.slice(2, 6).join(" · ") || featured.category,
    },
    {
      index: "03/03",
      label: "Workflow & Deliverables",
      heading: sections[2]?.heading ?? "Operational Readiness",
      body:
        sections[2]?.body ??
        featured.outcome ??
        "Fully validated schema migrations, CI test runs, and audited deployment artifacts.",
      highlight: featured.isCurrent ? "Active Deployment" : "Production Baseline",
    },
  ];

  // ScrollTrigger integration for desktop pinning while cycling beats
  useEffect(() => {
    if (!isDesktop || prefersReduced || !showcaseRef.current) return;

    let cleanup = () => {};

    import("gsap").then((gsapModule) => {
      const gsap = gsapModule.default || gsapModule;
      import("gsap/ScrollTrigger").then((stModule) => {
        const ScrollTrigger = stModule.ScrollTrigger || stModule.default;
        gsap.registerPlugin(ScrollTrigger);

        const st = ScrollTrigger.create({
          trigger: showcaseRef.current,
          start: "top top+=90",
          end: "+=900",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const nextBeat = Math.min(2, Math.floor(self.progress * 3));
            setActiveBeat(nextBeat);
          },
        });

        cleanup = () => {
          st.kill();
        };
      });
    });

    return () => cleanup();
  }, [isDesktop, prefersReduced]);

  return (
    <div className="space-y-12">
      {/* FEATURED PROJECT (Pinned rhythm on desktop, vertical stack on mobile) */}
      <Panel
        label="featured.system"
        subtitle="01 flagship dossier"
        actions={
          <Link
            href={`/projects/${featured.slug}`}
            className="group flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan hover:text-cyan-glow transition-colors"
          >
            <span>full dossier</span>
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        }
      >
        <div
          ref={showcaseRef}
          className="relative overflow-hidden rounded-xl border border-cyan/25 bg-surface/95 backdrop-blur-md p-6 lg:p-10 shadow-2xl"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Side: Visual Showcase + Cover Image */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-cyan/30 bg-black/60 shadow-lg">
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage}
                    alt={featured.coverImageAlt ?? featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col justify-center items-center p-8 bg-grid opacity-40">
                    <Terminal size={48} className="text-cyan/40 mb-3" />
                    <span className="font-mono text-xs text-cyan/70">
                      $ sys.inspect --target {featured.slug}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2 rounded-sm border border-cyan/40 bg-surface/90 px-2.5 py-1 text-cyan backdrop-blur">
                    <Sparkles size={11} className="text-signal-green" />
                    {featured.category}
                  </span>
                  {featured.liveUrl && (
                    <a
                      href={featured.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 rounded-sm border border-signal-green/40 bg-signal-green/10 px-2.5 py-1 text-signal-green hover:bg-signal-green/20 backdrop-blur transition-all"
                    >
                      <ExternalLink size={11} />
                      <span>Live App</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Quick Tech Badge Row */}
              <div className="flex flex-wrap gap-2 pt-2">
                {featured.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-sm border border-cyan/20 bg-cyan/5 px-2.5 py-1 font-mono text-[11px] text-cyan"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Side: Content & 3 Numbered Detail Beats */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/70 border-b border-cyan/15 pb-2">
                  <span>flagship deployment</span>
                  <span className="text-signal-green">active</span>
                </div>
                <h2 className="mt-3 font-display text-2xl lg:text-3xl font-bold text-foreground">
                  {featured.title}
                </h2>
              </div>

              {/* Detail Beats Tabs */}
              <div className="flex items-center gap-2 border-b border-cyan/20 pb-3 font-mono text-xs">
                {beats.map((beat, idx) => {
                  const isActive = activeBeat === idx;
                  return (
                    <button
                      key={beat.index}
                      type="button"
                      onClick={() => setActiveBeat(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm uppercase tracking-wider transition-all ${
                        isActive
                          ? "bg-cyan text-black font-semibold shadow-[0_0_12px_var(--cyan-glow)]"
                          : "text-muted-foreground hover:text-cyan hover:bg-cyan/10"
                      }`}
                    >
                      <span>{beat.index}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Beat Content with Crossfade */}
              <div className="min-h-[140px] space-y-3 font-mono">
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/80 flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan" />
                  {beats[activeBeat].heading}
                </div>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {beats[activeBeat].body}
                </p>
                <div className="pt-2 text-[11px] text-cyan/70">
                  <span className="text-muted-foreground">Scope: </span>
                  {beats[activeBeat].highlight}
                </div>
              </div>

              {/* Bottom Action CTAs */}
              <div className="pt-4 border-t border-cyan/15 flex items-center justify-between font-mono text-xs uppercase tracking-wider">
                <Link
                  href={`/projects/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-cyan hover:text-cyan-glow transition-colors"
                >
                  <Terminal size={14} />
                  <span>read architecture case study</span>
                  <ArrowRight size={14} />
                </Link>

                {featured.githubUrl && (
                  <a
                    href={featured.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-track="github_click"
                    className="p-2 rounded-sm border border-cyan/25 bg-cyan/5 text-cyan hover:border-cyan hover:bg-cyan/20 transition-all"
                  >
                    <Github size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* SECONDARY PROJECTS (2-Up Asymmetric Rhythm) */}
      {secondaryProjects.length > 0 && (
        <Panel
          label="secondary.systems"
          subtitle={`${secondaryProjects.length} systems indexed`}
          actions={
            <Link
              href="/projects"
              className="group flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan hover:text-cyan-glow transition-colors"
            >
              <span>index reactor</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          }
        >
          <div className="grid gap-6 md:grid-cols-2">
            {secondaryProjects.map((proj, idx) => (
              <ProjectCard key={proj.slug} project={proj} index={idx} />
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
