"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Github, CheckCircle2, ArrowRight } from "lucide-react";

export function BioSection() {
  return (
    <section
      className="py-10 md:py-14 border-y border-slate-800/60 bg-slate-950/40 relative"
      aria-label="About Mohamed Hajith"
    >
      <div className="container-responsive">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Profile photo + Main Statement */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-7 flex-1">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-2 ring-violet-500/30 shadow-xl shadow-violet-500/10 bg-slate-900">
                <Image
                  src="/brand/mohamed-hajith-avatar.png"
                  alt="Mohamed Hajith"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  priority
                />
              </div>
              <span
                className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 ring-2 ring-slate-950"
                title="Active & Available"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
            </div>

            <div className="space-y-3.5 flex-1">
              <p className="font-sans text-xl sm:text-2xl md:text-[25px] leading-relaxed text-slate-200 font-light">
                I&apos;m{" "}
                <span className="font-semibold text-white bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300">
                  Mohamed Hajith
                </span>
                , a third-year{" "}
                <span className="text-slate-100 font-normal">BICT (Hons)</span> undergraduate at the University of Ruhuna.{" "}
                <span className="text-slate-300">
                  I build practical web applications, secure REST APIs, and database-driven business systems — with verified code on GitHub.
                </span>
              </p>

              {/* Credibility badges */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 font-mono text-xs text-slate-400 pt-0.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
                  <GraduationCap size={13} className="text-violet-400" />
                  <span>BICT (Hons) Undergraduate</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-emerald-400">
                  <CheckCircle2 size={13} />
                  <span>Verified Public Code</span>
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
          </div>

          {/* Quick link button to full about profile */}
          <div className="shrink-0 self-start md:self-center">
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
