"use client";

import { useState } from "react";
import { RevealAnimation } from "@/components/ui/reveal-animation";
import { groupTechnologies, techIconUrl, type TechMeta } from "@/lib/tech-registry";
import type { GithubSummary, Skill } from "@/lib/types";

function TechIcon({ name, meta }: { name: string; meta: TechMeta }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span
        aria-hidden
        className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
        style={{ backgroundColor: `#${meta.color}33`, color: `#${meta.color}` }}
      >
        {name.charAt(0)}
      </span>
    );
  }
  return (
    // Official brand icon from Simple Icons (https://simpleicons.org).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={name}
      className="h-7 w-7"
      height={28}
      loading="lazy"
      onError={() => setFailed(true)}
      src={techIconUrl(meta)}
      width={28}
    />
  );
}

export function TechStackGrid({ github, skills }: { github: GithubSummary; skills: Skill[] }) {
  const names = [
    ...(github.contributionData?.technologies ?? []),
    ...(Array.isArray(github.languages) ? github.languages : Object.keys(github.languages ?? {})),
    ...skills.map((skill) => skill.name),
  ];
  const groups = groupTechnologies(names);

  if (groups.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="mb-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-widest text-slate-500">
          Detected from GitHub &amp; skills
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => (
          <RevealAnimation delay={i * 0.06} key={group.category} variant="slide-up">
            <div className="h-full rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-4 text-sm font-semibold text-white">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map(({ name, meta }) => (
                  <span
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-3 text-sm text-slate-300 transition-colors hover:border-white/20 hover:text-white"
                    key={name}
                    title={name}
                  >
                    <TechIcon meta={meta} name={name} />
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </RevealAnimation>
        ))}
      </div>
    </div>
  );
}
