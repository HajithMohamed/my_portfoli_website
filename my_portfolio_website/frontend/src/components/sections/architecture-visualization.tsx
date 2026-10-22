"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Code2,
  Server,
  Smartphone,
  Database,
  Cloud,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  category: string;
  tech: string[];
  x: number;
  y: number;
  labelPosition: "top" | "bottom" | "left" | "right";
  icon: React.ComponentType<{ className?: string; size?: number; style?: React.CSSProperties }>;
  color: string;
  glowColor: string;
}

const NODES: NodeData[] = [
  {
    id: "frontend",
    name: "Frontend",
    category: "Client Tier",
    tech: ["Next.js 16", "React 19", "TypeScript", "TailwindCSS"],
    x: 105,
    y: 165,
    labelPosition: "left",
    icon: Code2,
    color: "#38bdf8", // cyan
    glowColor: "rgba(56, 189, 248, 0.4)",
  },
  {
    id: "cloud",
    name: "Cloud & Infra",
    category: "Edge & Hosting",
    tech: ["Azure", "Vercel", "Docker", "CDN / Edge"],
    x: 250,
    y: 75,
    labelPosition: "top",
    icon: Cloud,
    color: "#a855f7", // violet
    glowColor: "rgba(168, 85, 247, 0.4)",
  },
  {
    id: "devops",
    name: "DevOps",
    category: "Pipelines & Telemetry",
    tech: ["GitHub Actions", "Docker CI", "Monitoring", "PostHog"],
    x: 395,
    y: 165,
    labelPosition: "right",
    icon: Cpu,
    color: "#06b6d4", // teal/cyan
    glowColor: "rgba(6, 182, 212, 0.4)",
  },
  {
    id: "backend",
    name: "Backend",
    category: "Application Services",
    tech: ["NestJS", "Node.js", "REST & GraphQL", "JWT Auth"],
    x: 395,
    y: 335,
    labelPosition: "right",
    icon: Server,
    color: "#e0234e", // nest red/rose
    glowColor: "rgba(224, 35, 78, 0.4)",
  },
  {
    id: "database",
    name: "Database",
    category: "Persistence & Cache",
    tech: ["PostgreSQL", "Prisma ORM", "Redis", "Supabase"],
    x: 250,
    y: 425,
    labelPosition: "bottom",
    icon: Database,
    color: "#336791", // postgres blue
    glowColor: "rgba(51, 103, 145, 0.4)",
  },
  {
    id: "mobile",
    name: "Mobile",
    category: "Cross-Platform (Exploring)",
    tech: ["Flutter (Exploring)", "Dart", "PWA", "Responsive UI"],
    x: 105,
    y: 335,
    labelPosition: "left",
    icon: Smartphone,
    color: "#54c5f8", // flutter blue
    glowColor: "rgba(84, 197, 248, 0.4)",
  },
];

export function ArchitectureVisualization() {
  const shouldReduceMotion = useReducedMotion();
  const [activeNode, setActiveNode] = useState<NodeData | null>(null);

  // Center cube coordinate
  const cx = 250;
  const cy = 250;

  return (
    <div
      className="relative flex items-center justify-center w-full max-w-[500px] mx-auto select-none"
      role="region"
      aria-label="HZ Labs interactive software architecture diagram showing connected system tiers"
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-violet-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

      <svg
        viewBox="0 0 500 500"
        className="w-full h-auto overflow-visible filter drop-shadow-[0_0_30px_rgba(139,92,246,0.15)]"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="coreCubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="coreCubeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="coreCubeRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2e1065" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="lineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id="centerAtmosphere" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central atmospheric glow */}
        <circle cx={cx} cy={cy} r="180" fill="url(#centerAtmosphere)" />

        {/* Orbital ring (Hexagonal perimeter connecting the 6 nodes) */}
        <polygon
          points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
          fill="none"
          stroke="rgba(148, 163, 184, 0.15)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Outer subtle orbital boundary circle */}
        <circle
          cx={cx}
          cy={cy}
          r="190"
          fill="none"
          stroke="rgba(148, 163, 184, 0.08)"
          strokeWidth="1"
        />

        {/* Connective radiating lines from center to nodes */}
        {NODES.map((node) => {
          const isHighlighted = activeNode?.id === node.id;
          return (
            <g key={`line-${node.id}`}>
              <line
                x1={cx}
                y1={cy}
                x2={node.x}
                y2={node.y}
                stroke={isHighlighted ? node.color : "rgba(148, 163, 184, 0.25)"}
                strokeWidth={isHighlighted ? "2" : "1.2"}
                strokeDasharray={isHighlighted ? "none" : "3 3"}
                className="transition-colors duration-300"
              />

              {/* Animated pulse packet along the line */}
              {!shouldReduceMotion && (
                <motion.circle
                  r={isHighlighted ? "3" : "2"}
                  fill={isHighlighted ? node.color : "#a855f7"}
                  filter={isHighlighted ? "url(#glowFilter)" : undefined}
                  initial={{
                    cx,
                    cy,
                    opacity: 0,
                  }}
                  animate={{
                    cx: [cx, node.x],
                    cy: [cy, node.y],
                    opacity: [0, 0.9, 0],
                  }}
                  transition={{
                    duration: isHighlighted ? 1.5 : 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: NODES.indexOf(node) * 0.4,
                  }}
                />
              )}
            </g>
          );
        })}

        {/* ======================================================== */}
        {/* Central Isometric Core Cube Engine                       */}
        {/* ======================================================== */}
        <g
          className="cursor-pointer"
          onMouseEnter={() =>
            setActiveNode({
              id: "core",
              name: "HZ Labs Engine",
              category: "Central Architecture",
              tech: ["Full-Stack Orchestration", "Microservices", "Event-Driven", "Cloud Native"],
              x: cx,
              y: cy,
              labelPosition: "bottom",
              icon: Layers,
              color: "#a855f7",
              glowColor: "rgba(168, 85, 247, 0.5)",
            })
          }
          onMouseLeave={() => setActiveNode(null)}
        >
          {/* Isometric Cube Dimensions */}
          {/* Center = 250, 250. Radius ~ 35. Height ~ 35 */}
          {/* Top Face */}
          <polygon
            points="250,222 280,238 250,254 220,238"
            fill="url(#coreCubeTop)"
            stroke="#a855f7"
            strokeWidth="1.2"
          />
          {/* Left Face */}
          <polygon
            points="220,238 250,254 250,288 220,272"
            fill="url(#coreCubeLeft)"
            stroke="#6366f1"
            strokeWidth="1.2"
          />
          {/* Right Face */}
          <polygon
            points="250,254 280,238 280,272 250,288"
            fill="url(#coreCubeRight)"
            stroke="#38bdf8"
            strokeWidth="1.2"
          />

          {/* Glowing central core point */}
          <circle
            cx={cx}
            cy={cy + 4}
            r="5"
            fill="#38bdf8"
            filter="url(#glowFilter)"
          />

          {!shouldReduceMotion && (
            <motion.circle
              cx={cx}
              cy={cy + 4}
              r="14"
              fill="none"
              stroke="#a855f7"
              strokeWidth="1.5"
              initial={{ scale: 0.8, opacity: 0.4 }}
              animate={{
                scale: [0.8, 1.4, 0.8],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </g>

        {/* ======================================================== */}
        {/* Orbital Nodes                                            */}
        {/* ======================================================== */}
        {NODES.map((node) => {
          const isHovered = activeNode?.id === node.id;
          const Icon = node.icon;

          return (
            <g
              key={node.id}
              tabIndex={0}
              role="button"
              aria-label={`${node.name} architecture tier: ${node.tech.join(", ")}`}
              onMouseEnter={() => setActiveNode(node)}
              onMouseLeave={() => setActiveNode(null)}
              onFocus={() => setActiveNode(node)}
              onBlur={() => setActiveNode(null)}
              className="cursor-pointer focus:outline-none"
            >
              {/* Outer halo on hover */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? 26 : 22}
                fill={isHovered ? node.glowColor : "rgba(15, 23, 42, 0.8)"}
                stroke={isHovered ? node.color : "rgba(148, 163, 184, 0.3)"}
                strokeWidth={isHovered ? "2" : "1"}
                className="transition-all duration-300"
              />

              {/* Node Icon container */}
              <foreignObject
                x={node.x - 12}
                y={node.y - 12}
                width={24}
                height={24}
                className="pointer-events-none"
              >
                <div className="flex items-center justify-center w-full h-full">
                  <Icon
                    size={16}
                    className="transition-colors duration-300"
                    style={{ color: isHovered ? node.color : "#94a3b8" }}
                  />
                </div>
              </foreignObject>

              {/* Label text */}
              <text
                x={
                  node.labelPosition === "left"
                    ? node.x - 30
                    : node.labelPosition === "right"
                    ? node.x + 30
                    : node.x
                }
                y={
                  node.labelPosition === "top"
                    ? node.y - 30
                    : node.labelPosition === "bottom"
                    ? node.y + 36
                    : node.y + 4
                }
                textAnchor={
                  node.labelPosition === "left"
                    ? "end"
                    : node.labelPosition === "right"
                    ? "start"
                    : "middle"
                }
                fill={isHovered ? "#ffffff" : "#94a3b8"}
                fontSize="11"
                fontFamily="var(--font-mono, monospace)"
                fontWeight={isHovered ? "600" : "400"}
                className="transition-all duration-200 tracking-wider uppercase select-none"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Info Pill on Hover */}
      {activeNode && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 studio-glass border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3 z-30 min-w-[240px]"
        >
          <div
            className="w-2.5 h-2.5 rounded-full animate-ping shrink-0"
            style={{ backgroundColor: activeNode.color }}
          />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                {activeNode.category}
              </span>
              <span className="text-slate-600">·</span>
              <span
                className="font-mono text-xs font-semibold"
                style={{ color: activeNode.color }}
              >
                {activeNode.name}
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-300 mt-0.5">
              {activeNode.tech.join(" · ")}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
