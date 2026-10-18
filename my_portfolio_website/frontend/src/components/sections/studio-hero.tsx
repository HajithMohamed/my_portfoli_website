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
                HZ LABS · Available for Client Projects
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight leading-[1.12]">
              Engineering ideas <br className="hidden sm:inline" />
              into{" "}
              <span className="text-gradient-violet">intelligent</span>{" "}
              <br className="hidden sm:inline" />
              digital products
            </h1>

            {/* Specialty Subtitle Cycling */}
            <div className="h-8 flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentSpecialtyIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-sm sm:text-base text-slate-400 font-medium tracking-wide"
                >
                  {SPECIALTIES[currentSpecialtyIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              {/* Primary Button */}
              <Link
                href="#projects"
                data-track="hero_explore_work"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-medium text-sm shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <span>Explore work</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* Secondary Button */}
              <Link
                href="/about"
                data-track="hero_see_timeline"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full studio-glass-interactive text-slate-200 border border-slate-700/70 hover:border-slate-500 hover:text-white font-medium text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                <span>See my timeline</span>
                <ArrowUpRight
                  size={15}
                  className="text-slate-400 group-hover:text-white transition-colors"
                />
              </Link>
            </div>

            {/* Micro Highlights Pill Row */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-slate-800/80 w-full text-slate-400 font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Verified Public Repos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Code2 size={14} className="text-cyan-400" />
                <span>Clean Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Terminal size={14} className="text-violet-400" />
                <span>Next.js 16 + NestJS + Flutter</span>
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
