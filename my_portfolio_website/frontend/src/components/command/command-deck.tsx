"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";
import type { CvAsset, GithubSummary, Profile } from "@/lib/types";
import { FileText, Github, Terminal, ArrowRight } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";

const WorkspaceScene = dynamic(() => import("@/components/command/workspace-scene"), {
  ssr: false,
});

function useBootLog() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setSessionId(`vst_${Math.random().toString(36).slice(2, 8)}`);
  }, []);

  const lines = useMemo(() => {
    const stamp = (offset: number) => {
      const d = new Date(Date.now() - offset);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };
    return [
      `[${stamp(2000)}] init.core_systems`,
      `[${stamp(1500)}] decrypting.dossier`,
      `[${stamp(1000)}] visitor.id=${sessionId ?? "…"}`,
      `[${stamp(500)}] connection.secure=true`,
      `[${stamp(0)}] welcome, operator.`,
    ];
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    setVisible(0);
    const id = setInterval(() => {
      setVisible((v) => {
        if (v >= lines.length) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, 350);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return lines.slice(0, visible);
}

function BootStatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "green" | "amber" | "cyan";
}) {
  const toneClass =
    tone === "green"
      ? "text-signal-green"
      : tone === "amber"
        ? "text-signal-amber"
        : "text-cyan";
  return (
    <div className="flex items-center justify-between border-b border-cyan/10 py-2.5 last:border-0 hover:bg-cyan/5 transition-colors px-2 -mx-2 rounded-sm">
      <span className="text-muted-foreground flex items-center gap-2">
        <span className="text-cyan/40">▸</span>
        {label}
      </span>
      <span className={`flex items-center gap-2 font-semibold tracking-wider ${toneClass}`}>
        <span className="relative flex h-2 w-2 items-center justify-center">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${tone === 'green' ? 'bg-signal-green' : tone === 'amber' ? 'bg-signal-amber' : 'bg-cyan'}`}></span>
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${tone === 'green' ? 'bg-signal-green' : tone === 'amber' ? 'bg-signal-amber' : 'bg-cyan'}`}></span>
        </span>
        {value}
      </span>
    </div>
  );
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
  const log = useBootLog();

  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  const device = isDesktop ? "laptop" : isTablet ? "tablet" : "phone";
  const particleCount = isDesktop ? 60 : isTablet ? 30 : 15;

  const githubLink =
    profile.socialLinks?.find((l) => l.url.includes("github.com"))?.url ??
    `https://github.com/${github.username}`;

  const githubFresh =
    github.syncedAt &&
    Date.now() - new Date(github.syncedAt).getTime() < 1000 * 60 * 60 * 24;

  const focus = profile.currentlyExploring?.slice(0, 2).join(" · ") || "Full-stack systems";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center border-b border-cyan/15 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute left-1/4 top-1/4 w-[50vw] h-[50vw] bg-cyan/10 rounded-full blur-[120px] mix-blend-screen animate-orb pointer-events-none md:w-[40vw] md:h-[40vw]" />
      <div className="absolute right-1/4 bottom-1/4 w-[40vw] h-[40vw] bg-violet/10 rounded-full blur-[100px] mix-blend-screen animate-orb pointer-events-none md:w-[30vw] md:h-[30vw]" style={{ animationDelay: '-10s' }} />

      {/* 3D backdrop — responsive */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.25] md:opacity-[0.3] lg:opacity-[0.35]" aria-hidden>
        <WorkspaceScene device={device} particleCount={particleCount} />
      </div>

      <div className="relative z-10 w-full mx-auto max-w-[1400px] px-4 pt-32 pb-16 md:pt-40 lg:pt-32">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-center"
        >
          {/* Left — identity */}
          <div>
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] w-full min-w-0">
              <span className="flex max-w-full min-w-0 items-center gap-2 text-signal-green bg-signal-green/10 border border-signal-green/20 px-3 py-1 rounded-sm" title={profile.availabilityStatus}>
                <span className="shrink-0 inline-block h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse-dot" />
                <span className="truncate min-w-0">{profile.availabilityStatus}</span>
              </span>
              <span className="hidden text-muted-foreground sm:inline-block border border-cyan/10 px-3 py-1 rounded-sm shrink-0">sys.sector_01</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="mt-8 font-display font-bold tracking-tight text-gradient text-hero relative"
            >
              Hz LABS
            </motion.h1>

            <motion.div variants={itemVariants} className="mt-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <div className="font-display text-3xl font-semibold text-foreground">
                {profile.name}
              </div>
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-cyan flex items-center gap-2">
                <span className="text-cyan/40">/</span> {profile.title}
              </div>
            </motion.div>

            <motion.p variants={itemVariants} className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg border-l-2 border-cyan/30 pl-4 py-1">
              {profile.bio}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.2em]">
              {resume?.fileUrl ? (
                <a
                  href={resume.fileUrl}
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
                href={githubLink}
                target="_blank"
                rel="noreferrer"
                data-track="github_click"
                className="group flex items-center justify-center sm:justify-start gap-3 border border-cyan/30 bg-surface/80 backdrop-blur-sm px-6 py-4 text-foreground transition-all hover:border-cyan hover:text-cyan hover:bg-surface-2 touch-target-lg w-full sm:w-auto"
              >
                <Github size={16} className="opacity-70 group-hover:text-glow" />
                <span>github</span>
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 grid max-w-2xl grid-cols-2 md:grid-cols-3 gap-6 font-mono border-t border-cyan/15 pt-8">
              <div className="relative group">
                <div className="absolute -inset-2 rounded-lg bg-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70 mb-2">response</div>
                <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="text-signal-green">⚡</span> &lt; 24h
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-2 rounded-lg bg-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70 mb-2">focus</div>
                <div className="text-sm font-semibold text-foreground text-balance leading-snug">{focus}</div>
              </div>
              <div className="relative group col-span-2 md:col-span-1">
                <div className="absolute -inset-2 rounded-lg bg-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70 mb-2">modes</div>
                <div className="text-sm font-semibold text-foreground flex flex-col gap-1">
                  <span>Internship</span>
                  <span className="text-cyan/70">Full-time</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — boot status + log tail */}
          <motion.div variants={itemVariants} className="flex flex-col justify-center gap-8 lg:pl-10 relative z-10">
            {/* Status Panel */}
            <div className="hud-panel-glass p-6">
              <div className="mb-4 flex items-center gap-3 border-b border-cyan/20 pb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/70">
                <span className="h-[1px] w-4 bg-cyan/50" />
                System Diagnostics
              </div>
              <div className="font-mono text-[11px]">
                <BootStatusRow label="sys.core" value="online" tone="green" />
                <BootStatusRow
                  label="github.api"
                  value={githubFresh ? "connected" : "cached"}
                  tone={githubFresh ? "green" : "amber"}
                />
                <BootStatusRow label="mailbox" value="accepting" tone="green" />
                <BootStatusRow label="deploy.pipeline" value="idle" tone="amber" />
                <BootStatusRow label="threat.level" value="low" tone="cyan" />
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
                {log.map((line, i) => (
                  <div key={i} className="animate-ticker flex items-start gap-2">
                    <span className="text-cyan/40 shrink-0">❯</span>
                    <span className={i === log.length - 1 ? "text-foreground" : ""}>{line}</span>
                  </div>
                ))}
                {log.length > 0 && (
                  <span className="ml-5 inline-block h-[14px] w-2 translate-y-0.5 bg-cyan animate-typing-cursor" />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative gradient border bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-60" />
    </section>
  );
}
