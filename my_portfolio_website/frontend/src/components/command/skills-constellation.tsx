import { Panel } from "@/components/hud/panel";
import type { Skill } from "@/lib/types";

export function SkillsConstellation({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  const groups = [...new Set(skills.map((s) => s.category))].map((category) => ({
    group: category,
    items: skills
      .filter((s) => s.category === category)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }));

  return (
    <Panel label="skill.matrix" subtitle="operational stack">
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((g, i) => (
          <div key={g.group} className="hud-panel-solid corner-brackets p-4">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em]">
              <span className="text-cyan">
                {String(i + 1).padStart(2, "0")} — {g.group}
              </span>
              <span className="text-muted-foreground">{g.items.length}</span>
            </div>
            <ul className="space-y-1.5 font-mono text-xs">
              {g.items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-2 text-foreground transition-colors hover:text-cyan"
                >
                  <span className="inline-block h-1 w-1 rounded-full bg-cyan/50" />
                  {it.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}
