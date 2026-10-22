"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Terminal, Code2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ArchitectureVisualization } from "./architecture-visualization";

const SPECIALTIES = [
  "+ Full-Stack Dev · Cloud & Mobile Architecture",
  "+ High-Performance APIs · Scalable Backend Systems",
  "+ Cross-Platform Flutter Apps · Realtime Platforms",
  "+ Modern Next.js 16 & React 19 Architectures",
];

export function StudioHero() {
  const [currentSpecialtyIndex, setCurrentSpecialtyIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSpecialtyIndex((prev) => (prev + 1) % SPECIALTIES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32 overflow-hidden"
      aria-label="HZ Labs Studio Introduction"
    >
      {/* Background radial gradients for ambient studio glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-violet-600/10 via-cyan-500/5 to-transparent blur-3xl -z-10" />

      <div className="container-responsive">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action Triggers */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full studio-glass border border-slate-700/60 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                Mohamed Hajith · BICT (Hons) · Open to Internships
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight leading-[1.1]">
                Mohamed Hajith
              </h1>
              <p className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-gradient-violet">
                Full-Stack Software Developer | Backend &amp; Database Engineering
              </p>
            </div>

            {/* Bio & Academic Specialization */}
            <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
              Third-year BICT (Hons) undergraduate at the University of Ruhuna. I build practical web applications, secure REST APIs, and database-driven business systems using React, Next.js, Node.js, and PostgreSQL.
            </p>

            {/* Availability Notice */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.08] text-xs font-mono text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open to software engineering internships, junior development opportunities, and selected freelance projects.</span>
            </div>

            {/* CTA Buttons: View Engineering Projects, Download CV, plus secondary Hire HZ Labs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
              {/* Primary Action 1: View Engineering Projects */}
              <Link
                href="#projects"
                data-track="hero_view_projects"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <span>View Engineering Projects</span>
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* Primary Action 2: Download CV */}
              <a
                href="/api/cv"
                download
                data-track="hero_download_cv"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full studio-glass-interactive text-slate-200 border border-slate-700/70 hover:border-cyan/50 hover:text-white font-medium text-xs sm:text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <span>Download CV</span>
                <ArrowUpRight
                  size={15}
                  className="text-slate-400 group-hover:text-white transition-colors"
                />
              </a>

              {/* Secondary Action: Hire HZ Labs */}
              <Link
                href="/start-project"
                data-track="hero_hire_hzlabs"
                className="group inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-slate-400 hover:text-cyan font-mono text-xs uppercase tracking-wider transition-colors w-full sm:w-auto text-center"
              >
                <span>Hire HZ Labs</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Micro Highlights Pill Row */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-slate-800/80 w-full text-slate-400 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>BICT (Hons) Undergraduate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Code2 size={14} className="text-cyan-400" />
                <span>Backend &amp; Database Design</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Terminal size={14} className="text-violet-400" />
                <span>React · Next.js · Node.js · PostgreSQL</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Architecture Visualization */}
          <div className="lg:col-span-5 flex items-center justify-center w-full">
            <ArchitectureVisualization />
          </div>

        </div>
      </div>
    </section>
  );
}
