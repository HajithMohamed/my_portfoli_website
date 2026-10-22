"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Github, CheckCircle2, ArrowRight } from "lucide-react";

export function BioSection() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8 lg:p-10 backdrop-blur-2xl shadow-2xl"
      aria-label="About Mohamed Hajith"
    >
      {/* Cybernetic circuit line accents matching reference design */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="30%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 50,20 L 140,20 L 160,40 L 400,40"
            fill="none"
            stroke="url(#circuit-grad)"
            strokeWidth="1"
          />
          <circle cx="160" cy="40" r="2.5" fill="#6366f1" />
          <path
            d="M 1000,120 L 880,120 L 860,100 L 700,100"
            fill="none"
            stroke="url(#circuit-grad)"
            strokeWidth="1"
          />
          <circle cx="860" cy="100" r="2.5" fill="#38bdf8" />
          <path
            d="M 120,240 L 220,240 L 240,220 L 600,220"
            fill="none"
            stroke="url(#circuit-grad)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          
          {/* Left: Glowing Portrait Card + Main Statement */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 flex-1">
            
            {/* Portrait with cybernetic bracket & glowing neon border */}
            <div className="relative shrink-0 p-1.5 sm:p-2">
              {/* Subtle cybernetic corner bracket */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-lg pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-lg pointer-events-none" />
              
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-3xl overflow-hidden ring-2 ring-indigo-500/70 shadow-[0_0_35px_rgba(99,102,241,0.35)] bg-slate-900">
                <Image
                  src="/brand/mohamed-hajith-v3.png"
                  alt="Mohamed Hajith"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>

              {/* Online status indicator */}
              <div
                className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#080b18] ring-4 ring-[#080b18] shadow-lg shadow-emerald-500/30"
                title="Active & Available"
              >
                <span className="h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
              </div>
            </div>

            {/* Bio text & Credibility badges */}
            <div className="space-y-4 flex-1">
              <p className="font-sans text-xl sm:text-2xl md:text-[25px] leading-relaxed text-slate-200 font-light">
                I&apos;m{" "}
                <span className="font-bold text-white tracking-tight">
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
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0d1224] border border-slate-800 text-slate-300">
                  <GraduationCap size={13} className="text-violet-400" />
                  <span>BICT (Hons) Undergraduate</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0d1224] border border-slate-800 text-emerald-400">
                  <CheckCircle2 size={13} />
                  <span>Verified Public Code</span>
                </span>
                <a
                  href="https://github.com/HajithMohamed"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0d1224] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Github size={13} />
                  <span>@HajithMohamed</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Action: FULL PROFILE -> */}
          <div className="shrink-0 self-start lg:self-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900 border border-indigo-500/50 hover:border-indigo-400 text-white font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.45)]"
            >
              <span>Full Profile</span>
              <ArrowRight size={14} className="text-indigo-300" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
