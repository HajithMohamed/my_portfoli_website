import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
    <section className={cn("hud-panel corner-brackets", className)}>
      <header className="flex items-center justify-between gap-3 border-b border-cyan/15 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em]">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="shrink-0 text-cyan">◉ {label}</span>
          {subtitle ? (
            <span className="truncate text-muted-foreground">— {subtitle}</span>
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
      <div className={bodyClassName ?? "p-4"}>{children}</div>
    </section>
  );
}
