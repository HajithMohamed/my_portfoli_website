"use client";

import dynamic from "next/dynamic";
import type { Skill } from "@/lib/types";

const SkillsGalaxyCanvas = dynamic(
  () => import("@/components/sections/skills-galaxy").then((m) => ({ default: m.SkillsGalaxy })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[520px] flex items-center justify-center text-slate-600 text-sm">
        Loading skills galaxy…
      </div>
    ),
  }
);

export function SkillsGalaxyClient({ skills }: { skills: Skill[] }) {
  return <SkillsGalaxyCanvas skills={skills} />;
}
