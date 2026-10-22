"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sparkles, Github, FileText, Award } from "lucide-react";
import { PERSONAL_IDENTITY } from "@/lib/identity";

export interface NavItem {
  label: string;
  href: string;
  isSection?: boolean;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/#projects", isSection: true },
  { label: "About", href: "/#about", isSection: true },
  { label: "Skills", href: "/#skills", isSection: true },
  { label: "Activity", href: "/#telemetry", isSection: true },
  { label: "Services", href: "/#services", isSection: true },
  { label: "Contact", href: "/#comms", isSection: true },
];

export const SECONDARY_NAV_ITEMS = [
  { label: "Blog", href: "/blog", icon: FileText },
  { label: "Certificates", href: "/certificates", icon: Award },
  { label: "GitHub", href: "https://github.com/HajithMohamed", icon: Github, external: true },
] as const;

export function TopBar({ location = PERSONAL_IDENTITY.location }: { location?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("Home");
  const drawerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for header elevation and background styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section observer on homepage
  useEffect(() => {
    if (pathname !== "/") {
      if (pathname.startsWith("/projects")) {
        setActiveSection("Work");
      } else if (pathname.startsWith("/about")) {
        setActiveSection("About");
      } else if (pathname.startsWith("/start-project")) {
        setActiveSection("Start a Project");
      } else {
        setActiveSection("");
      }
      return;
    }

    const sections = [
      { id: "projects", label: "Work" },
      { id: "about", label: "About" },
      { id: "skills", label: "Skills" },
      { id: "telemetry", label: "Activity" },
      { id: "services", label: "Services" },
      { id: "comms", label: "Contact" },
    ];

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const match = sections.find((s) => s.id === visible.target.id);
          if (match) {
            setActiveSection(match.label);
            return;
          }
        }
        if (window.scrollY < 200) {
          setActiveSection("Home");
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScrollTop = () => {
      if (window.scrollY < 200) {
        setActiveSection("Home");
      }
    };
    window.addEventListener("scroll", handleScrollTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollTop);
    };
  }, [pathname]);

  // Lock body scroll when mobile menu is open
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
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    },
    [mobileMenuOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const isNavActive = (item: NavItem) => {
    if (!pathname) return false;
    if (pathname === "/" && item.href === "/") {
      return activeSection === "Home";
    }
    if (pathname === "/" && item.isSection) {
      return activeSection === item.label;
    }
    if (item.label === "About" && pathname.startsWith("/about")) {
      return true;
    }
    if (item.label === "Work" && pathname.startsWith("/projects")) {
      return true;
    }
    if (item.label === "Services" && pathname.startsWith("/services")) {
      return true;
    }
    return false;
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/[0.08] bg-[#070a14]/85 backdrop-blur-xl shadow-lg shadow-black/40 py-3"
            : "border-b border-transparent bg-transparent py-4 sm:py-5"
        )}
      >
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            aria-label="HZ Labs Homepage"
          >
            {/* Geometric Studio Mark */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-violet-600/20 via-surface-2 to-cyan/20 shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-colors group-hover:border-cyan/40">
              <span className="h-2 w-2 rounded-sm bg-gradient-to-tr from-cyan via-violet to-fuchsia-400 shadow-[0_0_8px_var(--cyan)]" />
              <div className="absolute inset-0 rounded-lg bg-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-bold tracking-tight text-white sm:text-lg">
                  HZ LABS
                </span>
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan" />
                </span>
              </div>
              <span className="hidden font-mono text-[9px] uppercase tracking-widest text-slate-400 sm:inline-block">
                Digital Product Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-[#0c101c]/60 p-1 backdrop-blur-xl shadow-inner shadow-black/40"
          >
            {PRIMARY_NAV_ITEMS.map((item) => {
              const active = isNavActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-1.5 text-xs font-medium tracking-wide transition-colors",
                    active
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-full bg-white/[0.1] border border-white/[0.14] shadow-[0_0_15px_rgba(255,255,255,0.06)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action CTA Button: Start a Project */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/start-project"
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 overflow-hidden",
                pathname === "/start-project"
                  ? "bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.5)] border border-white/20"
                  : "bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-cyan-500/90 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-[1.02] active:scale-[0.98] border border-violet-400/30"
              )}
            >
              <Sparkles size={13} className="text-cyan transition-transform group-hover:rotate-12" />
              <span>Start a Project</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="lg:hidden relative z-[60] flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Full Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={drawerRef}
            key="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-40 flex flex-col border-b border-white/[0.08] bg-[#070a14]/95 pt-24 pb-8 px-6 backdrop-blur-2xl shadow-2xl lg:hidden"
          >
            {/* Primary Navigation Links */}
            <nav aria-label="Mobile Primary Navigation" className="flex flex-col space-y-2">
              {PRIMARY_NAV_ITEMS.map((item, idx) => {
                const active = isNavActive(item);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-all",
                        active
                          ? "bg-white/[0.08] text-white border border-white/[0.12] shadow-sm shadow-purple-500/10"
                          : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      <span>{item.label}</span>
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Prominent CTA in Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.2 }}
              className="mt-6 pt-4 border-t border-white/[0.08]"
            >
              <Link
                href="/start-project"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 py-3.5 px-6 font-semibold uppercase tracking-wider text-white shadow-lg shadow-purple-600/30 active:scale-[0.98]"
              >
                <Sparkles size={16} className="text-cyan" />
                <span>Start a Project</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Secondary Links & Studio Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.2 }}
              className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400"
            >
              <div className="flex items-center gap-4">
                {SECONDARY_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    target={"external" in item && item.external ? "_blank" : undefined}
                    rel={"external" in item && item.external ? "noreferrer" : undefined}
                    className="flex items-center gap-1 hover:text-cyan transition-colors"
                  >
                    <item.icon size={13} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="font-mono text-[10px] uppercase tracking-wider text-slate-500 hover:text-slate-300"
              >
                Admin
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
