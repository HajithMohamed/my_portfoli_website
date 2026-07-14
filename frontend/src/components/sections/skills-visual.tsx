"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/lib/hooks";
import type { Skill } from "@/lib/types";

function SkillBar({ skill, active }: { skill: Skill; active: boolean }) {
  const value = useCountUp(skill.proficiency, active, 1);
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-slate-200">{skill.name}</span>
        <span className="tabular-nums text-slate-500">{value}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: active ? `${skill.proficiency}%` : 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function SkillsVisual({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const skill of skills) {
      map.set(skill.category, [...(map.get(skill.category) ?? []), skill]);
    }
    return Array.from(map.entries());
  }, [skills]);

  const filters = ["All", ...categories.map(([category]) => category)];
  const visible = filter === "All" ? categories : categories.filter(([category]) => category === filter);

  return (
    <div ref={containerRef}>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition",
              filter === category
                ? "border-blue-400/40 bg-blue-500/15 text-blue-100"
                : "border-white/10 text-slate-400 hover:text-white",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map(([category, categorySkills]) => (
          <Card key={category}>
            <h3 className="mb-4 text-lg font-semibold text-white">{category}</h3>
            <div className="grid gap-3">
              {categorySkills.map((skill) => (
                <SkillBar key={skill.id} skill={skill} active={inView} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
