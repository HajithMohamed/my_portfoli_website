"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import {
  ArrowRight,
  Calendar,
  Code2,
  ExternalLink,
  Github,
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
    projects.find((p) => p.slug === "saga-elite" || p.title.toLowerCase().includes("saga")) ||
    projects.find((p) => p.featured && p.coverImage) ||
    projects[0];

  // Specific secondary projects matching the mockup
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

  // Fallback to other secondary projects if the exact ones aren't found
  const otherProjects = projects.filter((p) => p.slug !== featured.slug);
  const secondaryA = libraryProject || otherProjects[0] || featured;
  const secondaryB =
    nextgenProject || otherProjects.find((p) => p.slug !== secondaryA.slug) || otherProjects[1] || featured;

  return (
    <section className="space-y-8">
      {/* SECTION HEADER */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
          <span className="inline-block w-4 h-[1px] bg-cyan" />
          <span>MY PROJECTS</span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Featured{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-sky-400 to-blue-500">
            Project
          </span>
        </h2>
        <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-slate-400">
          A selection of my recent work. Each project represents a step in my journey of
          building real-world solutions with modern technologies.
        </p>
      </div>

      {/* FEATURED PROJECT CARD */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan/30 bg-[#070e1c]/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all hover:border-cyan/60 hover:shadow-[0_0_40px_rgba(92,208,255,0.15)]">
        {/* Subtle matrix grid background */}
        <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:gap-10 items-center">
          {/* Left Column: Image with overlay category */}
          <div className="lg:col-span-6 relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-cyan/25 bg-black/60 shadow-2xl group">
            <Image
              src={featured.coverImage || "/projects/saga-elite-cover.png"}
              alt={featured.coverImageAlt || featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Bottom-left overlay pill */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-cyan/30 bg-black/80 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-cyan backdrop-blur-md shadow-lg">
              <Package size={13} className="text-cyan" />
              <span>E-COMMERCE &amp; LIFESTYLE</span>
            </div>
          </div>

          {/* Right Column: Project details */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Badge: Featured Project */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 font-mono text-[11px] font-medium text-cyan">
                <Sparkles size={12} className="fill-cyan" />
                <span>Featured Project</span>
              </div>

              {/* Title */}
              <h3 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {featured.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-slate-300">
                {featured.description}
              </p>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(featured.techStack.length
                  ? featured.techStack
                  : ["React", "Redux Toolkit", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"]
                ).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1 font-mono text-xs text-cyan/90"
                  >
                    {tech}
                  </span>
                ))}
                <span className="rounded-full border border-cyan/20 bg-cyan/5 px-2.5 py-1 font-mono text-xs text-slate-400">
                  +3
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={featured.githubUrl || "https://github.com/HajithMohamed/Saga-Elite-Web-project"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-cyan px-5 py-2.5 font-mono text-xs font-semibold text-black transition-all hover:bg-cyan/90 hover:shadow-[0_0_24px_var(--cyan-glow)]"
              >
                <Github size={15} />
                <span>View on GitHub</span>
              </a>

              {featured.liveUrl ? (
                <a
                  href={featured.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan/40 bg-transparent px-5 py-2.5 font-mono text-xs font-medium text-cyan transition-all hover:border-cyan hover:bg-cyan/10 hover:text-white"
                >
                  <ExternalLink size={14} />
                  <span>Live Demo</span>
                </a>
              ) : (
                <Link
                  href={`/projects/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan/40 bg-transparent px-5 py-2.5 font-mono text-xs font-medium text-cyan transition-all hover:border-cyan hover:bg-cyan/10 hover:text-white"
                >
                  <ExternalLink size={14} />
                  <span>Inspect Dossier</span>
                </Link>
              )}
            </div>

            {/* Metadata row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-cyan/15 font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-cyan/70 shrink-0" />
                <span>2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-cyan/70 shrink-0" />
                <span>4 Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-cyan/70 shrink-0" />
                <span>MERN Stack</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Tag size={14} className="text-cyan/70 shrink-0" />
                <span className="truncate">E-commerce</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY PROJECTS GRID (2-UP) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Secondary Card 1: University Library Management System */}
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-cyan/25 bg-[#070e1c]/80 p-5 backdrop-blur-md transition-all hover:border-cyan/50 hover:shadow-[0_12px_36px_rgba(92,208,255,0.12)]">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-cyan/20 bg-black/50">
            <Image
              src={secondaryA.coverImage || "/projects/university-library-cover.png"}
              alt={secondaryA.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="flex flex-1 flex-col pt-5 space-y-3">
            <h4 className="font-display text-xl font-bold text-white transition-colors group-hover:text-cyan">
              {secondaryA.title}
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 line-clamp-3">
              {secondaryA.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {(secondaryA.techStack.length
                ? secondaryA.techStack
                : ["PHP", "MySQLi", "JavaScript", "Bootstrap", "XAMPP"]
              ).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-cyan/20 bg-cyan/5 px-2.5 py-0.5 font-mono text-[11px] text-cyan/90"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Footer action links */}
            <div className="mt-auto pt-6 flex items-center justify-between border-t border-cyan/15 font-mono text-xs">
              <a
                href={secondaryA.githubUrl || "https://github.com/HajithMohamed/Library-Management-System"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan transition-colors"
              >
                <Github size={14} />
                <span>View on GitHub</span>
              </a>

              <Link
                href={`/projects/${secondaryA.slug}`}
                className="inline-flex items-center gap-1 text-cyan hover:text-white transition-colors"
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Card 2: NEXTGEN Mobile Shop */}
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-cyan/25 bg-[#070e1c]/80 p-5 backdrop-blur-md transition-all hover:border-cyan/50 hover:shadow-[0_12px_36px_rgba(92,208,255,0.12)]">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-cyan/20 bg-black/50">
            <Image
              src={secondaryB.coverImage || "/projects/nextgen-mobile-cover.png"}
              alt={secondaryB.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="flex flex-1 flex-col pt-5 space-y-3">
            <h4 className="font-display text-xl font-bold text-white transition-colors group-hover:text-cyan">
              {secondaryB.title}
            </h4>
            <p className="text-xs leading-relaxed text-slate-400 line-clamp-3">
              {secondaryB.description}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {(secondaryB.techStack.length
                ? secondaryB.techStack
                : ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"]
              ).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-cyan/20 bg-cyan/5 px-2.5 py-0.5 font-mono text-[11px] text-cyan/90"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Footer action links */}
            <div className="mt-auto pt-6 flex items-center justify-between border-t border-cyan/15 font-mono text-xs">
              <a
                href={secondaryB.githubUrl || "https://github.com/HajithMohamed/NEXTGEN---Sri-Lankan-Mobile-Shop-eCommerce-Website"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan transition-colors"
              >
                <Github size={14} />
                <span>View on GitHub</span>
              </a>

              <Link
                href={`/projects/${secondaryB.slug}`}
                className="inline-flex items-center gap-1 text-cyan hover:text-white transition-colors"
              >
                <ExternalLink size={13} />
                <span>Live Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* EXPLORE MORE BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan/30 bg-[#070e1c]/90 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Glowing </> Icon box */}
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-cyan/40 bg-cyan/10 text-cyan shadow-[0_0_24px_var(--cyan-glow)]">
            <Code2 size={24} className="stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
              — EXPLORE MORE
            </div>
            <h3 className="font-display text-2xl font-bold text-white">More Projects</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Check out my other work and get a closer look at what I&apos;ve built with
              different technologies and ideas.
            </p>
          </div>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 shrink-0 rounded-xl border border-cyan/40 bg-cyan/10 px-6 py-3 font-mono text-xs font-semibold text-cyan hover:bg-cyan/20 hover:border-cyan hover:shadow-[0_0_20px_var(--cyan-glow)] transition-all"
        >
          <span>View All Projects</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
