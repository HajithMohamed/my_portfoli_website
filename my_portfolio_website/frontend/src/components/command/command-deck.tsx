"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { CvAsset, GithubSummary, Profile } from "@/lib/types";
import { BriefcaseBusiness, FileText, Github, Terminal, ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import gsap from "gsap";

const WorkspaceScene = dynamic(() => import("@/components/command/workspace-scene"), {
  ssr: false,
});

function BootStatusRow({
  label,
  value,
  tone,
  isLive = false,
}: {
  label: string;
  value: string;
  tone: "green" | "amber" | "cyan";
  isLive?: boolean;
}) {
  const toneClass =
    tone === "green"
      ? "text-signal-green"
      : tone === "amber"
        ? "text-signal-amber"
        : "text-cyan";

  const dotBg =
    tone === "green"
      ? "bg-signal-green"
      : tone === "amber"
        ? "bg-signal-amber"
        : "bg-cyan";

  return (
    <div className="boot-status-row flex items-center justify-between border-b border-cyan/10 py-2.5 last:border-0 hover:bg-cyan/5 transition-colors px-2 -mx-2 rounded-sm">
      <span className="text-muted-foreground flex items-center gap-2">
        <span className="text-cyan/40">▸</span>
        {label}
      </span>
      <span className={`flex items-center gap-2 font-semibold tracking-wider ${toneClass}`}>
        <span className="relative flex h-2 w-2 items-center justify-center">
          {isLive && (
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${dotBg}`}
              style={{ animationDuration: "2s" }}
            />
          )}
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dotBg}`} />
        </span>
        {value}
      </span>
    </div>
  );
}

function diagnosticTone(tone?: string): "green" | "amber" | "cyan" {
  if (tone === "green" || tone === "amber") {
    return tone;
  }
  return "cyan";
}

export function CommandDeck({
  profile,
  github,
  resume,
}: {
  profile: Profile;
  github: GithubSummary;
  resume: CvAsset | null;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const device = isDesktop ? "laptop" : isTablet ? "tablet" : "phone";
  const particleCount = isDesktop ? 60 : isTablet ? 30 : 15;
  const currentRepo = github.currentRepo ?? github.contributionData?.currentRepo ?? null;

  const githubLink =
    currentRepo?.url ??
    profile.socialLinks?.find((l) => l.url.includes("github.com"))?.url ??
    `https://github.com/${github.username}`;

  const githubFresh =
    Boolean(github.syncedAt) &&
    Date.now() - new Date(github.syncedAt ?? 0).getTime() < 1000 * 60 * 60 * 24;

  const focus = profile.currentlyExploring?.slice(0, 2).join(" · ") || "Full-stack systems";

  // Boot log lines
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    setSessionId(`vst_${Math.random().toString(36).slice(2, 8)}`);
  }, []);

  const bootLines = useMemo(() => {
    const stamp = (offset: number) => {
      const d = new Date(Date.now() - offset);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };
    return [
      `[${stamp(1600)}] init.core_systems`,
      `[${stamp(1200)}] decrypting.dossier`,
      `[${stamp(800)}] visitor.id=${sessionId ?? "…"}`,
      `[${stamp(400)}] connection.secure=true`,
      `[${stamp(0)}] welcome, operator.`,
    ];
  }, [sessionId]);

  // Master GSAP Boot Sequence Timeline (Capped at 1.6s)
  useEffect(() => {
    if (!sessionId) return;

    const alreadyBooted = typeof window !== "undefined" && Boolean(sessionStorage.getItem("hz_hero_booted"));

    if (prefersReduced || alreadyBooted) {
      // Instant final state
      setLogCount(bootLines.length);
      if (containerRef.current) {
        gsap.set(
          containerRef.current.querySelectorAll(
            ".hero-eyebrow, .hero-name-word, .hero-role, .hero-bio, .hero-cta, .hero-metrics, .hero-right-panel, .boot-status-row"
          ),
          { opacity: 1, y: 0, x: 0, filter: "blur(0px)" }
        );
      }
      return;
    }

    // Set initial state for animated elements
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem("hz_hero_booted", "true");
          } catch {
            // storage may be restricted
          }
        },
      });

      // Stream boot log lines in sync with the 1.6s timeline
      bootLines.forEach((_, idx) => {
        tl.call(() => setLogCount(idx + 1), undefined, idx * 0.28);
      });

      // Choreographed sequence: eyebrow -> name words -> role -> description -> CTA -> metrics & diagnostics
      tl.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        0
      )
        // Per-word blur-and-rise
        .fromTo(
          ".hero-name-word",
          { opacity: 0, y: 16, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.36,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.12
        )
        // Role & Degree
        .fromTo(
          ".hero-role",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          0.32
        )
        // Bio description
        .fromTo(
          ".hero-bio",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          0.48
        )
        // CTA Buttons
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" },
          0.62
        )
        // Bottom quick metrics
        .fromTo(
          ".hero-metrics",
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" },
          0.75
        )
        // Right diagnostics & boot log panels
        .fromTo(
          ".hero-right-panel",
          { opacity: 0, x: 16 },
          { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
          0.4
        )
        // Diagnostics rows staggered at 60ms
        .fromTo(
          ".boot-status-row",
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.22, stagger: 0.06, ease: "power2.out" },
          0.55
        );

      // Total duration is strictly capped at 1.6s
      if (tl.totalDuration() > 1.6) {
        tl.timeScale(tl.totalDuration() / 1.6);
      }
    }, containerRef);

    return () => ctx.revert();
  }, [sessionId, bootLines, prefersReduced]);

  // Pointer parallax on background grid only (Desktop only, damped, max 12px)
  useEffect(() => {
    if (!isDesktop || prefersReduced || !containerRef.current || !gridRef.current) return;

    const grid = gridRef.current;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      targetX = Math.max(-12, Math.min(12, nx * 12));
      targetY = Math.max(-12, Math.min(12, ny * 12));
    };

    const damp = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      grid.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      animId = requestAnimationFrame(damp);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    animId = requestAnimationFrame(damp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, [isDesktop, prefersReduced]);

  const nameWords = PERSONAL_IDENTITY.name.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center border-b border-cyan/15 overflow-hidden"
    >
      {/* Background Effects with pointer parallax on grid only */}
      <div
        ref={gridRef}
        className="absolute inset-0 bg-grid opacity-30 pointer-events-none will-change-transform"
      />
      <div className="absolute left-1/4 top-1/4 w-[50vw] h-[50vw] bg-cyan/10 rounded-full blur-[120px] mix-blend-screen animate-orb pointer-events-none md:w-[40vw] md:h-[40vw]" />
      <div
        className="absolute right-1/4 bottom-1/4 w-[40vw] h-[40vw] bg-violet/10 rounded-full blur-[100px] mix-blend-screen animate-orb pointer-events-none md:w-[30vw] md:h-[30vw]"
        style={{ animationDelay: "-10s" }}
      />

      {/* 3D backdrop */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[42vh] opacity-[0.25] md:inset-0 md:h-auto md:opacity-[0.3] lg:opacity-[0.35]"
        aria-hidden
      >
        <WorkspaceScene
          device={device}
          particleCount={particleCount}
          portraitUrl={profile.profileImageUrl ?? undefined}
        />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-[1400px] px-4 pt-32 pb-16 md:pt-40 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-center">
          {/* Left — identity */}
          <div className="min-w-0 w-full">
            <div className="hero-eyebrow flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] w-full min-w-0">
              <span
                className="flex max-w-full min-w-0 items-center gap-2 text-signal-green bg-signal-green/10 border border-signal-green/20 px-3 py-1 rounded-sm"
                title={profile.availabilityStatus}
              >
                <span className="shrink-0 inline-block h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse-dot" />
                <span className="truncate min-w-0">{profile.availabilityStatus}</span>
              </span>
              <span className="hidden text-muted-foreground sm:inline-block border border-cyan/10 px-3 py-1 rounded-sm shrink-0">
                sys.sector_01
              </span>
            </div>

            {/* Name reveal: per-word blur-and-rise */}
            <h1 className="mt-8 max-w-[640px] font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {nameWords.map((word, i) => (
                <span key={i} className="hero-name-word inline-block mr-3">
                  {word}
                </span>
              ))}
            </h1>

            <div className="hero-role mt-6 space-y-3">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-cyan">
                {PERSONAL_IDENTITY.title}
              </p>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                {PERSONAL_IDENTITY.degree} · {PERSONAL_IDENTITY.faculty}
                <br />
                {PERSONAL_IDENTITY.university}
              </p>
            </div>

            <p className="hero-bio mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg border-l-2 border-cyan/30 pl-4 py-1">
              {profile.bio}
            </p>

            <div className="hero-cta mt-10 flex flex-col sm:flex-row flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.2em]">
              {resume?.fileUrl ? (
                <a
                  href="/api/cv"
                  download
                  data-track="resume_download"
                  className="group relative flex items-center justify-center sm:justify-start gap-3 border border-cyan/50 bg-cyan/10 px-6 py-4 text-cyan transition-all hover:bg-cyan/20 hover:text-glow hover:border-cyan touch-target-lg w-full sm:w-auto"
                >
                  <FileText size={16} className="opacity-70 group-hover:opacity-100" />
                  <span>download cv</span>
                  <span className="absolute inset-0 rounded-[1px] bg-cyan/5 opacity-0 transition-opacity group-hover:opacity-100 animate-pulse" />
                </a>
              ) : null}
              <a
                href="#projects"
                className="group flex items-center justify-center sm:justify-start gap-3 border border-cyan/30 bg-surface/80 backdrop-blur-sm px-6 py-4 text-foreground transition-all hover:border-cyan hover:text-cyan hover:bg-surface-2 touch-target-lg w-full sm:w-auto"
              >
                <Terminal size={16} className="opacity-70" />
                <span>view systems</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="/start-project"
                data-track="project_request_start"
                className="group flex items-center justify-center sm:justify-start gap-3 border border-cyan/60 bg-cyan px-6 py-4 text-slate-950 font-semibold transition-all hover:bg-cyan-soft hover:shadow-[0_0_20px_var(--cyan-glow)] touch-target-lg w-full sm:w-auto"
              >
                <BriefcaseBusiness size={16} />
                <span>request a project</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={githubLink}
                target="_blank"
                rel="noreferrer"
                data-track="github_click"
                className="group flex items-center justify-center sm:justify-start gap-3 border border-cyan/30 bg-surface/80 backdrop-blur-sm px-6 py-4 text-foreground transition-all hover:border-cyan hover:text-cyan hover:bg-surface-2 touch-target-lg w-full sm:w-auto"
              >
                <Github size={16} className="opacity-70 group-hover:text-glow" />
                <span>{currentRepo ? "current repo" : "github"}</span>
              </a>
            </div>

            <div className="hero-metrics mt-12 grid max-w-2xl grid-cols-2 md:grid-cols-3 gap-6 font-mono border-t border-cyan/15 pt-8">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-lg bg-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70 mb-2">
                  response
                </div>
                <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="text-signal-green">⚡</span> &lt; 24h
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-2 rounded-lg bg-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70 mb-2">focus</div>
                <div className="text-sm font-semibold text-foreground text-balance leading-snug">
                  {focus}
                </div>
              </div>
              <div className="relative group col-span-2 md:col-span-1">
                <div className="absolute -inset-2 rounded-lg bg-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70 mb-2">modes</div>
                <div className="text-sm font-semibold text-foreground flex flex-col gap-1">
                  <span>Internship</span>
                  <span className="text-cyan/70">Full-time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — boot status + log tail */}
          <div className="hero-right-panel flex flex-col justify-center gap-8 lg:pl-10 relative z-10 min-w-0 w-full">
            {/* Status Panel */}
            <div className="hud-panel-glass p-6">
              <div className="mb-4 flex items-center gap-3 border-b border-cyan/20 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/70">
                <span className="h-[1px] w-4 bg-cyan/50" />
                System Diagnostics
              </div>
              <div className="font-mono text-[11px]">
                {/* Genuine live states pulse slowly; idle pipeline does not pulse */}
                <BootStatusRow label="sys.core" value="online" tone="green" isLive />
                <BootStatusRow
                  label="github.api"
                  value={githubFresh ? "connected" : "cached"}
                  tone={githubFresh ? "green" : "amber"}
                  isLive={githubFresh}
                />
                <BootStatusRow
                  label="repo.focus"
                  value={currentRepo?.name ?? "auto-detect"}
                  tone={diagnosticTone(currentRepo?.statusTone)}
                  isLive={Boolean(currentRepo)}
                />
                <BootStatusRow label="mailbox" value="accepting" tone="green" isLive />
                <BootStatusRow label="deploy.pipeline" value="idle" tone="amber" isLive={false} />
                <BootStatusRow label="threat.level" value="low" tone="cyan" isLive={false} />
              </div>
            </div>

            {/* Boot Log Panel */}
            <div className="hud-panel corner-brackets p-5">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] border-b border-cyan/15 pb-3">
                <span className="text-cyan flex items-center gap-2">
                  <Terminal size={14} />
                  boot_log
                </span>
                <span className="text-signal-green bg-signal-green/10 px-2 py-0.5 rounded-sm flex items-center gap-1">
                  <span className="inline-block h-1 w-1 rounded-full bg-signal-green animate-pulse-dot" />
                  streaming
                </span>
              </div>
              <div className="mt-4 min-h-[90px] space-y-1.5 font-mono text-[11px] text-muted-foreground">
                {bootLines.slice(0, logCount).map((line, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-cyan/40 shrink-0">❯</span>
                    <span className={i === logCount - 1 ? "text-foreground font-medium" : ""}>
                      {line}
                    </span>
                  </div>
                ))}
                {logCount < bootLines.length && (
                  <span className="ml-5 inline-block h-[14px] w-2 translate-y-0.5 bg-cyan animate-typing-cursor" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient border bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-60" />
    </section>
  );
}
