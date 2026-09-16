"use client";

import { useTheme } from "./theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Toggle theme. Current palette: ${theme}`}
      title={`Current palette: ${theme}. Click to switch to ${theme === "jarvis" ? "ember" : "jarvis"}.`}
      className={`group relative inline-flex items-center gap-2 rounded-sm border border-cyan/25 bg-surface/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm transition-all hover:border-cyan hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan ${className}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_6px_var(--cyan)] transition-colors"
        aria-hidden="true"
      />
      <span className="text-cyan/70 transition-colors group-hover:text-cyan">
        theme:
      </span>
      <span className="font-semibold text-foreground">
        {mounted ? theme : "jarvis"}
      </span>
    </button>
  );
}
