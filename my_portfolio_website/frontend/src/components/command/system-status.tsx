import { Panel } from "@/components/hud/panel";
import type { Profile } from "@/lib/types";

export function SystemStatus({ profile }: { profile: Profile }) {
  const focus =
    profile.currentlyExploring?.slice(0, 2).join(" · ") || "Full-stack systems";

  const rows = [
    { label: "Availability", value: profile.availabilityStatus, tone: "green" as const },
    { label: "Response window", value: "< 24h", tone: "cyan" as const },
    { label: "Current focus", value: focus, tone: "default" as const },
    { label: "Engagement", value: "Internship · Full-time · Freelance", tone: "default" as const },
    { label: "Operator", value: profile.name, tone: "default" as const },
    { label: "Sector", value: profile.location, tone: "default" as const },
  ];

  return (
    <Panel label="sys.status" subtitle="availability" live>
      <div className="space-y-2 font-mono text-xs">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between gap-3 border-b border-cyan/10 pb-2 last:border-0"
          >
            <span className="shrink-0 text-muted-foreground">
              <span className="text-cyan/60">▸ </span>
              {r.label}
            </span>
            <span
              className={
                r.tone === "green"
                  ? "flex items-center gap-2 text-right text-signal-green"
                  : r.tone === "cyan"
                    ? "text-right text-cyan"
                    : "text-right text-foreground"
              }
            >
              {r.tone === "green" && (
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal-green animate-pulse-dot" />
              )}
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
