"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Github, CheckCircle2, ArrowRight } from "lucide-react";

export function BioSection() {
  return (
    <section
      className="py-10 md:py-14 border-y border-slate-800/60 bg-slate-950/40 relative"
      aria-label="About Mohamed Hajith"
    >
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Main Statement */}
          <div className="space-y-4">
            <p className="font-sans text-xl sm:text-2xl md:text-[26px] leading-relaxed text-slate-200 font-light">
              I&apos;m{" "}
              <span className="font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300">
                Mohamed Hajith
              </span>
              , a software engineer pursuing a{" "}
              <span className="text-slate-100 font-normal">BICT (Hons)</span>.{" "}
              <span className="text-slate-300">
                HZ Labs is where I design and build software for clients — every project here links to its public repository.
              </span>
            </p>

            {/* Credibility badges */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-xs text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                <GraduationCap size={13} className="text-violet-400" />
                <span>BICT (Hons) Undergraduate</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-emerald-400">
                <CheckCircle2 size={13} />
                <span>Client-Verified Delivery</span>
              </span>
              <a
                href="https://github.com/HajithMohamed"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              >
                <Github size={13} />
                <span>@HajithMohamed</span>
              </a>
            </div>
          </div>

          {/* Quick link button to full about profile */}
          <div className="shrink-0">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full studio-glass-interactive text-slate-300 hover:text-white border border-slate-700/80 text-xs font-mono uppercase tracking-wider transition-all hover:scale-105"
            >
              <span>Full Profile</span>
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
