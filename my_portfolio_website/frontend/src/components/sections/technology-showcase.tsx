"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu } from "lucide-react";
import { TechIcons } from "@/components/icons/tech-icons";

interface ToolItem {
  name: string;
  queryParam: string;
  icon: keyof typeof TechIcons;
  category: "Languages" | "Frameworks & Libraries" | "Cloud & DevOps";
  experience: string;
}

const TOOLS_BY_CATEGORY: {
  category: "Languages" | "Frameworks & Libraries" | "Cloud & DevOps";
  tools: ToolItem[];
}[] = [
  {
    category: "Languages",
    tools: [
      { name: "TypeScript", queryParam: "TypeScript", icon: "TypeScript", category: "Languages", experience: "Production" },
      { name: "JavaScript", queryParam: "JavaScript", icon: "JavaScript", category: "Languages", experience: "Production" },
      { name: "Dart", queryParam: "Dart", icon: "Dart", category: "Languages", experience: "Production" },
      { name: "Python", queryParam: "Python", icon: "Python", category: "Languages", experience: "Data & APIs" },
      { name: "Go", queryParam: "Go", icon: "Go", category: "Languages", experience: "Services" },
    ],
  },
  {
    category: "Frameworks & Libraries",
    tools: [
      { name: "React", queryParam: "React", icon: "React", category: "Frameworks & Libraries", experience: "Production" },
      { name: "Next.js", queryParam: "Next.js", icon: "NextJS", category: "Frameworks & Libraries", experience: "Production" },
      { name: "Flutter", queryParam: "Flutter", icon: "Flutter", category: "Frameworks & Libraries", experience: "Production" },
      { name: "NestJS", queryParam: "NestJS", icon: "NestJS", category: "Frameworks & Libraries", experience: "Production" },
      { name: "Node.js", queryParam: "Node.js", icon: "NodeJS", category: "Frameworks & Libraries", experience: "Production" },
      { name: "Spring Boot", queryParam: "Spring Boot", icon: "SpringBoot", category: "Frameworks & Libraries", experience: "Enterprise" },
    ],
  },
  {
    category: "Cloud & DevOps",
    tools: [
      { name: "PostgreSQL", queryParam: "PostgreSQL", icon: "PostgreSQL", category: "Cloud & DevOps", experience: "Relational" },
      { name: "MongoDB", queryParam: "MongoDB", icon: "MongoDB", category: "Cloud & DevOps", experience: "NoSQL" },
      { name: "Docker", queryParam: "Docker", icon: "Docker", category: "Cloud & DevOps", experience: "Containers" },
      { name: "AWS", queryParam: "AWS", icon: "AWS", category: "Cloud & DevOps", experience: "Cloud" },
      { name: "Supabase", queryParam: "Supabase", icon: "Supabase", category: "Cloud & DevOps", experience: "Backend" },
      { name: "Firebase", queryParam: "Firebase", icon: "Firebase", category: "Cloud & DevOps", experience: "Realtime" },
      { name: "Tailwind CSS", queryParam: "TailwindCSS", icon: "TailwindCSS", category: "Cloud & DevOps", experience: "Styling" },
      { name: "GitHub", queryParam: "GitHub", icon: "GitHub", category: "Cloud & DevOps", experience: "CI/CD" },
    ],
  },
];

export function TechnologyShowcase() {
  return (
    <section
      id="skills"
      className="py-16 md:py-24 relative overflow-hidden"
      aria-label="Technology Stack and Tools"
    >
      <div className="container-responsive space-y-12">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.25em] text-violet-400 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            <span>TOOLSTACK</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Tools across my work
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-400 leading-relaxed">
            The core languages, frameworks, cloud services, and developer tooling I rely on to ship robust, full-stack systems.
          </p>
        </div>

        {/* Categorized Rows of Glass Tiles */}
        <div className="space-y-8">
          {TOOLS_BY_CATEGORY.map((group) => (
            <div key={group.category} className="space-y-3">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {group.category}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {group.tools.map((tool) => {
                  const IconComponent = TechIcons[tool.icon];
                  return (
                    <Link
                      key={tool.name}
                      href={`/projects?tech=${encodeURIComponent(tool.queryParam)}`}
                      className="group relative flex flex-col items-center justify-center p-4 rounded-xl studio-glass border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/80 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                      title={`Filter projects by ${tool.name}`}
                    >
                      {/* Subtle hover gradient ring */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-violet-500/0 via-violet-500/0 to-cyan-500/0 group-hover:from-violet-500/10 group-hover:to-cyan-500/5 transition-all duration-300 pointer-events-none" />

                      {/* Icon */}
                      <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        {IconComponent ? (
                          <IconComponent className="w-full h-full object-contain filter drop-shadow" />
                        ) : (
                          <Cpu className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      {/* Name */}
                      <span className="font-mono text-xs text-slate-300 group-hover:text-white transition-colors duration-200 mt-2 font-medium">
                        {tool.name}
                      </span>

                      {/* Micro hover indicator */}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-mono text-[9px] uppercase tracking-wider text-violet-400 mt-0.5">
                        {tool.experience}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer guidance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 font-mono text-xs text-slate-400">
          <p>
            Click any tool to filter projects built with that technology.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-violet-400 hover:text-violet-300 transition-colors uppercase tracking-wider text-[11px] font-semibold"
          >
            <span>View all public repositories</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
