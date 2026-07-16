"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV = [
  ["home", "/"],
  ["projects", "/projects"],
  ["about", "/about"],
  ["signal", "/blog"],
  ["comms", "/#comms"],
] as const;

const VERSION = "v4.0.0";

function useClock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Colombo",
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function TopBar({ location = "Colombo, LK" }: { location?: string }) {
  const pathname = usePathname();
  const clock = useClock();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-cyan/15 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-transparent border-transparent pt-2"
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 font-mono">
        <Link href="/" className="group flex shrink-0 items-center gap-2 text-sm transition-transform hover:scale-105 active:scale-95">
          <span className="relative flex h-2 w-2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-green"></span>
          </span>
          <span className="font-semibold tracking-widest text-foreground group-hover:text-glow">HZ LABS</span>
          <span className="text-[10px] text-cyan/60 hidden sm:inline-block">/ {VERSION}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-[11px] uppercase tracking-[0.2em]">
          {NAV.map(([label, href]) => {
            const active =
              href === "/"
                ? pathname === "/"
                : href.startsWith("/#")
                  ? false
                  : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative px-4 py-2 text-muted-foreground transition-colors hover:text-cyan group"
              >
                <span className="relative z-10">{label}</span>
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-md bg-cyan/10 border border-cyan/20"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {!active && (
                  <span className="absolute inset-0 rounded-md bg-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Diagnostic */}
        <div className="hidden shrink-0 items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:flex">
          <span className="hidden lg:inline-block text-cyan/70">{location}</span>
          <span className="font-semibold tabular-nums text-foreground bg-surface-2 px-2 py-1 rounded border border-cyan/10">
            {clock ? `${clock} LK` : "--:--:-- LK"}
          </span>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-50 p-2 text-cyan hover:bg-cyan/10 rounded-md transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-cyan/15 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 font-mono text-sm uppercase tracking-[0.2em]">
              {NAV.map(([label, href]) => {
                const active =
                  href === "/"
                    ? pathname === "/"
                    : href.startsWith("/#")
                      ? false
                      : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 py-3 border-b border-cyan/10 last:border-0",
                      active ? "text-cyan text-glow" : "text-muted-foreground"
                    )}
                  >
                    <span className="text-cyan/50">▸</span> {label}
                  </Link>
                );
              })}
            </nav>
            <div className="bg-surface-2/50 px-4 py-3 flex justify-between items-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>{location}</span>
              <span className="text-cyan">{clock ? `${clock} LK` : "--:--:-- LK"}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
