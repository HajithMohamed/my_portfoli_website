"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { CvAsset, GithubSummary, Profile } from "@/lib/types";

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
      `[${stamp(2000)}] hero.deck mounted · 6 nodes`,
      `[${stamp(1000)}] visitor.session_id=${sessionId ?? "…"}`,
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
    }, 450);
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
    <div className="flex items-center justify-between border-b border-cyan/10 py-2 last:border-0">
      <span className="text-muted-foreground">
        <span className="text-cyan/60">▸ </span>
        {label}
      </span>
      <span className={`flex items-center gap-2 ${toneClass}`}>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" />
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

  const githubLink =
    profile.socialLinks?.find((l) => l.url.includes("github.com"))?.url ??
    `https://github.com/${github.username}`;

  const githubFresh =
    github.syncedAt &&
    Date.now() - new Date(github.syncedAt).getTime() < 1000 * 60 * 60 * 24;

  const focus = profile.currentlyExploring?.slice(0, 2).join(" · ") || "Full-stack systems";

  return (
    <section className="relative overflow-hidden border-b border-cyan/15">
      {/* 3D backdrop — desktop only; on small screens it fights the content */}
      <div className="pointer-events-none absolute inset-0 hidden opacity-60 lg:block" aria-hidden>
        <WorkspaceScene />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        {/* Left — identity */}
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
            <span className="flex items-center gap-2 text-signal-green">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse-dot" />
              {profile.availabilityStatus}
            </span>
            <span className="hidden text-muted-foreground sm:inline">· sector 01</span>
          </div>

          <h1 className="mt-6 font-display text-6xl font-bold tracking-tight text-foreground text-glow sm:text-7xl md:text-8xl">
            HZ LABS
          </h1>

          <div className="mt-3">
            <div className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
              {profile.name}
            </div>
            <div className="mt-1 font-mono text-sm uppercase tracking-[0.2em] text-cyan">
              Software Engineer · Full Stack Developer · Founder of HZ Labs
            </div>
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {profile.bio}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.2em]">
            {resume?.fileUrl ? (
              <a
                href={resume.fileUrl}
                data-track="resume_download"
                className="border border-cyan/50 bg-cyan/10 px-5 py-3 text-cyan transition-all hover:bg-cyan/20 hover:text-glow"
              >
                {"> download cv"}
              </a>
            ) : null}
            <a
              href="#projects"
              className="border border-cyan/30 bg-surface/60 px-5 py-3 text-foreground transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              {"> view systems"} <span aria-hidden>→</span>
            </a>
            <a
              href={githubLink}
              target="_blank"
              rel="noreferrer"
              data-track="github_click"
              className="border border-cyan/30 bg-surface/60 px-5 py-3 text-foreground transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              {"> github"}
            </a>
            <a
              href="#comms"
              className="border border-cyan/30 bg-surface/60 px-5 py-3 text-foreground transition-colors hover:border-cyan/60 hover:text-cyan"
            >
              {"> open comms"}
            </a>
          </div>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-cyan/15 pt-5 font-mono">
            <div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">response</div>
              <div className="mt-1 text-sm font-semibold text-foreground">&lt; 24h</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">focus</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{focus}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">modes</div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                Internship · Full-time
              </div>
            </div>
          </div>
        </div>

        {/* Right — boot status + log tail */}
        <div className="flex flex-col justify-center gap-6">
          <div className="font-mono text-xs">
            <BootStatusRow label="sys.core" value="online" tone="green" />
            <BootStatusRow
              label="github.api"
              value={githubFresh ? "connected" : "cached"}
              tone={githubFresh ? "green" : "amber"}
            />
            <BootStatusRow label="mailbox" value="accepting" tone="green" />
            <BootStatusRow label="deploy.pipeline" value="idle" tone="amber" />
            <BootStatusRow label="threat.level" value="low" tone="cyan" />
            <BootStatusRow label="version" value="v4.0.0" tone="green" />
          </div>

          <div className="hud-panel corner-brackets p-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
              <span className="text-cyan">◉ log tail</span>
              <span className="text-signal-green">streaming</span>
            </div>
            <div className="mt-3 min-h-[72px] space-y-1 font-mono text-[11px] text-muted-foreground">
              {log.map((line, i) => (
                <div key={i} className="animate-ticker">
                  {line}
                </div>
              ))}
              <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-cyan animate-flicker" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
