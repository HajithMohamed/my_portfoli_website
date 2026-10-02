"use client";

import { useState } from "react";
import Link from "next/link";
import { Panel } from "@/components/hud/panel";
import type { Project, Skill } from "@/lib/types";
import {
  ArrowRight,
  Brain,
  Cloud,
  Code2,
  Database,
  Globe,
  GraduationCap,
  Layers,
  LineChart,
  Maximize2,
  Monitor,
  Palette,
  Server,
  Shield,
  Smartphone,
  Terminal,
  Wrench,
  Zap,
} from "lucide-react";

type CategoryKey =
  | "All"
  | "Web Development"
  | "Mobile App Dev"
  | "AI / ML"
  | "Data Science"
  | "Backend & Cloud"
  | "Databases"
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
  };
  skills: string[];
};

const CATEGORIES: CategoryCardData[] = [
  {
    id: "webdev",
    category: "Web Development",
    title: "Web Development",
    subtitle: "Modern full-stack platforms & scalable web APIs",
    icon: Globe,
    colorClass: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
    },
    skills: [
      "React.js",
      "Next.js",
      "TypeScript",
      "Node.js",
      "NestJS",
      "Express.js",
      "Tailwind CSS",
      "REST / GraphQL",
    ],
  },
  {
    id: "mobile",
    category: "Mobile App Dev",
    title: "Mobile App Development",
    subtitle: "Cross-platform iOS & Android mobile engineering",
    icon: Smartphone,
    colorClass: {
      bg: "bg-cyan/10",
      border: "border-cyan/30",
      text: "text-cyan",
    },
    skills: [
      "Flutter",
      "Dart",
      "React Native",
      "Mobile UI/UX",
      "State Management",
      "Native Device APIs",
      "Offline Storage",
    ],
  },
  {
    id: "ai-ml",
    category: "AI / ML",
    title: "AI & Machine Learning",
    subtitle: "Intelligent models, deep learning & LLM integrations",
    icon: Brain,
    colorClass: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-400",
    },
    skills: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "PyTorch",
      "TensorFlow",
      "NLP",
      "LLM APIs",
      "Prompt Engineering",
    ],
  },
  {
    id: "datascience",
    category: "Data Science",
    title: "Data Science & Analytics",
    subtitle: "Statistical analysis, data pipelines & predictive modeling",
    icon: LineChart,
    colorClass: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
    },
    skills: [
      "Data Science",
      "Pandas",
      "NumPy",
      "Data Visualization",
      "SQL Analytics",
      "PostgreSQL",
      "Predictive Analytics",
    ],
  },
  {
    id: "backend-cloud",
    category: "Backend & Cloud",
    title: "Backend & Cloud Systems",
    subtitle: "Distributed microservices, auth & containerization",
    icon: Server,
    colorClass: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
    },
    skills: [
      "Node.js",
      "NestJS",
      "Express",
      "Docker",
      "Git / GitHub",
      "Postman",
      "CI/CD Pipelines",
      "Linux",
    ],
  },
  {
    id: "database",
    category: "Databases",
    title: "Databases & Persistence",
    subtitle: "Relational, NoSQL & transactional data layers",
    icon: Database,
    colorClass: {
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
      text: "text-sky-400",
    },
    skills: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Prisma ORM",
      "Redis",
      "Mongoose",
      "Supabase",
    ],
  },
];

const NETWORK_NODES = [
  { id: "web", label: "Web Dev", tech: "React / Next / Node", x: 200, y: 70, color: "#38bdf8" },
  { id: "mobile", label: "Mobile Dev", tech: "Flutter / Dart", x: 295, y: 110, color: "#2dd4bf" },
  { id: "ai", label: "AI / ML", tech: "Python / PyTorch", x: 330, y: 200, color: "#c084fc" },
  { id: "data", label: "Data Science", tech: "Pandas / SQL", x: 295, y: 290, color: "#34d399" },
  { id: "cloud", label: "Cloud & DevOps", tech: "Docker / CI-CD", x: 200, y: 330, color: "#a855f7" },
  { id: "backend", label: "Backend", tech: "NestJS / Express", x: 105, y: 290, color: "#60a5fa" },
  { id: "database", label: "Database", tech: "Postgres / Mongo", x: 70, y: 200, color: "#fb923c" },
  { id: "apis", label: "APIs & Auth", tech: "REST / JWT", x: 105, y: 110, color: "#38bdf8" },
];

export function SkillsConstellation({
  skills,
  projects,
}: {
  skills?: Skill[];
  projects?: Project[];
}) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("All");

  const tabs: CategoryKey[] = [
    "All",
    "Web Development",
    "Mobile App Dev",
    "AI / ML",
    "Data Science",
    "Backend & Cloud",
    "Databases",
  ];

  const filteredCards =
    activeCategory === "All"
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.category === activeCategory);

  return (
    <section className="space-y-6">
      {/* SECTION HEADER — HUD Compact */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-cyan/15 pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">
            <span className="inline-block w-4 h-[1px] bg-cyan" />
            <span>sys.skills // technology matrix</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Technologies &amp; Architecture
          </h2>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            Full-stack engineering stack, languages, databases, and deployment platforms.
          </p>
        </div>

        <div className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.3em] text-cyan/70 border border-cyan/20 bg-cyan/5 px-2.5 py-1 rounded-sm">
          Build • Deploy • Maintain
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: SKILLS NETWORK HUD PANEL */}
        <div className="lg:col-span-5 h-full">
          <Panel
            label="sys.constellation"
            subtitle="mesh-topology"
            live
            className="h-full flex flex-col justify-between"
            bodyClassName="p-4 sm:p-5 flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-cyan/15">
                <div>
                  <h3 className="font-display font-bold text-foreground text-sm">
                    Skills Constellation
                  </h3>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    Interactive topology of interconnected system competencies
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-cyan font-mono text-[9px] uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-dot" />
                  active mesh
                </div>
              </div>

              {/* Interactive SVG Constellation Diagram */}
              <div className="relative z-10 my-3 flex items-center justify-center aspect-square max-h-[340px] w-full">
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full select-none"
                  role="img"
                  aria-label="Interactive skills constellation diagram"
                >
                  <defs>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.25" />
                      <stop offset="60%" stopColor="#00e5ff" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Ambient center glow */}
                  <circle cx="200" cy="200" r="130" fill="url(#centerGlow)" />

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
                        stroke={isConn ? "#00e5ff" : "rgba(0, 229, 255, 0.12)"}
                        strokeWidth={isConn ? 1.5 : 0.8}
                        strokeDasharray={isConn ? "none" : "2 2"}
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {/* Spoke connector lines to center */}
                  {NETWORK_NODES.map((node) => {
                    const isConn = hoveredNode === node.id;
                    return (
                      <g key={`spoke-${node.id}`}>
                        <line
                          x1={200}
                          y1={200}
                          x2={node.x}
                          y2={node.y}
                          stroke={isConn ? node.color : "rgba(0, 229, 255, 0.2)"}
                          strokeWidth={isConn ? 2 : 1}
                          className="transition-all duration-300"
                        />
                        {isConn && (
                          <circle cx={node.x} cy={node.y} r="6" fill={node.color} opacity="0.4">
                            <animate
                              attributeName="r"
                              values="4;12;4"
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

                  {/* CENTER HUB: Full Stack */}
                  <g className="cursor-pointer" style={{ transformOrigin: "200px 200px" }}>
                    <circle
                      cx="200"
                      cy="200"
                      r="28"
                      fill="#060c14"
                      stroke="#00e5ff"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="22"
                      fill="none"
                      stroke="#00e5ff"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                    <text
                      x="200"
                      y="205"
                      textAnchor="middle"
                      fill="#00e5ff"
                      fontSize="14"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      &lt;/&gt;
                    </text>
                    <text
                      x="200"
                      y="242"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      FULL STACK
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
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isHovered ? 16 : 13}
                          fill={isHovered ? `${node.color}25` : "rgba(0, 229, 255, 0.05)"}
                          className="transition-all duration-300"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isHovered ? 11 : 9}
                          fill="#060c14"
                          stroke={isHovered ? node.color : "rgba(0, 229, 255, 0.3)"}
                          strokeWidth={isHovered ? 2 : 1}
                          className="transition-all duration-300"
                        />
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={3}
                          fill={isHovered ? "#fff" : node.color}
                          className="transition-all duration-300"
                        />
                        <text
                          x={node.x}
                          y={node.y > 200 ? node.y + 19 : node.y - 13}
                          textAnchor="middle"
                          fill={isHovered ? "#00e5ff" : "#cbd5e1"}
                          fontSize="8.5"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          {node.label}
                        </text>
                        <text
                          x={node.x}
                          y={node.y > 200 ? node.y + 28 : node.y - 4}
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize="7"
                          fontFamily="monospace"
                        >
                          {node.tech}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Bottom telemetry hint */}
            <div className="pt-3 border-t border-cyan/15 font-mono text-[9px] uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Inspect node relationships</span>
              <span className="text-cyan">8 Active Satellites</span>
            </div>
          </Panel>
        </div>

        {/* RIGHT COLUMN: CATEGORY TABS & HUD CARDS */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* HUD Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {tabs.map((tab) => {
              const isActive = activeCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveCategory(tab)}
                  className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider rounded-sm border transition-colors ${
                    isActive
                      ? "border-cyan bg-cyan/15 text-cyan font-bold"
                      : "border-cyan/15 bg-surface-2/40 text-muted-foreground hover:text-foreground hover:border-cyan/30"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* 6 Category HUD Cards */}
          <div className="grid gap-3 sm:grid-cols-2 flex-1">
            {filteredCards.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="group relative flex flex-col rounded-md border border-cyan/15 bg-surface-2/40 p-3.5 backdrop-blur-md transition-all hover:border-cyan/40 hover:bg-surface-2/70"
                >
                  <div className="flex items-start gap-3 mb-2.5">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border ${cat.colorClass.border} ${cat.colorClass.bg} ${cat.colorClass.text}`}
                    >
                      <Icon size={14} />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground transition-colors group-hover:text-cyan">
                        {cat.title}
                      </h4>
                      <p className="font-mono text-[10px] text-muted-foreground line-clamp-1">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Monospace HUD Badges */}
                  <div className="mt-auto flex flex-wrap gap-1 pt-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="border border-cyan/15 bg-surface/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan/90 rounded-sm hover:border-cyan/30 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CURRENTLY LEARNING HUD PANEL */}
          <Panel
            label="sys.learning"
            subtitle="active-rd"
            className="w-full"
            bodyClassName="p-3.5 sm:p-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-cyan/30 bg-cyan/10 text-cyan">
                  <GraduationCap size={16} />
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-cyan">
                    Core Specializations &amp; Career Focus
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    Focused on Web Development (Next.js/Node), Mobile App Engineering (Flutter/Dart), AI &amp; Machine Learning (Python/PyTorch), and Data Science &amp; Analytics.
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 shrink-0 border border-cyan/40 bg-cyan/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan hover:bg-cyan/20 transition-colors rounded-sm"
              >
                <span>Read Dossier</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}
