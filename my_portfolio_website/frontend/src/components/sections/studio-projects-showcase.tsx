"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Github, Sparkles, Terminal, Code2, Layers, Cpu, Radio } from "lucide-react";
import type { Project } from "@/lib/types";

interface StudioProjectsShowcaseProps {
  projects?: Project[];
}

export function StudioProjectsShowcase({ projects = [] }: StudioProjectsShowcaseProps) {
  // Locate specific projects if present in the data, with fallback to curated high-fidelity content
  const footwearProject = projects.find(
    (p) =>
      p.slug.includes("shoe") ||
      p.slug.includes("footwear") ||
      p.title.toLowerCase().includes("footwear") ||
      p.title.toLowerCase().includes("shoe")
  );

  const voiceProject = projects.find(
    (p) =>
      p.slug.includes("voice") ||
      p.slug.includes("goyo") ||
      p.title.toLowerCase().includes("voice")
  );

  const portfolioProject = projects.find(
    (p) =>
      p.slug.includes("portfolio") ||
      p.slug.includes("hzlabs") ||
      p.title.toLowerCase().includes("portfolio")
  );

  const techBridgeProject = projects.find(
    (p) =>
      p.slug.includes("tech-bridge") ||
      p.slug.includes("tech_bridge") ||
      p.title.toLowerCase().includes("tech bridge")
  );

  return (
    <section id="work" className="space-y-8 scroll-mt-24">
      {/* SECTION HEADER — Lovable Studio Aesthetic */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            <span>SELECTED WORK</span>
          </div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Featured projects
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            Real-world systems, client applications, and open-source infrastructure engineered for performance and scale.
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

      {/* 1. HERO FEATURED PROJECT — Footwear Business Management System (Shoe Bank) */}
      <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_40px_rgba(245,158,11,0.12)]">
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-96 rounded-full bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-transparent blur-3xl opacity-70 transition-opacity group-hover:opacity-100" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Visual Architectural Diagram */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Visual Header Graphic: Isometric Architectural Blueprint */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-amber-500/20 bg-black/40 flex items-center justify-center p-6 group-hover:border-amber-500/40 transition-colors">
              <svg
                viewBox="0 0 600 320"
                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Grid */}
                <pattern id="hero-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="0.8" />
                </pattern>
                <rect width="600" height="320" fill="url(#hero-grid)" />

                {/* Isometric Cube 1 (Left - Ingestion & Import) */}
                <g transform="translate(100, 110)">
                  {/* Top Face */}
                  <polygon points="60,0 120,30 60,60 0,30" fill="rgba(245, 158, 11, 0.06)" stroke="#f59e0b" strokeWidth="1.5" />
                  {/* Left Face */}
                  <polygon points="0,30 60,60 60,120 0,90" fill="rgba(245, 158, 11, 0.03)" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1.2" />
                  {/* Right Face */}
                  <polygon points="60,60 120,30 120,90 60,120" fill="rgba(245, 158, 11, 0.08)" stroke="rgba(245, 158, 11, 0.7)" strokeWidth="1.2" />
                  <text x="60" y="35" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace" letterSpacing="1">IMPORT</text>
                  <text x="60" y="48" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="monospace">CLEARANCE</text>
                </g>

                {/* Connection Path 1 to 2 */}
                <path d="M 220 170 L 260 145" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />

                {/* Isometric Cube 2 (Center - Core Landed Cost Engine) */}
                <g transform="translate(240, 70)">
                  {/* Top Face Glowing */}
                  <polygon points="70,0 140,35 70,70 0,35" fill="rgba(245, 158, 11, 0.15)" stroke="#fbbf24" strokeWidth="2" />
                  {/* Left Face */}
                  <polygon points="0,35 70,70 70,140 0,105" fill="rgba(245, 158, 11, 0.07)" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="1.5" />
                  {/* Right Face */}
                  <polygon points="70,70 140,35 140,105 70,140" fill="rgba(245, 158, 11, 0.12)" stroke="rgba(245, 158, 11, 0.8)" strokeWidth="1.5" />
                  
                  {/* Center Node Indicator */}
                  <circle cx="70" cy="35" r="4" fill="#fbbf24" className="animate-ping" opacity="0.8" />
                  <circle cx="70" cy="35" r="3" fill="#ffffff" />
                  <text x="70" y="48" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="monospace" letterSpacing="1.5">SHOE BANK</text>
                  <text x="70" y="60" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="8" fontFamily="monospace">LEDGER &amp; COGS</text>
                </g>

                {/* Connection Path 2 to 3 */}
                <path d="M 380 145 L 420 170" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />

                {/* Isometric Cube 3 (Right - Sales & Credit Ledger) */}
                <g transform="translate(390, 110)">
                  {/* Top Face */}
                  <polygon points="60,0 120,30 60,60 0,30" fill="rgba(245, 158, 11, 0.06)" stroke="#f59e0b" strokeWidth="1.5" />
                  {/* Left Face */}
                  <polygon points="0,30 60,60 60,120 0,90" fill="rgba(245, 158, 11, 0.03)" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="1.2" />
                  {/* Right Face */}
                  <polygon points="60,60 120,30 120,90 60,120" fill="rgba(245, 158, 11, 0.08)" stroke="rgba(245, 158, 11, 0.7)" strokeWidth="1.2" />
                  <text x="60" y="35" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace" letterSpacing="1">CREDIT SALES</text>
                  <text x="60" y="48" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="monospace">PROFIT VS CASH</text>
                </g>

                {/* Baseline Metrics Bar */}
                <g transform="translate(100, 265)">
                  <rect width="410" height="26" rx="4" fill="rgba(0,0,0,0.6)" stroke="rgba(245, 158, 11, 0.25)" />
                  <text x="25" y="17" fill="#f59e0b" fontSize="9" fontFamily="monospace">STATUS: ACTIVE INVOICE SNAPSHOT</text>
                  <text x="260" y="17" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace">LATENCY &lt; 45ms</text>
                  <circle cx="15" cy="13" r="3" fill="#10b981" />
                </g>
              </svg>

              {/* Tag in graphic */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded border border-amber-500/30 bg-black/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-amber-400 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Architecture // Landed Cost Engine</span>
              </div>
            </div>
          </div>

          {/* Right Column: Project Story & Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              {/* Badge strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                  <Sparkles size={11} />
                  <span>Featured Platform</span>
                </span>
                <span className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Wholesale ERP
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-amber-300">
                Footwear Business Management System
              </h3>

              {/* Abstract */}
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Wholesale management platform designed for the footwear industry. Solves the critical distinction between revenue and collected cash, tracking inventory, landed costs, customer credit ledgers, and cheque clearance on aging hardware and erratic networks.
              </p>

              {/* Technology Stack Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["PHP", "MySQL", "Tailwind CSS", "Alpine.js", "Docker"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-amber-500/20 bg-amber-500/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-300/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
              <a
                href={footwearProject?.githubUrl || "https://github.com/HajithMohamed/Footwear_Business_Management_System"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-500/60"
              >
                <Github size={13} />
                <span>Repository</span>
                <ExternalLink size={11} />
              </a>

              <Link
                href="/projects/shoe-bank"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:border-amber-500/40 hover:text-amber-300"
              >
                <span>Case Study</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECONDARY 2-COLUMN FEATURED GRID (Goyo Voice & HZ Labs) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card A: Goyo Elite Voice Project */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_35px_rgba(139,92,246,0.12)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl opacity-60 group-hover:opacity-100" />

          <div>
            {/* Visual Header: Audio Wave Frequency Graph */}
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-xl border border-violet-500/20 bg-black/40 flex items-center justify-center p-4 group-hover:border-violet-500/40 transition-colors">
              <svg viewBox="0 0 400 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Horizontal Center Axis */}
                <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(139, 92, 246, 0.2)" strokeDasharray="3 3" />
                
                {/* Wave 1: Ambient Low */}
                <path
                  d="M 0 80 Q 50 120 100 80 T 200 80 T 300 80 T 400 80"
                  stroke="rgba(139, 92, 246, 0.25)"
                  strokeWidth="1.5"
                  fill="none"
                />

                {/* Wave 2: Resonant Voice Frequency */}
                <path
                  d="M 0 80 Q 40 40 80 80 T 160 80 T 240 40 T 320 120 T 400 80"
                  stroke="#a78bfa"
                  strokeWidth="2"
                  fill="none"
                  className="animate-pulse"
                />

                {/* Wave 3: Harmonic Peak */}
                <path
                  d="M 40 80 C 70 20, 110 20, 140 80 S 210 140, 240 80 S 310 20, 360 80"
                  stroke="#c084fc"
                  strokeWidth="2.5"
                  fill="none"
                  filter="drop-shadow(0 0 8px rgba(192, 132, 252, 0.4))"
                />

                {/* Frequency Peak Nodes */}
                <circle cx="100" cy="40" r="4" fill="#c084fc" />
                <circle cx="275" cy="40" r="4" fill="#a78bfa" />
                <circle cx="190" cy="120" r="3.5" fill="#818cf8" />

                {/* Audio Telemetry Tag */}
                <g transform="translate(15, 128)">
                  <rect width="160" height="20" rx="3" fill="rgba(0,0,0,0.7)" stroke="rgba(139, 92, 246, 0.3)" />
                  <text x="10" y="14" fill="#c084fc" fontSize="8" fontFamily="monospace">SAMPLE RATE // 48kHz PCM</text>
                </g>
              </svg>

              <div className="absolute top-3 left-3 rounded border border-violet-500/30 bg-black/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-violet-300">
                Voice AI
              </div>
            </div>

            {/* Title & Description */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="rounded border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-violet-300">
                  FEATURED
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">Conversational Intelligence</span>
              </div>
              <h4 className="mt-2 font-display text-xl font-bold text-foreground group-hover:text-violet-300 transition-colors">
                Goyo Elite Voice Project
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                Voice AI assistant and interface for modern applications using deep-learning speech recognition, real-time waveform processing, and low-latency response models.
              </p>

              {/* Tech Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Python", "Voice AI", "PyTorch", "FastAPI", "WebAudio"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-violet-500/20 bg-violet-500/[0.05] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-violet-300"
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
              href="https://github.com/HajithMohamed/goyo-voice"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-300 hover:text-violet-200 transition-colors"
            >
              <Github size={12} />
              <span>Repository</span>
              <ExternalLink size={10} />
            </a>

            <Link
              href="/projects"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>View Details</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        {/* Card B: HZ Labs Portfolio Platform */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-cyan/20 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.12)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-cyan/10 blur-3xl opacity-60 group-hover:opacity-100" />

          <div>
            {/* Visual Header: Illuminated IDE / Browser Frame */}
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-xl border border-cyan/20 bg-black/40 flex flex-col justify-between p-3.5 group-hover:border-cyan/40 transition-colors">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-cyan/15 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-500/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[9px] text-cyan/70">hzlabs.studio // v2.0-redesign</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Terminal Snippet */}
              <div className="space-y-1 font-mono text-[10px] text-slate-300 py-1">
                <div className="text-cyan/80">&gt; next build --turbopack</div>
                <div className="text-muted-foreground">✓ Compiled 29 routes in 6.3s</div>
                <div className="text-muted-foreground">✓ NestJS REST Gateway connected</div>
                <div className="text-emerald-400">✓ GitHub telemetry sync active</div>
              </div>

              <div className="flex items-center justify-between font-mono text-[8px] text-cyan/50 border-t border-cyan/10 pt-1.5">
                <span>PORT: 3000 // APPS/WEB</span>
                <span>LATENCY: 12ms</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="rounded border border-cyan/30 bg-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan">
                  FEATURED
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">Engineering Portfolio</span>
              </div>
              <h4 className="mt-2 font-display text-xl font-bold text-foreground group-hover:text-cyan transition-colors">
                HZ Labs Portfolio Platform
              </h4>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                The current production portfolio platform built with Next.js App Router, Tailwind CSS, and NestJS REST backend with Prisma, JWT auth, and automatic GitHub telemetry.
              </p>

              {/* Tech Badges */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Next.js 16", "React 19", "TypeScript", "NestJS", "Prisma"].map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-cyan/20 bg-cyan/[0.05] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan"
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
              href="https://github.com/HajithMohamed/my_portfoli_website"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-cyan hover:text-cyan-soft transition-colors"
            >
              <Github size={12} />
              <span>Repository</span>
              <ExternalLink size={10} />
            </a>

            <a
              href="https://hzlabs.studio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Live Platform</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* 3. CURRENTLY BUILDING SUB-SECTION */}
      <div className="pt-4 space-y-4">
        {/* Section divider with amber pulse */}
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-400">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-semibold">Currently building</span>
        </div>

        {/* 2-Column Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Medical Lab System */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-amber-300">
                CURRENTLY BUILDING
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">Healthcare SaaS</span>
            </div>

            <h4 className="mt-3 font-display text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">
              Medical Laboratory Business Automation
            </h4>

            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Automated specimen tracking, pathology test report generation, customer notification gateway, and doctor consultation portal.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"].map((tech) => (
                <span key={tech} className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="font-mono text-[10px] text-emerald-400/80">● Milestone: Report Dispatch</span>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan hover:underline"
              >
                <span>Track Progress</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>

          {/* Card 2: Tech Bridge Platform */}
          <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md transition-all hover:border-cyan/40 hover:bg-white/[0.04]">
            <div className="flex items-center justify-between">
              <span className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-amber-300">
                CURRENTLY BUILDING
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">Collaboration Hub</span>
            </div>

            <h4 className="mt-3 font-display text-lg font-bold text-foreground group-hover:text-cyan transition-colors">
              Tech Bridge Collaboration Network
            </h4>

            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Developer network connecting university software engineering projects with industry mentors, automated peer reviews, and milestone evaluation.
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {["React", "Node.js", "Express", "MongoDB"].map((tech) => (
                <span key={tech} className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="font-mono text-[10px] text-cyan/80">● Active GitHub Repository</span>
              <a
                href={techBridgeProject?.githubUrl || "https://github.com/HajithMohamed/Tech_Bridge"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan hover:underline"
              >
                <Github size={11} />
                <span>Repository</span>
                <ExternalLink size={9} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
