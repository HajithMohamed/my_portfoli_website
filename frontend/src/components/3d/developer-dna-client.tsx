"use client";

import dynamic from "next/dynamic";
import type { Skill, Project, GithubSummary, Certificate } from "@/lib/types";

const DeveloperDNACanvas = dynamic(
  () => import("@/components/3d/developer-dna").then((m) => ({ default: m.DeveloperDNA })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] w-full items-center justify-center rounded-xl border border-white/10 bg-[#050816] text-slate-500">
        Loading neural network…
      </div>
    ),
  },
);

export function DeveloperDNAClient({
  skills,
  projects,
  github,
  certificates,
  name,
}: {
  skills: Skill[];
  projects: Project[];
  github: GithubSummary;
  certificates: Certificate[];
  name?: string;
}) {
  return (
    <DeveloperDNACanvas
      skills={skills}
      projects={projects}
      github={github}
      certificates={certificates}
      name={name}
    />
  );
}
