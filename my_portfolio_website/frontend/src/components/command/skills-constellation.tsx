"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project, Skill } from "@/lib/types";
import {
  ArrowRight,
  Cloud,
  Code2,
  Database,
  Globe,
  GraduationCap,
  Layers,
  Maximize2,
  Monitor,
  Palette,
  Server,
  Shield,
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";

type CategoryKey =
  | "All"
  | "Frontend"
  | "Backend"
  | "Database"
  | "DevOps"
  | "Tools"
  | "Languages"
  | "Other";

type CategoryCardData = {
  id: string;
  category: CategoryKey;
  title: string;
  subtitle: string;
  icon: typeof Monitor;
  colorClass: {
    bg: string;
    border: string;
    text: string;
    glow: string;
  };
  skills: string[];
};

const CATEGORIES: CategoryCardData[] = [
  {
    id: "frontend",
    category: "Frontend",
    title: "Frontend Development",
    subtitle: "Building responsive and modern user interfaces",
    icon: Monitor,
    colorClass: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      glow: "rgba(59,130,246,0.15)",
    },
    skills: [
      "React.js",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Styled Components",
    ],
  },
  {
    id: "backend",
    category: "Backend",
    title: "Backend Development",
    subtitle: "Creating secure and scalable server-side applications",
    icon: Server,
    colorClass: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      glow: "rgba(16,185,129,0.15)",
    },
    skills: [
      "Node.js",
      "Express.js",
      "NestJS",
      "Java",
      "Spring Boot",
      "REST APIs",
      "JWT Authentication",
    ],
  },
  {
    id: "database",
    category: "Database",
    title: "Database",
    subtitle: "Managing and working with data",
    icon: Database,
    colorClass: {
      bg: "bg-teal-500/10",
      border: "border-teal-500/30",
      text: "text-teal-400",
      glow: "rgba(20,184,166,0.15)",
    },
    skills: ["MongoDB", "MySQL", "PostgreSQL"],
  },
  {
    id: "devops",
    category: "DevOps",
    title: "DevOps & Deployment",
    subtitle: "Building, deploying and managing applications",
    icon: Cloud,
    colorClass: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
      glow: "rgba(168,85,247,0.15)",
    },
    skills: ["Docker", "Git", "GitHub", "Vercel", "Netlify", "Railway"],
  },
  {
    id: "languages",
    category: "Languages",
    title: "Programming Languages",
    subtitle: "Writing clean and efficient code",
    icon: Code2,
    colorClass: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      glow: "rgba(245,158,11,0.15)",
    },
    skills: ["Java", "C", "C++", "JavaScript"],
  },
  {
    id: "tools",
    category: "Tools",
    title: "Tools & Others",
    subtitle: "Supporting development and productivity",
    icon: Wrench,
    colorClass: {
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
      text: "text-sky-400",
      glow: "rgba(14,165,233,0.15)",
    },
    skills: ["Postman", "VS Code", "Figma", "Linux"],
  },
];

const NETWORK_NODES = [
  {
    id: "frontend",
    label: "Frontend",
    sublabel: "React.js / Next.js",
    x: 200,
    y: 65,
    color: "#38bdf8",
    icon: Monitor,
  },
  {
    id: "styling",
    label: "Styling",
    sublabel: "Tailwind CSS / Styled Components",
    x: 320,
    y: 110,
    color: "#2dd4bf",
    icon: Palette,
  },
  {
    id: "database",
    label: "Database",
    sublabel: "MongoDB",
    x: 345,
    y: 200,
    color: "#34d399",
    icon: Database,
  },
  {
    id: "tools",
    label: "Tools",
    sublabel: "Docker / Git / GitHub",
    x: 310,
    y: 295,
    color: "#60a5fa",
    icon: Wrench,
  },
  {
    id: "cloud",
    label: "Cloud & Deployment",
    sublabel: "Vercel / Netlify / Railway",
    x: 200,
    y: 335,
    color: "#c084fc",
    icon: Cloud,
  },
  {
    id: "backend",
    label: "Backend",
    sublabel: "Node.js / Express.js / NestJS",
    x: 90,
    y: 295,
    color: "#a855f7",
    icon: Server,
  },
  {
    id: "languages",
    label: "Languages",
    sublabel: "Java / C / C++",
    x: 55,
    y: 200,
    color: "#fb923c",
    icon: Code2,
  },
  {
    id: "apis",
    label: "APIs & Auth",
    sublabel: "REST APIs / JWT Authentication",
    x: 80,
    y: 110,
    color: "#22d3ee",
    icon: Shield,
  },
];

export function SkillsConstellation({
  skills = [],
  projects = [],
}: {
  skills?: Skill[];
  projects?: Project[];
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("All");
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const tabs: CategoryKey[] = [
    "All",
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Tools",
    "Languages",
    "Other",
  ];

  const filteredCards =
    activeCategory === "All"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.category === activeCategory);

  return (
    <section className="space-y-8">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
            <span className="inline-block w-4 h-[1px] bg-cyan" />
            <span>MY SKILLS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Technologies{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-sky-400 to-blue-500">
              I Work With
            </span>
          </h2>
          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-slate-400">
            A collection of tools and technologies I use to build modern web applications,
            from frontend to backend and deployment.
          </p>
        </div>

        <div className="hidden sm:block font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
          BUILD / LEARN / IMPROVE
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: SKILLS NETWORK CARD */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-cyan/30 bg-[#070e1c]/90 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

          {/* Card Top Header */}
          <div className="relative z-10 flex items-start justify-between pb-4 border-b border-cyan/15">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan/10 text-cyan border border-cyan/30">
                  <Globe size={13} />
                </div>
                <h3 className="font-display font-bold text-white text-base">Skills Network</h3>
              </div>
              <p className="text-xs text-slate-400">
                Core technologies and how they connect in my workflow
              </p>
            </div>
            <button
              type="button"
              className="p-1.5 rounded-md text-slate-400 hover:text-cyan hover:bg-cyan/10 transition-colors"
              aria-label="Maximize diagram"
            >
              <Maximize2 size={15} />
            </button>
          </div>

          {/* Interactive Network Diagram */}
          <div className="relative z-10 my-4 flex-1 flex items-center justify-center aspect-square max-h-[380px] w-full">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full select-none"
              role="img"
              aria-label="Interactive skills constellation diagram"
            >
              <defs>
                {/* Radial gradient for central glow */}
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background ambient center glow */}
              <circle cx="200" cy="200" r="140" fill="url(#centerGlow)" />

              {/* Outer mesh ring connector lines */}
              {NETWORK_NODES.map((node, i) => {
                const nextNode = NETWORK_NODES[(i + 1) % NETWORK_NODES.length];
                const isConn =
                  hoveredNode === node.id || hoveredNode === nextNode.id;
                return (
                  <line
                    key={`mesh-${node.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={nextNode.x}
                    y2={nextNode.y}
                    stroke={isConn ? "#38bdf8" : "rgba(92,208,255,0.12)"}
                    strokeWidth={isConn ? 1.5 : 0.8}
                    strokeDasharray={isConn ? "none" : "2 2"}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Spoke connector lines from satellites to center */}
              {NETWORK_NODES.map((node) => {
                const isConn = hoveredNode === node.id;
                return (
                  <g key={`spoke-${node.id}`}>
                    <line
                      x1={200}
                      y1={200}
                      x2={node.x}
                      y2={node.y}
                      stroke={isConn ? node.color : "rgba(92,208,255,0.2)"}
                      strokeWidth={isConn ? 2 : 1}
                      className="transition-all duration-300"
                    />
                    {isConn && (
                      <circle cx={node.x} cy={node.y} r="6" fill={node.color} opacity="0.3">
                        <animate
                          attributeName="r"
                          values="4;14;4"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.6;0;0.6"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* CENTER NODE: Full Stack Development */}
              <g className="cursor-pointer" style={{ transformOrigin: "200px 200px" }}>
                <circle
                  cx="200"
                  cy="200"
                  r="30"
                  fill="#070e1c"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="shadow-[0_0_20px_#38bdf8]"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="24"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x="200"
                  y="205"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="16"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  &lt;/&gt;
                </text>
                <text
                  x="200"
                  y="244"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="9.5"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  Full Stack
                </text>
                <text
                  x="200"
                  y="256"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="sans-serif"
                >
                  Development
                </text>
              </g>

              {/* ORBITING SATELLITE NODES */}
              {NETWORK_NODES.map((node) => {
                const isHovered = hoveredNode === node.id;
                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform duration-300"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setHoveredNode(isHovered ? null : node.id)}
                  >
                    {/* Glowing outer disk */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? 18 : 14}
                      fill="#070e1c"
                      stroke={node.color}
                      strokeWidth={isHovered ? 2 : 1.2}
                      className="transition-all duration-300"
                    />

                    {/* Node Dot / Icon indicator */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? 6 : 4}
                      fill={node.color}
                      className="transition-all duration-300"
                    />

                    {/* Node Labels */}
                    <text
                      x={node.x}
                      y={node.y > 200 ? node.y + 22 : node.y - 18}
                      textAnchor="middle"
                      fill={isHovered ? "#fff" : "#e2e8f0"}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x}
                      y={node.y > 200 ? node.y + 32 : node.y - 8}
                      textAnchor="middle"
                      fill={isHovered ? node.color : "#94a3b8"}
                      fontSize="7.5"
                      fontFamily="sans-serif"
                    >
                      {node.sublabel.split("/")[0].trim()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="relative z-10 pt-3 border-t border-cyan/15 text-center font-mono text-[11px] text-cyan/70">
            Tap or hover any node to inspect connected stack relationships
          </div>
        </div>

        {/* RIGHT COLUMN: CATEGORY TABS & 6 CARDS GRID */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Filter Pills Header */}
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCategory(tab)}
                  className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all ${
                    isActive
                      ? "bg-cyan text-black font-semibold shadow-[0_0_15px_var(--cyan-glow)]"
                      : "border border-cyan/20 bg-surface/60 text-slate-400 hover:text-white hover:border-cyan/40"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* 6 Category Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 flex-1">
            {filteredCards.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="group relative flex flex-col rounded-2xl border border-cyan/25 bg-[#070e1c]/80 p-5 backdrop-blur-md transition-all hover:border-cyan/50 hover:shadow-[0_8px_24px_rgba(92,208,255,0.1)]"
                >
                  <div className="flex items-start gap-3.5 mb-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${cat.colorClass.border} ${cat.colorClass.bg} ${cat.colorClass.text}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-white transition-colors group-hover:text-cyan">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{cat.subtitle}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-cyan/20 bg-cyan/5 px-2.5 py-1 font-mono text-[11px] text-cyan/90 transition-colors group-hover:border-cyan/40 group-hover:bg-cyan/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CURRENTLY LEARNING BANNER */}
          <div className="relative overflow-hidden rounded-xl border border-cyan/30 bg-[#070e1c]/90 p-4 sm:p-5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10 text-cyan">
                <GraduationCap size={18} />
              </div>
              <div className="text-xs leading-relaxed text-slate-300">
                <span className="font-semibold text-white">Currently Learning: </span>
                Exploring advanced Java, Spring Boot, Cloud technologies and modern software architecture.
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 shrink-0 rounded-lg border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-xs font-medium text-cyan hover:bg-cyan/20 hover:border-cyan transition-all"
            >
              <span>View My Journey</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
