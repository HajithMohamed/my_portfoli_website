"use client";

import { useEffect, useState } from "react";
import { Panel } from "@/components/hud/panel";
import { motion } from "framer-motion";

/** The actual production architecture of this platform. */
const NODES = [
  { id: "client", label: "Client / Web", x: 13, y: 28, type: "edge" },
  { id: "edge", label: "Netlify Edge", x: 13, y: 66, type: "edge" },
  { id: "next", label: "Next.js SSR", x: 38, y: 20, type: "app" },
  { id: "bff", label: "BFF Proxy", x: 38, y: 52, type: "app" },
  { id: "auth", label: "JWT Auth", x: 55, y: 32, type: "app" },
  { id: "api", label: "NestJS API", x: 50, y: 76, type: "app" },
  { id: "prisma", label: "Prisma", x: 72, y: 56, type: "data" },
  { id: "pg", label: "Postgres", x: 87, y: 72, type: "data" },
  { id: "cloudinary", label: "Cloudinary", x: 85, y: 28, type: "data" },
  { id: "github", label: "GitHub API", x: 70, y: 10, type: "data" },
];

const EDGES: [string, string][] = [
  ["client", "edge"],
  ["edge", "next"],
  ["next", "bff"],
  ["bff", "api"],
  ["api", "auth"],
  ["api", "prisma"],
  ["prisma", "pg"],
  ["api", "cloudinary"],
  ["api", "github"],
];

const TYPE_COLORS = {
  edge: "#5cd0ff",
  app: "#a78bfa",
  data: "#34d399",
};

export function ArchitectureMap() {
  const [hover, setHover] = useState<string | null>(null);
  const posById = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Panel label="architecture.map" subtitle="production stack" live className="h-full">
      <div className="relative w-full overflow-x-auto touch-pan-x hide-scrollbar rounded-md border border-cyan/10 bg-[#02050a]">
        {/* Glow behind the svg */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan/5 via-transparent to-transparent pointer-events-none" />
        
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="min-w-[600px] w-full h-[250px] md:h-[320px] lg:h-[360px]"
          role="img"
          aria-label="Interactive architecture diagram of the Hz Labs platform"
        >
          <defs>
            <pattern id="arch-grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path
                d="M 4 0 L 0 0 0 4"
                fill="none"
                stroke="rgba(92,208,255,0.03)"
                strokeWidth="0.1"
              />
            </pattern>
            {/* Gradients for edges based on source/target types */}
            {Object.keys(TYPE_COLORS).map(t1 => 
              Object.keys(TYPE_COLORS).map(t2 => (
                <linearGradient key={`${t1}-${t2}`} id={`grad-${t1}-${t2}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={TYPE_COLORS[t1 as keyof typeof TYPE_COLORS]} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={TYPE_COLORS[t2 as keyof typeof TYPE_COLORS]} stopOpacity="0.8" />
                </linearGradient>
              ))
            )}
          </defs>
          <rect width="100" height="100" fill="url(#arch-grid)" />

          {/* Vertical dividers for zones */}
          {[28, 62].map((x) => (
            <line
              key={x}
              x1={x}
              y1={5}
              x2={x}
              y2={95}
              stroke="rgba(92,208,255,0.08)"
              strokeDasharray="0.5 1.5"
              strokeWidth="0.15"
            />
          ))}
          <text x="8" y="97" fill="rgba(92,208,255,0.4)" fontSize="2" fontFamily="monospace" fontWeight="bold">
            EDGE
          </text>
          <text x="45" y="97" fill="rgba(167,139,250,0.4)" fontSize="2" fontFamily="monospace" fontWeight="bold">
            APPLICATION
          </text>
          <text x="82" y="97" fill="rgba(52,211,153,0.4)" fontSize="2" fontFamily="monospace" fontWeight="bold">
            DATA
          </text>

          {/* Edges */}
          {EDGES.map(([a, b], i) => {
            const A = posById[a];
            const B = posById[b];
            if (!A || !B) return null;
            const active = hover === a || hover === b;
            const stroke = active ? `url(#grad-${A.type}-${B.type})` : "rgba(92,208,255,0.15)";
            
            return (
              <g key={i}>
                <motion.line
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                  stroke={stroke}
                  strokeWidth={active ? 0.35 : 0.15}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={mounted ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "easeInOut" }}
                />
                {active && (
                  <circle r="0.8" fill="#fff">
                    <animateMotion
                      dur="2s"
                      repeatCount="indefinite"
                      path={`M ${A.x},${A.y} L ${B.x},${B.y}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {NODES.map((n, i) => {
            const active = hover === n.id;
            const color = TYPE_COLORS[n.type as keyof typeof TYPE_COLORS];
            
            return (
              <motion.g
                key={n.id}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onTouchStart={() => setHover(n.id)}
                style={{ cursor: "crosshair" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={mounted ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.05, type: "spring" }}
              >
                {/* Node halo (pulse when hovered) */}
                {active && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r="4"
                    fill="none"
                    stroke={color}
                    strokeWidth="0.2"
                    opacity="0.5"
                  >
                    <animate attributeName="r" values="2;5" dur="1s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
                
                {/* Outer ring */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={active ? 3.5 : 2.5}
                  fill="none"
                  stroke={color}
                  strokeOpacity={active ? 0.8 : 0.3}
                  strokeWidth={0.2}
                />
                
                {/* Core */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={active ? 2 : 1.5}
                  fill="#02050a"
                  stroke={color}
                  strokeWidth={active ? 0.5 : 0.3}
                />
                
                {/* Label */}
                <text
                  x={n.x}
                  y={n.y - 4.5}
                  textAnchor="middle"
                  fill={active ? "#fff" : "rgba(226,236,255,0.7)"}
                  fontSize="2"
                  fontFamily="monospace"
                  fontWeight={active ? "bold" : "normal"}
                  style={{ textShadow: active ? `0 0 5px ${color}` : "none" }}
                >
                  {n.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>
      <div className="mt-4 font-mono text-[11px] text-muted-foreground flex items-start gap-2">
        <span className="text-cyan text-lg leading-none shrink-0">⎈</span>
        <p>
          <span className="text-cyan/90 font-medium">Tap/Hover</span> a node to trace its connections. 
          This is the live architecture behind this site — Next.js frontend, first-party BFF proxy, 
          NestJS API, Prisma on Postgres.
        </p>
      </div>
    </Panel>
  );
}
