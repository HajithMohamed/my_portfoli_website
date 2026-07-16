import { Panel } from "@/components/hud/panel";
import { computeStreak, heatmapLevels, languageShares } from "@/lib/github-insights";
import type { GithubSummary } from "@/lib/types";

const LEVEL_BG = [
  "rgba(92,208,255,0.05)",
  "rgba(92,208,255,0.2)",
  "rgba(92,208,255,0.4)",
  "rgba(92,208,255,0.65)",
  "rgba(92,208,255,0.95)",
];

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-cyan/15 bg-surface/40 p-2.5">
      <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">{label}</div>
      <div
        className={`mt-1 font-display text-xl font-semibold tabular-nums ${accent ? "text-cyan text-glow" : "text-foreground"}`}
      >
        {value}
      </div>
    </div>
  );
}

export function GithubTelemetry({ github }: { github: GithubSummary }) {
  const contributions = github.contributionData?.totalContributions ?? github.commitCount;
  const streak = computeStreak(github);
  const stars = github.contributionData?.totalStars ?? 0;
  const followers = github.contributionData?.followers;
  const following = github.contributionData?.following;
  const heatmap = heatmapLevels(github, 12);
  const languages = languageShares(github, 4);

  return (
    <Panel label="github.telemetry" subtitle={`@${github.username}`} live>
      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <Stat label="commits/yr" value={contributions.toLocaleString()} />
        <Stat label="streak" value={`${streak}d`} accent />
        <Stat label="repos" value={github.repositoryCount.toString()} />
        <Stat label="stars" value={stars.toLocaleString()} />
        {typeof followers === "number" ? (
          <Stat label="followers" value={followers.toLocaleString()} />
        ) : null}
        {typeof following === "number" ? (
          <Stat label="following" value={following.toLocaleString()} />
        ) : null}
      </div>

      {heatmap.length > 0 ? (
        <div className="mt-4">
          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan/70">
            contribution heatmap
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
            {heatmap.map((v, i) => (
              <div
                key={i}
                className="h-[10px] w-[10px] rounded-[1px] border border-cyan/5"
                style={{ background: LEVEL_BG[v] ?? LEVEL_BG[0] }}
                title={`intensity ${v}`}
              />
            ))}
          </div>
        </div>
      ) : null}

      {languages.length > 0 ? (
        <div className="mt-4 space-y-1.5 font-mono text-[11px]">
          <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">languages</div>
          {languages.map((l) => (
            <div key={l.name} className="flex items-center gap-2">
              <span className="w-20 truncate text-muted-foreground">{l.name}</span>
              <div className="relative h-1.5 flex-1 overflow-hidden bg-cyan/10">
                <div
                  className="absolute inset-y-0 left-0 bg-cyan/70"
                  style={{ width: `${l.pct}%` }}
                />
              </div>
              <span className="w-8 text-right tabular-nums text-foreground">{l.pct}%</span>
            </div>
          ))}
        </div>
      ) : null}
    </Panel>
  );
}
