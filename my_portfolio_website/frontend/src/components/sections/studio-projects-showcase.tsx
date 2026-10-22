"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Sparkles, Terminal, Code2, Layers, ShieldCheck, Database, CheckCircle2 } from "lucide-react";
import type { Project } from "@/lib/types";

interface StudioProjectsShowcaseProps {
  projects?: Project[];
}

export function StudioProjectsShowcase({ projects = [] }: StudioProjectsShowcaseProps) {
  // Locate specific projects dynamically with graceful fallbacks
  const sagaProject = projects.find(
    (p) => p.slug.includes("saga") || p.title.toLowerCase().includes("saga")
  );

  const benchBookProject = projects.find(
    (p) =>
      p.slug.includes("benchbook") ||
      p.slug.includes("medical-lab") ||
      p.title.toLowerCase().includes("benchbook") ||
      p.title.toLowerCase().includes("laboratory resource")
  );

  const bloodBridgeProject = projects.find(
    (p) => p.slug.includes("bloodbridge") || p.title.toLowerCase().includes("bloodbridge")
  );

  const portfolioProject = projects.find(
    (p) =>
      p.slug.includes("hzlabs") ||
      p.slug.includes("portfolio") ||
      p.title.toLowerCase().includes("hz labs") ||
      p.title.toLowerCase().includes("portfolio")
  );

  const shoeBankProject = projects.find(
    (p) =>
      p.slug.includes("shoe") ||
      p.slug.includes("footwear") ||
      p.title.toLowerCase().includes("shoe") ||
      p.title.toLowerCase().includes("footwear")
  );

  return (
    <section id="work" className="space-y-8 scroll-mt-24">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            <span>SELECTED WORK // ENGINEERING SHOWCASE</span>
          </div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Featured projects
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Real-world systems, database-driven business applications, and open-source infrastructure demonstrating software engineering skills.
          </p>
        </div>

        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground transition-all hover:border-cyan/40 hover:bg-cyan/[0.08] hover:text-cyan shrink-0"
        >
          <span>Explore All Repositories</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 1. HERO FEATURED PROJECT — Saga Elite (Full-Stack E-Commerce) */}
      <div className="group relative overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.14)]">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-96 rounded-full bg-gradient-to-b from-violet-500/15 via-indigo-500/5 to-transparent blur-3xl opacity-70 transition-opacity group-hover:opacity-100" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Visual Architectural Diagram */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-violet-500/25 bg-black/50 flex items-center justify-center p-6 group-hover:border-violet-500/40 transition-colors">
              <svg
                viewBox="0 0 600 320"
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Grid */}
                <pattern id="saga-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(139, 92, 246, 0.08)" strokeWidth="0.8" />
                </pattern>
                <rect width="600" height="320" fill="url(#saga-grid)" />

                {/* Node 1: React & Redux Client */}
                <g transform="translate(60, 100)">
                  <polygon points="55,0 110,28 55,56 0,28" fill="rgba(99, 102, 241, 0.12)" stroke="#818cf8" strokeWidth="1.5" />
                  <polygon points="0,28 55,56 55,110 0,82" fill="rgba(99, 102, 241, 0.06)" stroke="rgba(129, 140, 248, 0.5)" strokeWidth="1.2" />
                  <polygon points="55,56 110,28 110,82 55,110" fill="rgba(99, 102, 241, 0.1)" stroke="rgba(129, 140, 248, 0.7)" strokeWidth="1.2" />
                  <text x="55" y="32" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontFamily="monospace" letterSpacing="1">REACT CLIENT</text>
                  <text x="55" y="44" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="monospace">REDUX TOOLKIT</text>
                </g>

                {/* Path 1 -> 2 */}
                <path d="M 175 155 L 225 135" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />

                {/* Node 2: Node.js & Express API Gateway (Center) */}
                <g transform="translate(210, 65)">
                  <polygon points="70,0 140,35 70,70 0,35" fill="rgba(139, 92, 246, 0.2)" stroke="#c084fc" strokeWidth="2" />
                  <polygon points="0,35 70,70 70,140 0,105" fill="rgba(139, 92, 246, 0.1)" stroke="rgba(192, 132, 252, 0.6)" strokeWidth="1.5" />
                  <polygon points="70,70 140,35 140,105 70,140" fill="rgba(139, 92, 246, 0.15)" stroke="rgba(192, 132, 252, 0.8)" strokeWidth="1.5" />
                  <circle cx="70" cy="35" r="4" fill="#c084fc" className="animate-ping" opacity="0.8" />
                  <circle cx="70" cy="35" r="3" fill="#ffffff" />
                  <text x="70" y="48" textAnchor="middle" fill="#f5f3ff" fontSize="10" fontWeight="bold" fontFamily="monospace" letterSpacing="1">SAGA ELITE</text>
                  <text x="70" y="60" textAnchor="middle" fill="#c084fc" fontSize="8" fontFamily="monospace">NODE / EXPRESS API</text>
                </g>

                {/* Path 2 -> 3 */}
                <path d="M 355 135 L 405 155" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />

                {/* Node 3: MongoDB & Socket.IO */}
                <g transform="translate(390, 100)">
                  <polygon points="55,0 110,28 55,56 0,28" fill="rgba(16, 185, 129, 0.12)" stroke="#34d399" strokeWidth="1.5" />
                  <polygon points="0,28 55,56 55,110 0,82" fill="rgba(16, 185, 129, 0.06)" stroke="rgba(52, 211, 153, 0.5)" strokeWidth="1.2" />
                  <polygon points="55,56 110,28 110,82 55,110" fill="rgba(16, 185, 129, 0.1)" stroke="rgba(52, 211, 153, 0.7)" strokeWidth="1.2" />
                  <text x="55" y="32" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace" letterSpacing="1">MONGODB</text>
                  <text x="55" y="44" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="monospace">SOCKET.IO EVENTS</text>
                </g>

                {/* Baseline Metrics Bar */}
                <g transform="translate(60, 265)">
                  <rect width="470" height="26" rx="4" fill="rgba(0,0,0,0.7)" stroke="rgba(139, 92, 246, 0.3)" />
                  <text x="25" y="17" fill="#c084fc" fontSize="9" fontFamily="monospace">ARCHITECTURE: 4-PERSON TEAM LEADERSHIP</text>
                  <text x="320" y="17" fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">TESTS: PLAYWRIGHT CI</text>
                  <circle cx="15" cy="13" r="3" fill="#10b981" />
                </g>
              </svg>

              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded border border-violet-500/30 bg-black/80 px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-violet-300 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
                <span>Architecture // Event-Driven E-Commerce</span>
              </div>
            </div>
          </div>

          {/* Right Column: Project Story & Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              {/* Badge strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded border border-violet-500/40 bg-violet-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider text-violet-300">
                  <Sparkles size={11} />
                  <span>Team Leadership · Top Featured</span>
                </span>
                <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  E-Commerce Platform
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-violet-300">
                Saga Elite — Full-Stack E-Commerce Platform
              </h3>

              {/* Abstract */}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Collaborative e-commerce platform built by a four-member team for a Sri Lankan fashion brand. Features scheduled release drops, JWT authentication, Socket.IO stock updates, OCR-assisted payment receipt verification, and automated Playwright test suites.
              </p>

              {/* Technology Stack Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["React", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Socket.IO", "Playwright", "GitHub Actions"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-violet-500/25 bg-violet-500/[0.06] px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-violet-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
              <a
                href={sagaProject?.githubUrl || "https://github.com/Hz-Labs-studio/Saga-Elite-Web-project"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-violet-300 transition-all hover:bg-violet-500/20 hover:border-violet-500/60"
              >
                <Github size={13} />
                <span>Repository</span>
                <ExternalLink size={11} />
              </a>

              <a
                href="https://saga-elite.shop/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-300 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/60"
              >
                <span>Live Website</span>
                <ExternalLink size={11} />
              </a>

              <Link
                href="/projects/saga-elite"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:border-violet-500/40 hover:text-violet-300"
              >
                <span>Case Study</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECONDARY 2-COLUMN GRID: BenchBook & BloodBridge */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Card A: BenchBook — Laboratory Resource Reservation System */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-cyan/25 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.14)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-cyan/10 blur-3xl opacity-60 group-hover:opacity-100" />

          <div>
            {/* Visual Frame */}
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-xl border border-cyan/20 bg-black/50 flex flex-col justify-between p-3.5 group-hover:border-cyan/40 transition-colors">
              <div className="flex items-center justify-between border-b border-cyan/15 pb-2">
                <div className="flex items-center gap-1.5">
                  <Database size={13} className="text-cyan" />
                  <span className="font-mono text-xs text-cyan font-semibold">PostgreSQL Relational Constraints</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                  VITEST VERIFIED
                </span>
              </div>

              <div className="space-y-1 font-mono text-xs text-slate-300 py-1">
                <div className="text-cyan">&gt; prisma migrate status</div>
                <div className="text-muted-foreground">✓ EXCLUDE USING GIST (equipment_id WITH =, reservation_period WITH &amp;&amp;)</div>
                <div className="text-emerald-400">✓ Zero overlapping reservations guaranteed at DB level</div>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-cyan/60 border-t border-cyan/10 pt-1.5">
                <span>WORKFLOW: MAINTENANCE BLACKOUTS</span>
                <span>STACK: NEXT.JS + PRISMA</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="rounded border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-cyan">
                  DATABASE CASE STUDY
                </span>
                <span className="font-mono text-xs text-muted-foreground">Laboratory Scheduling</span>
              </div>
              <h4 className="mt-2 font-display text-xl font-bold text-foreground group-hover:text-cyan transition-colors">
                BenchBook — Laboratory Resource Reservation System
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Database-driven resource reservation platform for managing laboratory equipment. Enforces non-overlapping scheduling constraints directly in PostgreSQL to prevent double-booking, with maintenance blackout workflows and Vitest automated suites.
              </p>

              {/* Tech Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Vitest", "Tailwind CSS"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-cyan/20 bg-cyan/[0.05] px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-cyan"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <a
              href={benchBookProject?.githubUrl || "https://github.com/HajithMohamed/Medical-Lab-Resource-Reservation-System"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-cyan hover:text-cyan-soft transition-colors"
            >
              <Github size={12} />
              <span>Repository</span>
              <ExternalLink size={10} />
            </a>

            <Link
              href="/projects/benchbook"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Case Study</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Card B: BloodBridge — Advanced Database System (ADBMS) */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-xl transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_0_35px_rgba(244,63,94,0.14)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl opacity-60 group-hover:opacity-100" />

          <div>
            {/* Visual Frame */}
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-xl border border-rose-500/20 bg-black/50 flex flex-col justify-between p-3.5 group-hover:border-rose-500/40 transition-colors">
              <div className="flex items-center justify-between border-b border-rose-500/15 pb-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-rose-400" />
                  <span className="font-mono text-xs text-rose-300 font-semibold">PL/pgSQL Transaction Procedures</span>
                </div>
                <span className="font-mono text-[11px] text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded">
                  ACADEMIC PROTOTYPE
                </span>
              </div>

              <div className="space-y-1 font-mono text-xs text-slate-300 py-1">
                <div className="text-rose-300">&gt; git log -1 --grep=&quot;PR #7&quot;</div>
                <div className="text-muted-foreground">✓ Merged pre-handoff architecture &amp; database contract</div>
                <div className="text-emerald-400">✓ Atomic transfer integrity &amp; institution authorization</div>
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-rose-400/60 border-t border-rose-500/10 pt-1.5">
                <span>COURSEWORK: ADBMS</span>
                <span>STATUS: DEMONSTRATION PROTOTYPE</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="rounded border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-rose-300">
                  ADVANCED DATABASE SYSTEM
                </span>
                <span className="font-mono text-xs text-amber-400">Academic Prototype</span>
              </div>
              <h4 className="mt-2 font-display text-xl font-bold text-foreground group-hover:text-rose-300 transition-colors">
                BloodBridge — Advanced Database Management System
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                Collaborative academic prototype for blood donation registries and inventory management. Contributed core database architecture, PL/pgSQL stored procedures, and atomic transaction safeguards via merged PR #7. Academic demonstration, not clinical software.
              </p>

              {/* Tech Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["PostgreSQL", "PL/pgSQL", "React", "Node.js", "Docker", "GitHub Actions"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-rose-500/20 bg-rose-500/[0.05] px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-rose-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href={bloodBridgeProject?.githubUrl || "https://github.com/akalanka001/-BloodBridge--ADBMS"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-rose-300 hover:text-rose-200 transition-colors"
              >
                <Github size={12} />
                <span>Repo</span>
                <ExternalLink size={10} />
              </a>

              <a
                href="https://github.com/akalanka001/-BloodBridge--ADBMS/pull/7"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-amber-400 hover:underline"
              >
                <span>Merged PR #7</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <Link
              href="/projects/bloodbridge"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Case Study</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

      </div>

      {/* 3. TERTIARY 2-COLUMN GRID: HZ Labs Platform & Shoe Bank (Wholesale BMS) */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Card C: HZ Labs Portfolio Platform */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_35px_rgba(99,102,241,0.14)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl opacity-60 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between">
              <span className="rounded border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-indigo-300">
                FULL-STACK &amp; CMS
              </span>
              <span className="font-mono text-xs text-muted-foreground">90+ Automated Tests</span>
            </div>

            <h4 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-indigo-300 transition-colors">
              HZ Labs Portfolio &amp; Content Management Platform
            </h4>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Independently engineered full-stack portfolio platform built with Next.js App Router, NestJS REST backend, Prisma, and PostgreSQL. Features authenticated administration, live GitHub synchronization, and automated testing suites.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Next.js", "NestJS", "TypeScript", "Prisma", "PostgreSQL", "Vitest", "Tailwind CSS"].map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-indigo-500/20 bg-indigo-500/[0.05] px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-indigo-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href={portfolioProject?.githubUrl || "https://github.com/HajithMohamed/my_portfoli_website"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                <Github size={12} />
                <span>Repo</span>
                <ExternalLink size={10} />
              </a>
              <a
                href="https://www.hzlabs.studio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Live Site</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <Link
              href="/projects/hzlabs-studio"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Case Study</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Card D: Shoe Bank (Footwear BMS) - Pure PHP & MySQL */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.14)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl opacity-60 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between">
              <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-amber-300">
                WHOLESALE ERP // PHP &amp; MYSQL
              </span>
              <span className="font-mono text-xs text-muted-foreground">Business Systems</span>
            </div>

            <h4 className="mt-3 font-display text-xl font-bold text-foreground group-hover:text-amber-300 transition-colors">
              Shoe Bank — Footwear Business Management System
            </h4>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Wholesale ERP engineered for the footwear industry using PHP and MySQL. Accurately calculates landed cost per invoice, manages customer credit ledgers, tracks cheque clearance, and cleanly separates paper profit from cash collected.
            </p>

            {/* STRICTLY PHP/MySQL stack - NO MERN tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["PHP", "MySQL", "Tailwind CSS", "Alpine.js", "Docker"].map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-amber-500/20 bg-amber-500/[0.06] px-2 py-0.5 font-mono text-xs uppercase tracking-wider text-amber-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <a
              href={shoeBankProject?.githubUrl || "https://github.com/HajithMohamed/Footwear_Business_Management_System"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-colors"
            >
              <Github size={12} />
              <span>Repository</span>
              <ExternalLink size={10} />
            </a>

            <Link
              href="/projects/shoe-bank"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Case Study</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

      </div>

      {/* Complete Archive Callout */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] font-mono text-xs text-muted-foreground">
        <p>
          Also exploring TechBridge (Student Opportunity &amp; Collaboration), University Library (PHP MVC), and Spring Boot services.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-cyan hover:underline font-semibold uppercase tracking-wider text-xs"
        >
          <span>View complete project directory</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}
