"use client";

import Link from "next/link";
import {
  Globe,
  Smartphone,
  ShoppingBag,
  Server,
  LayoutDashboard,
  Cpu,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
} from "lucide-react";
import { SERVICES_CATALOG, ServiceDefinition } from "@/lib/services-catalog";

const ICON_MAP = {
  Globe,
  Smartphone,
  ShoppingBag,
  Server,
  LayoutDashboard,
  Cpu,
};

const COLOR_CLASSES = {
  cyan: {
    border: "border-cyan/20 hover:border-cyan/50",
    glow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.12)]",
    badge: "border-cyan/30 bg-cyan/10 text-cyan",
    iconBg: "bg-cyan/10 text-cyan",
    accent: "text-cyan",
  },
  violet: {
    border: "border-violet-500/20 hover:border-violet-500/50",
    glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    iconBg: "bg-violet-500/10 text-violet-400",
    accent: "text-violet-300",
  },
  amber: {
    border: "border-amber-500/20 hover:border-amber-500/50",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.12)]",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    iconBg: "bg-amber-500/10 text-amber-400",
    accent: "text-amber-300",
  },
  emerald: {
    border: "border-emerald-500/20 hover:border-emerald-500/50",
    glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    iconBg: "bg-emerald-500/10 text-emerald-400",
    accent: "text-emerald-300",
  },
  rose: {
    border: "border-rose-500/20 hover:border-rose-500/50",
    glow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.12)]",
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    iconBg: "bg-rose-500/10 text-rose-400",
    accent: "text-rose-300",
  },
  purple: {
    border: "border-purple-500/20 hover:border-purple-500/50",
    glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]",
    badge: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    iconBg: "bg-purple-500/10 text-purple-400",
    accent: "text-purple-300",
  },
};

export function ServicesShowcase() {
  return (
    <section id="services" className="space-y-8 scroll-mt-24">
      {/* SECTION HEADER — Matching Approved Lovable Reference */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            <span>SERVICES</span>
          </div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            What I build
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-xl">
            End-to-end engineering from client concept to production deployment. Every service is backed by authentic project implementations.
          </p>
        </div>

        <Link
          href="/services"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-foreground transition-all hover:border-cyan/40 hover:bg-cyan/[0.08] hover:text-cyan shrink-0"
        >
          <span>Full Services Catalog</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 3x2 SERVICE MODULES GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES_CATALOG.map((service, index) => {
          const Icon = ICON_MAP[service.iconName as keyof typeof ICON_MAP] ?? Layers;
          const styles = COLOR_CLASSES[service.color] ?? COLOR_CLASSES.cyan;

          return (
            <div
              key={service.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 ${styles.border} ${styles.glow}`}
            >
              <div>
                {/* Header: Icon & Category Index */}
                <div className="flex items-center justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 ${styles.iconBg}`}>
                    <Icon size={20} />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
                    0{index + 1} //
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="mt-5 font-display text-xl font-bold text-foreground transition-colors group-hover:text-white">
                  {service.title}
                </h3>

                {/* Plain-Language Subtitle */}
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {service.subtitle}
                </p>

                {/* Tech Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {service.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {service.techStack.length > 4 && (
                    <span className="rounded border border-white/10 bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground/60">
                      +{service.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <Link
                  href={`/start-project?service=${service.id}`}
                  className={`inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors ${styles.accent} hover:underline`}
                >
                  <span>Build this</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={`/services#${service.id}`}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>Scope</span>
                  <ExternalLink size={10} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
