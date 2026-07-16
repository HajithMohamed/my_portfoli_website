"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

/**
 * HUD panel — the core container of the JARVIS console design.
 * Header: "◉ LABEL — SUBTITLE" left, LIVE badge or custom actions right.
 */
export function Panel({
  label,
  subtitle,
  live,
  actions,
  bodyClassName,
  className,
  children,
}: {
  label: string;
  subtitle?: string;
  live?: boolean;
  actions?: ReactNode;
  bodyClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("hud-panel-glow corner-brackets group transition-all duration-500 hover:border-cyan/40", className)}
    >
      <header className="flex items-center justify-between gap-3 border-b border-cyan/15 bg-black/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur-md">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="shrink-0 text-cyan text-glow group-hover:text-cyan">◉ {label}</span>
          {subtitle ? (
            <span className="truncate text-muted-foreground transition-colors group-hover:text-cyan/70">— {subtitle}</span>
          ) : null}
        </div>
        {live ? (
          <span className="flex shrink-0 items-center gap-1.5 text-signal-green">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse-dot" />
            live
          </span>
        ) : (
          actions
        )}
      </header>
      <div className={cn("relative z-10", bodyClassName ?? "p-5")}>{children}</div>
    </motion.section>
  );
}
