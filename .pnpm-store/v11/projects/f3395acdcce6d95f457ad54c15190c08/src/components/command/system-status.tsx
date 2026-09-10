import { Panel } from "@/components/hud/panel";
import type { Profile } from "@/lib/types";
import { Activity, Clock, Crosshair, MapPin, Briefcase, User } from "lucide-react";

export function SystemStatus({ profile }: { profile: Profile }) {
  const focus =
    profile.currentlyExploring?.slice(0, 2).join(" · ") || "Full-stack systems";

  const rows = [
    { label: "Availability", value: profile.availabilityStatus, tone: "green" as const, icon: Activity },
    { label: "Response", value: "< 24h", tone: "cyan" as const, icon: Clock },
    { label: "Focus", value: focus, tone: "default" as const, icon: Crosshair },
    { label: "Modes", value: "Internship · Full-time", tone: "default" as const, icon: Briefcase },
    { label: "Operator", value: profile.name, tone: "default" as const, icon: User },
    { label: "Sector", value: profile.location, tone: "default" as const, icon: MapPin },
  ];

  return (
    <Panel label="sys.status" subtitle="availability" live className="h-full">
      <div className="space-y-3 font-mono text-xs h-full flex flex-col justify-between">
        {rows.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={r.label}
              className="group flex items-center justify-between gap-3 rounded-md px-3 py-2.5 transition-all hover:bg-surface-2 hover:shadow-sm"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="flex items-center gap-3 text-muted-foreground transition-colors group-hover:text-cyan/80">
                <Icon size={14} className="opacity-50" />
                {r.label}
              </span>
              <span
                className={
                  r.tone === "green"
                    ? "flex items-center gap-2 text-right text-signal-green font-medium"
                    : r.tone === "cyan"
                      ? "text-right text-cyan font-medium"
                      : "text-right text-foreground"
                }
              >
                {r.tone === "green" && (
                  <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-50"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-green"></span>
                  </span>
                )}
                {r.value}
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
