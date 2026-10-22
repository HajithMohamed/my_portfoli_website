"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu } from "lucide-react";
import { TechIcons } from "@/components/icons/tech-icons";

interface ToolItem {
  name: string;
  queryParam: string;
  icon: keyof typeof TechIcons;
  category: "Professional project experience" | "Academic/project experience" | "Currently learning";
  experience: string;
}

const TOOLS_BY_CATEGORY: {
  category: "Professional project experience" | "Academic/project experience" | "Currently learning";
  description: string;
  tools: ToolItem[];
}[] = [
  {
    category: "Professional project experience",
    description: "Strongest verified technologies backed by shipped platforms, production business systems, and public repositories.",
    tools: [
      { name: "React", queryParam: "React", icon: "React", category: "Professional project experience", experience: "Verified Project" },
      { name: "Next.js", queryParam: "Next.js", icon: "NextJS", category: "Professional project experience", experience: "Verified Project" },
      { name: "Node.js", queryParam: "Node.js", icon: "NodeJS", category: "Professional project experience", experience: "Verified Project" },
      { name: "PHP", queryParam: "PHP", icon: "NodeJS", category: "Professional project experience", experience: "Verified Project" },
      { name: "PostgreSQL", queryParam: "PostgreSQL", icon: "PostgreSQL", category: "Professional project experience", experience: "Relational DB" },
      { name: "MySQL", queryParam: "MySQL", icon: "PostgreSQL", category: "Professional project experience", experience: "Relational DB" },
      { name: "MongoDB", queryParam: "MongoDB", icon: "MongoDB", category: "Professional project experience", experience: "NoSQL DB" },
      { name: "TypeScript", queryParam: "TypeScript", icon: "TypeScript", category: "Professional project experience", experience: "Verified Project" },
      { name: "JavaScript", queryParam: "JavaScript", icon: "JavaScript", category: "Professional project experience", experience: "Verified Project" },
      { name: "Tailwind CSS", queryParam: "TailwindCSS", icon: "TailwindCSS", category: "Professional project experience", experience: "Verified Project" },
      { name: "Docker", queryParam: "Docker", icon: "Docker", category: "Professional project experience", experience: "Containerization" },
      { name: "GitHub", queryParam: "GitHub", icon: "GitHub", category: "Professional project experience", experience: "CI/CD & Git" },
    ],
  },
  {
    category: "Academic/project experience",
    description: "Architectures, frameworks, and tools used in university coursework, database engineering prototypes, and team systems.",
    tools: [
      { name: "NestJS", queryParam: "NestJS", icon: "NestJS", category: "Academic/project experience", experience: "REST Architecture" },
      { name: "Spring Boot", queryParam: "Spring Boot", icon: "SpringBoot", category: "Academic/project experience", experience: "Academic Coursework" },
      { name: "Supabase", queryParam: "Supabase", icon: "Supabase", category: "Academic/project experience", experience: "Project DB" },
      { name: "Firebase", queryParam: "Firebase", icon: "Firebase", category: "Academic/project experience", experience: "Realtime Store" },
    ],
  },
  {
    category: "Currently learning",
    description: "Active technical explorations expanding into mobile engineering, cloud fundamentals, and practical AI systems.",
    tools: [
      { name: "Python", queryParam: "Python", icon: "Python", category: "Currently learning", experience: "Exploring" },
      { name: "Flutter", queryParam: "Flutter", icon: "Flutter", category: "Currently learning", experience: "Exploring" },
      { name: "Dart", queryParam: "Dart", icon: "Dart", category: "Currently learning", experience: "Exploring" },
      { name: "Azure", queryParam: "Azure", icon: "Azure", category: "Currently learning", experience: "Cloud Services" },
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
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {group.category}
                </h3>
                <p className="font-mono text-[11px] text-slate-500">
                  {group.description}
                </p>
              </div>

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
