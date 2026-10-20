import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Terminal, ArrowRight } from "lucide-react";
import { TopBar } from "@/components/shell/top-bar";
import { CommandFooter } from "@/components/shell/command-footer";
import { getHomeData } from "@/lib/public-data";
import { BlogCatalogueView } from "@/components/blog/blog-catalogue-view";

export const metadata = {
  title: "Engineering Insights & System Notes | HZ Labs Studio",
  description:
    "Technical notes, distributed system design considerations, landed-cost workflows, and software architecture by Mohamed Hajith.",
};

export default async function BlogIndexPage() {
  const { profile, blogs } = await getHomeData();

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-cyan/20 selection:text-cyan">
      <TopBar location={profile.location} />

      <main className="relative z-10 pt-20 pb-28">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 space-y-14">
          
          {/* Header Banner */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-12 backdrop-blur-2xl shadow-2xl">
            <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-cyan/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 space-y-5 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/[0.08] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan backdrop-blur-md">
                <Terminal size={12} className="text-cyan animate-pulse" />
                <span>TECHNICAL WRITING // SIGNAL.LOG</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                Engineering <span className="bg-gradient-to-r from-cyan via-indigo-300 to-purple-400 bg-clip-text text-transparent">Dispatches</span> &amp; Architecture Notes
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                First-principles explorations in full-stack system architecture, inventory reconciliation engines, transactional integrity, and scalable cloud application design.
              </p>
            </div>
          </section>

          {/* Interactive Articles Grid */}
          <BlogCatalogueView initialPosts={blogs} />

          {/* Technical Consultation CTA Strip */}
          <section className="rounded-2xl border border-cyan/30 bg-gradient-to-r from-cyan/10 via-indigo-950/30 to-purple-950/20 p-6 sm:p-10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
                <Sparkles size={12} />
                <span>STUDIO COLLABORATION</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Have a challenging systems challenge?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Whether you need distributed database design, inventory tracking, or modern full-stack web applications, let&apos;s talk scope.
              </p>
            </div>
            <Link
              href="/start-project?service=architecture-consultation"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-indigo-500 px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-95 transition-opacity"
            >
              <span>Initiate Project Scope</span>
              <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </main>

      <CommandFooter profile={profile} />
    </div>
  );
}
