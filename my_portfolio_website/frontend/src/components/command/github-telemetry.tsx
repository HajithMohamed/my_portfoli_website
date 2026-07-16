"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/hud/panel";
import { computeStreak, heatmapLevels, languageShares } from "@/lib/github-insights";
import type { GithubSummary } from "@/lib/types";
import { motion } from "framer-motion";

const LEVEL_BG = [
  "rgba(92,208,255,0.03)",
  "rgba(92,208,255,0.2)",
  "rgba(92,208,255,0.45)",
  "rgba(92,208,255,0.75)",
  "rgba(92,208,255,1)",
];

function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 1500;
    const startTime = Date.now();
    
    const tick = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  
  return <>{count.toLocaleString()}</>;
}

function Stat({ label, value, numValue, accent }: { label: string; value: string | React.ReactNode; numValue?: number; accent?: boolean }) {
  return (
    <div className="group relative overflow-hidden rounded-md border border-cyan/15 bg-surface-2/40 p-3 transition-colors hover:border-cyan/30 hover:bg-surface-2">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10 text-[9px] uppercase tracking-[0.25em] text-cyan/60 transition-colors group-hover:text-cyan">{label}</div>
      <div
        className={`relative z-10 mt-1.5 font-display text-2xl font-bold tabular-nums ${accent ? "text-cyan text-glow" : "text-foreground group-hover:text-cyan/90"}`}
      >
        {numValue !== undefined ? <AnimatedCounter value={numValue} /> : value}
      </div>
    </div>
  );
}

export function GithubTelemetry({ github }: { github: GithubSummary }) {
  const contributions = github.contributionData?.totalContributions ?? github.commitCount;
  const streak = computeStreak(github);
  const stars = github.contributionData?.totalStars ?? 0;
  const followers = github.contributionData?.followers;
  
  // Need to ensure heatmap is properly sized for grid
  const rawHeatmap = heatmapLevels(github, 14); 
  const heatmap = rawHeatmap.length ? rawHeatmap : Array(14 * 7).fill(0);
  
  const languages = languageShares(github, 3); // Reduced to 3 to fit better in height

  return (
    <Panel label="github.telemetry" subtitle={`@${github.username}`} live className="h-full">
      <div className="flex h-full flex-col justify-between gap-5">
        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <Stat label="commits/yr" value={contributions.toLocaleString()} numValue={contributions} />
          <Stat label="streak" value={`${streak}d`} accent />
          <Stat label="repos" value={github.repositoryCount.toString()} numValue={github.repositoryCount} />
          <Stat label="stars" value={stars.toLocaleString()} numValue={stars} />
        </div>

        {heatmap.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
              <span className="text-cyan/70">contribution matrix</span>
              <span className="text-[9px] text-muted-foreground">{heatmap.length} days</span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] rounded-md border border-cyan/10 bg-black/20 p-2">
              {heatmap.map((v, i) => (
                <div
                  key={i}
                  className="h-2 w-full rounded-[1px] transition-all hover:scale-150 hover:z-10"
                  style={{ 
                    background: LEVEL_BG[v] ?? LEVEL_BG[0],
                    boxShadow: v > 2 ? `0 0 8px ${LEVEL_BG[v]}` : 'none'
                  }}
                  title={`intensity ${v}`}
                />
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="space-y-2.5 font-mono text-[11px]">
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">languages</div>
            {languages.map((l, i) => (
              <div key={l.name} className="group flex items-center gap-3">
                <span className="w-20 truncate text-muted-foreground transition-colors group-hover:text-foreground">{l.name}</span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-cyan/10">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan to-violet"
                  />
                </div>
                <span className="w-8 text-right font-semibold tabular-nums text-foreground">{l.pct}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
