"use client";

import { useEffect, useState, useCallback } from "react";
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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close on ESC key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [mobileMenuOpen, handleKeyDown]);

  return (
    <>
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
            <span className="font-semibold tracking-widest text-foreground group-hover:text-glow">Hz LABS</span>
            <span className="text-[10px] text-cyan/60 hidden sm:inline-block">/ {VERSION}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-[11px] uppercase tracking-[0.2em]">
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

          {/* Tablet Nav — compact, shown md–lg */}
          <nav className="hidden md:flex lg:hidden items-center gap-0.5 text-[10px] uppercase tracking-[0.15em]">
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
                    "relative px-2.5 py-2 transition-colors",
                    active ? "text-cyan" : "text-muted-foreground hover:text-cyan"
                  )}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="activeNavTablet"
                      className="absolute bottom-0 left-1 right-1 h-[2px] bg-cyan rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Diagnostic */}
          <div className="hidden shrink-0 items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:flex">
            <span className="text-cyan/70">{location}</span>
            <span className="font-semibold tabular-nums text-foreground bg-surface-2 px-2 py-1 rounded border border-cyan/10">
              {clock ? `${clock} LK` : "--:--:-- LK"}
            </span>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden relative z-[60] flex items-center justify-center h-11 w-11 text-cyan hover:bg-cyan/10 rounded-md transition-colors touch-target"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[320px] bg-background/98 backdrop-blur-xl border-l border-cyan/15 shadow-2xl shadow-black/50 md:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-cyan/15">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-green"></span>
                  </span>
                  <span className="font-semibold tracking-widest text-foreground">Hz LABS</span>
                  <span className="text-[10px] text-cyan/60">/ {VERSION}</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center h-10 w-10 rounded-md border border-cyan/20 bg-surface-2/50 text-cyan hover:bg-cyan/10 transition-colors touch-target"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 flex flex-col px-4 py-6 font-mono text-sm uppercase tracking-[0.2em] overflow-y-auto">
                {NAV.map(([label, href], i) => {
                  const active =
                    href === "/"
                      ? pathname === "/"
                      : href.startsWith("/#")
                        ? false
                        : pathname.startsWith(href);
                  return (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-3 py-4 rounded-md transition-all touch-target-lg",
                          active
                            ? "text-cyan bg-cyan/10 border border-cyan/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface-2/50"
                        )}
                      >
                        <span className={cn(
                          "text-[10px] font-mono w-5",
                          active ? "text-cyan" : "text-cyan/40"
                        )}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">{label}</span>
                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="border-t border-cyan/15 bg-surface-2/30 px-6 py-4 space-y-3"
              >
                <div className="flex justify-between items-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>{location}</span>
                  <span className="text-cyan tabular-nums">{clock ? `${clock} LK` : "--:--:-- LK"}</span>
                </div>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
                <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-cyan/40 text-center">
                  — end of nav —
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
