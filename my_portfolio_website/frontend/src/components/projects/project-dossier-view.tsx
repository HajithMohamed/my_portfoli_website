"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Layers, 
  BookOpen, 
  Code2, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  Github, 
  Globe2, 
  ShieldCheck, 
  Activity, 
  CheckCircle2,
  Calendar,
  Box
} from "lucide-react";
import type { Project, CaseStudySection } from "@/lib/types";
import { ProjectArchitectureVisualizer } from "./project-architecture-visualizer";

interface ProjectDossierViewProps {
  project: Project;
  status: string;
  codename: string;
  year: string;
  sections: CaseStudySection[];
  relatedProjects: Project[];
  prevProject?: Project | null;
  nextProject?: Project | null;
}

export function ProjectDossierView({
  project,
  status,
  codename,
  year,
  sections,
  relatedProjects,
  prevProject,
  nextProject,
}: ProjectDossierViewProps) {
  const [activeTab, setActiveTab] = useState<"architecture" | "case-study" | "tech-stack" | "impact">("architecture");

  // Architecture indicators tailored per project
  const isAcademic = status.toUpperCase().includes("ACADEMIC") || (project.category && project.category.toUpperCase().includes("ACADEMIC"));
  const telemetryMetrics = [
    {
      label: "Architecture Pattern",
      value: "Layered MVC / REST",
      detail: "Decoupled frontend & backend services",
      icon: Layers,
      color: "text-cyan",
    },
    {
      label: "Architecture Scope",
      value: project.category || "Full-Stack System",
      detail: `${project.techStack.length} Integrated Technologies`,
      icon: Box,
      color: "text-indigo-400",
    },
    {
      label: "Security & Guardrails",
      value: "JWT & Role-Based Auth",
      detail: "Protected API routes & DTO validation",
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
    {
      label: "Project Classification",
      value: isAcademic ? "Academic Prototype" : year,
      detail: isAcademic ? "Coursework system prototype" : "Verified Project Implementation",
      icon: Calendar,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Next/Prev Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-cyan transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Projects Archive</span>
        </Link>

        {/* Quick Carousel Controls */}
        <div className="flex items-center gap-3">
          {prevProject && (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-cyan/40 hover:text-cyan transition-all"
              title={`Previous: ${prevProject.title}`}
            >
              <ArrowLeft size={12} />
              <span className="hidden sm:inline">Prev Project</span>
            </Link>
          )}
          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-cyan/40 hover:text-cyan transition-all"
              title={`Next: ${nextProject.title}`}
            >
              <span className="hidden sm:inline">Next Project</span>
              <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Hero Studio Dossier Card */}
      <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/90 p-6 sm:p-10 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
            <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
            <span>DOSSIER // {codename}</span>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {status}
          </span>
        </div>

        <h1 className="mt-6 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {project.title}
        </h1>

        <div className="mt-2 font-mono text-xs text-muted-foreground">
          {project.category} · {year}
        </div>

        <p className="mt-5 max-w-3xl text-base sm:text-lg leading-relaxed text-foreground/90">
          {project.description}
        </p>

        {project.coverImage ? (
          <figure className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <div className="relative aspect-[16/8] w-full">
              <Image
                src={project.coverImage}
                alt={project.coverImageAlt ?? project.title}
                fill
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="object-cover"
                priority
              />
            </div>
            {project.coverImageKind === "concept" ? (
              <figcaption className="p-3 border-t border-white/[0.06] font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground text-center">
                Concept illustration generated from repository architecture and README specification.
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        {/* Telemetry Metrics Grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {telemetryMetrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {m.label}
                  </span>
                  <Icon size={14} className={m.color} />
                </div>
                <div className="mt-1 font-display text-xl font-bold text-foreground">
                  {m.value}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {m.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Repository & Deployment Links */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              data-track="github_click"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-cyan hover:bg-cyan/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              <Github size={14} />
              <span>View Repository</span>
              <ExternalLink size={12} />
            </a>
          ) : null}

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
            >
              <Globe2 size={14} />
              <span>Open Live Platform</span>
              <ExternalLink size={12} />
            </a>
          ) : null}

          {project.sourceUrl && project.sourceUrl !== project.githubUrl ? (
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
            >
              <span>README Specification</span>
              <ExternalLink size={12} />
            </a>
          ) : null}
        </div>
      </header>

      {/* Dossier Tabs Navigation */}
      <div className="flex border-b border-white/[0.08] gap-2 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("architecture")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === "architecture"
              ? "border-cyan text-cyan bg-cyan/[0.05]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers size={13} />
          <span>Architecture Topology</span>
        </button>

        {sections.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("case-study")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "case-study"
                ? "border-cyan text-cyan bg-cyan/[0.05]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen size={13} />
            <span>Case Study Dossier ({sections.length})</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setActiveTab("tech-stack")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
            activeTab === "tech-stack"
              ? "border-cyan text-cyan bg-cyan/[0.05]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 size={13} />
          <span>Technology Modules ({project.techStack.length})</span>
        </button>

        {project.outcome && (
          <button
            type="button"
            onClick={() => setActiveTab("impact")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "impact"
                ? "border-cyan text-cyan bg-cyan/[0.05]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles size={13} />
            <span>Impact &amp; Deliverables</span>
          </button>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === "architecture" && (
        <section aria-label="System Architecture Visualizer">
          <ProjectArchitectureVisualizer
            projectTitle={project.title}
            techStack={project.techStack}
            category={project.category}
          />
        </section>
      )}

      {activeTab === "case-study" && sections.length > 0 && (
        <section aria-label="Case Study Sections" className="grid gap-6 md:grid-cols-2">
          {sections.map((section, index) => (
            <div
              key={`${section.heading}-${index}`}
              className={`rounded-2xl border border-white/[0.08] bg-surface/80 p-6 backdrop-blur-xl ${
                index === sections.length - 1 && sections.length % 2 === 1 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
                <span>{`0${index + 1} // ${section.heading}`}</span>
              </div>
              <h3 className="mt-2 font-display text-xl font-bold text-foreground">
                {section.heading}
              </h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </div>
          ))}
        </section>
      )}

      {activeTab === "tech-stack" && (
        <section aria-label="Technology Specification" className="rounded-2xl border border-white/[0.08] bg-surface/80 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
            <Code2 size={13} />
            <span>FULL PRODUCTION DEPENDENCY MATRIX</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {project.techStack.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-cyan/30 hover:bg-cyan/[0.03]"
              >
                <div className="h-2 w-2 rounded-full bg-cyan" />
                <span className="font-mono text-sm font-medium text-foreground">
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "impact" && project.outcome && (
        <section aria-label="Engineering Impact" className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.03] p-6 sm:p-8 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400">
            <Sparkles size={13} />
            <span>ENGINEERING IMPACT &amp; VERIFIED OUTCOMES</span>
          </div>
          <p className="text-base sm:text-lg leading-relaxed text-foreground">
            {project.outcome}
          </p>
        </section>
      )}

      {/* Lead Generation & Architecture Consultation CTA */}
      <div className="rounded-2xl border border-cyan/30 bg-gradient-to-r from-cyan/10 via-indigo-950/30 to-purple-950/20 p-6 sm:p-10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
            <CheckCircle2 size={12} />
            <span>ENGINEERING COLLABORATION</span>
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground">
            Architecting a high-throughput system?
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Let&apos;s formulate architectural scope, database schemas, and microservice topologies for your enterprise product.
          </p>
        </div>
        <Link
          href={`/start-project?service=enterprise-systems&project=${project.slug}`}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-indigo-500 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-95 transition-opacity"
        >
          <span>Initiate Architecture Scope</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Related Projects Archive */}
      {relatedProjects.length > 0 && (
        <div className="pt-8 space-y-4 border-t border-white/[0.08]">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            More Projects From The Archive
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-cyan/40 hover:bg-white/[0.04]"
              >
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-cyan">
                    {p.category ?? "Case Study"}
                  </div>
                  <h4 className="mt-1 font-display text-lg font-bold text-foreground group-hover:text-cyan transition-colors">
                    {p.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 font-mono text-xs text-cyan">
                  <span>Read Dossier</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
