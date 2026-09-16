"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Panel } from "@/components/hud/panel";
import type { Project } from "@/lib/types";
import {
  ArrowRight,
  Calendar,
  Code2,
  ExternalLink,
  Github,
  Globe2,
  Layers,
  Package,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  // Find Saga Elite or featured project
  const featured =
    projects.find(
      (p) =>
        p.slug === "saga-elite" ||
        p.slug === "saga-elite-web-project" ||
        p.title.toLowerCase().includes("saga")
    ) ||
    projects.find((p) => p.featured && p.coverImage) ||
    projects[0];

  const [sagaImg, setSagaImg] = useState<string>(
    featured.coverImage || "/projects/saga-elite-cover.png"
  );

  // Specific secondary projects
  const libraryProject = projects.find(
    (p) =>
      p.slug === "library-management-system" ||
      p.title.toLowerCase().includes("library")
  );

  const nextgenProject = projects.find(
    (p) =>
      p.slug === "nextgen-mobile-shop" ||
      p.title.toLowerCase().includes("nextgen") ||
      p.title.toLowerCase().includes("mobile")
  );

  const otherProjects = projects.filter((p) => p.slug !== featured.slug);
  const secondaryA = libraryProject || otherProjects[0] || featured;
  const secondaryB =
    nextgenProject || otherProjects.find((p) => p.slug !== secondaryA.slug) || otherProjects[1] || featured;

  return (
    <section className="space-y-6">
      {/* SECTION HEADER — HUD Compact */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-cyan/15 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
            <span className="inline-block w-4 h-[1px] bg-cyan" />
            <span>sys.portfolio // verified builds</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Featured Projects
          </h2>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            Curated selection of real-world production systems and open-source applications.
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 border border-cyan/30 bg-cyan/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan hover:bg-cyan/15 hover:border-cyan/50 transition-colors shrink-0 rounded-sm"
        >
          <span>All Repositories</span>
          <ArrowRight size={11} />
        </Link>
      </div>

      {/* FEATURED PROJECT HUD PANEL — Compact & Same as Existing Theme */}
      <Panel
        label="sys.featured"
        subtitle={featured.slug}
        live
        className="w-full"
        bodyClassName="p-4 sm:p-5"
      >
        <div className="grid gap-5 lg:grid-cols-12 items-center">
          {/* Left Column: Visual Preview */}
          <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] max-h-[260px] w-full overflow-hidden rounded-md border border-cyan/20 bg-black/50 group">
            <Image
              src={sagaImg}
              alt={featured.coverImageAlt || featured.title}
              fill
              priority
              onError={() => setSagaImg("/projects/saga-elite-cover.png")}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Category tag overlay */}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-sm border border-cyan/30 bg-black/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan backdrop-blur-md">
              <Package size={11} className="text-cyan" />
              <span>E-Commerce &amp; Lifestyle</span>
            </div>
          </div>

          {/* Right Column: Project details */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3.5">
            <div>
              {/* Telemetry pill */}
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan/80">
                <span className="flex items-center gap-1 text-amber-400">
                  <Sparkles size={11} /> Featured System
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Full Stack Architecture</span>
              </div>

              {/* Title */}
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1 tracking-tight group-hover:text-cyan transition-colors">
                {featured.title}
              </h3>

              {/* Description */}
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {featured.description}
              </p>

              {/* Tech Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(featured.techStack.length
                  ? featured.techStack.slice(0, 6)
                  : ["React", "Redux Toolkit", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"]
                ).map((tech) => (
                  <span
                    key={tech}
                    className="border border-cyan/15 bg-surface-2/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan/90 rounded-sm"
                  >
                    {tech}
                  </span>
                ))}
                {featured.techStack.length > 6 && (
                  <span className="border border-cyan/15 bg-surface-2/40 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground rounded-sm">
                    +{featured.techStack.length - 6}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons & Metadata */}
            <div className="pt-3 border-t border-cyan/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={featured.githubUrl || "https://github.com/HajithMohamed/Saga-Elite-Web-project"}
                  target="_blank"
                  rel="noreferrer"
                  data-track="github_click"
                  className="inline-flex items-center gap-1.5 border border-cyan/40 bg-cyan/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan hover:bg-cyan/20 transition-colors rounded-sm"
                >
                  <Github size={12} />
                  <span>Repository</span>
                  <ExternalLink size={10} />
                </a>

                {featured.liveUrl ? (
                  <a
                    href={featured.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 border border-cyan/20 bg-surface-2/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground hover:border-cyan/50 hover:text-cyan transition-colors rounded-sm"
                  >
                    <Globe2 size={12} />
                    <span>Live Demo</span>
                    <ExternalLink size={10} />
                  </a>
                ) : (
                  <Link
                    href={`/projects/${featured.slug}`}
                    className="inline-flex items-center gap-1.5 border border-cyan/20 bg-surface-2/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground hover:border-cyan/50 hover:text-cyan transition-colors rounded-sm"
                  >
                    <Globe2 size={12} />
                    <span>Dossier</span>
                    <ExternalLink size={10} />
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={11} className="text-cyan/70" /> 2025
                </span>
                <span className="flex items-center gap-1">
                  <Users size={11} className="text-cyan/70" /> 4 Members
                </span>
                <span className="flex items-center gap-1">
                  <Layers size={11} className="text-cyan/70" /> MERN Stack
                </span>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      {/* SECONDARY PROJECTS GRID (2-UP) — Identical HUD Panel Styling */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Secondary Card 1: University Library Management System */}
        <Panel
          label="sys.project"
          subtitle={secondaryA.slug}
          live
          className="h-full"
          bodyClassName="p-4 sm:p-5 flex flex-col justify-between h-full"
        >
          <div className="space-y-3">
            <div className="relative aspect-[16/9] max-h-[160px] w-full overflow-hidden rounded-md border border-cyan/15 bg-black/40 group">
              <Image
                src={secondaryA.coverImage || "/projects/university-library-cover.png"}
                alt={secondaryA.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-2 rounded-sm border border-cyan/30 bg-black/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan">
                Academic Management
              </div>
            </div>

            <div>
              <h4 className="font-display text-base sm:text-lg font-bold text-foreground transition-colors group-hover:text-cyan">
                {secondaryA.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {secondaryA.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {(secondaryA.techStack.length
                ? secondaryA.techStack.slice(0, 4)
                : ["PHP", "MySQLi", "JavaScript", "Bootstrap"]
              ).map((tech) => (
                <span
                  key={tech}
                  className="border border-cyan/15 bg-surface-2/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan/90 rounded-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between border-t border-cyan/15 font-mono text-[10px]">
            <a
              href={secondaryA.githubUrl || "https://github.com/HajithMohamed/Library-Management-System"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan hover:underline"
            >
              <Github size={12} />
              <span>Repository</span>
              <ExternalLink size={10} />
            </a>

            <Link
              href={`/projects/${secondaryA.slug}`}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-cyan transition-colors"
            >
              <Globe2 size={11} />
              <span>Inspect Case</span>
            </Link>
          </div>
        </Panel>

        {/* Secondary Card 2: NEXTGEN Mobile Shop */}
        <Panel
          label="sys.project"
          subtitle={secondaryB.slug}
          live
          className="h-full"
          bodyClassName="p-4 sm:p-5 flex flex-col justify-between h-full"
        >
          <div className="space-y-3">
            <div className="relative aspect-[16/9] max-h-[160px] w-full overflow-hidden rounded-md border border-cyan/15 bg-black/40 group">
              <Image
                src={secondaryB.coverImage || "/projects/nextgen-mobile-cover.png"}
                alt={secondaryB.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-2 rounded-sm border border-cyan/30 bg-black/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan">
                Retail &amp; POS
              </div>
            </div>

            <div>
              <h4 className="font-display text-base sm:text-lg font-bold text-foreground transition-colors group-hover:text-cyan">
                {secondaryB.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {secondaryB.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {(secondaryB.techStack.length
                ? secondaryB.techStack.slice(0, 4)
                : ["React", "Node.js", "Express.js", "MongoDB"]
              ).map((tech) => (
                <span
                  key={tech}
                  className="border border-cyan/15 bg-surface-2/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan/90 rounded-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between border-t border-cyan/15 font-mono text-[10px]">
            <a
              href={secondaryB.githubUrl || "https://github.com/HajithMohamed/NEXTGEN---Sri-Lankan-Mobile-Shop-eCommerce-Website"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-cyan hover:underline"
            >
              <Github size={12} />
              <span>Repository</span>
              <ExternalLink size={10} />
            </a>

            <Link
              href={`/projects/${secondaryB.slug}`}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-cyan transition-colors"
            >
              <Globe2 size={11} />
              <span>Inspect Case</span>
            </Link>
          </div>
        </Panel>
      </div>

      {/* EXPLORE MORE HUD PANEL — Matching Existing Theme */}
      <Panel
        label="sys.catalog"
        subtitle="repository-archive"
        className="w-full"
        bodyClassName="p-4 sm:p-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-cyan/30 bg-cyan/10 text-cyan">
              <Code2 size={18} />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-foreground">
                Explore Full Engineering Catalog
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-0.5">
                Inspect 25+ open-source repositories, architectural case studies, and engineering benchmarks.
              </p>
            </div>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 shrink-0 border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-cyan hover:bg-cyan/20 hover:border-cyan transition-all rounded-sm w-full sm:w-auto"
          >
            <span>View All Projects</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </Panel>
    </section>
  );
}
