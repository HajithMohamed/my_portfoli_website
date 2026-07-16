"use client";

import { useState } from "react";
import { Panel } from "@/components/hud/panel";

/** The actual production architecture of this platform. */
const NODES = [
  { id: "client", label: "Client / Web", x: 13, y: 28 },
  { id: "edge", label: "Netlify Edge", x: 13, y: 66 },
  { id: "next", label: "Next.js SSR", x: 38, y: 20 },
  { id: "bff", label: "BFF Proxy", x: 38, y: 52 },
  { id: "auth", label: "JWT Auth", x: 55, y: 32 },
  { id: "api", label: "NestJS API", x: 50, y: 76 },
  { id: "prisma", label: "Prisma", x: 72, y: 56 },
  { id: "pg", label: "Postgres", x: 87, y: 72 },
  { id: "cloudinary", label: "Cloudinary", x: 85, y: 28 },
  { id: "github", label: "GitHub API", x: 70, y: 10 },
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

export function ArchitectureMap() {
  const [hover, setHover] = useState<string | null>(null);
  const posById = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <Panel label="architecture.map" subtitle="production stack" live>
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-[360px] w-full"
          role="img"
          aria-label="Interactive architecture diagram of the HZ Labs platform"
        >
          <defs>
            <pattern id="arch-grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path
                d="M 4 0 L 0 0 0 4"
                fill="none"
                stroke="rgba(92,208,255,0.06)"
                strokeWidth="0.15"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#arch-grid)" />

          {[28, 62].map((x) => (
            <line
              key={x}
              x1={x}
              y1={5}
              x2={x}
              y2={95}
              stroke="rgba(92,208,255,0.12)"
              strokeDasharray="0.5 1.2"
              strokeWidth="0.15"
            />
          ))}
          <text x="8" y="97" fill="rgba(92,208,255,0.6)" fontSize="2.2" fontFamily="monospace">
            EDGE
          </text>
          <text x="45" y="97" fill="rgba(92,208,255,0.6)" fontSize="2.2" fontFamily="monospace">
            APPLICATION
          </text>
          <text x="82" y="97" fill="rgba(92,208,255,0.6)" fontSize="2.2" fontFamily="monospace">
            DATA
          </text>

          {EDGES.map(([a, b], i) => {
            const A = posById[a];
            const B = posById[b];
            if (!A || !B) return null;
            const active = hover === a || hover === b;
            return (
              <line
                key={i}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={active ? "#5cd0ff" : "rgba(92,208,255,0.35)"}
                strokeWidth={active ? 0.35 : 0.2}
              />
            );
          })}

          {NODES.map((n) => {
            const active = hover === n.id;
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={active ? 3 : 2}
                  fill="#0a1628"
                  stroke="#5cd0ff"
                  strokeWidth={active ? 0.5 : 0.3}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={active ? 5 : 3.5}
                  fill="none"
                  stroke="#5cd0ff"
                  strokeOpacity={active ? 0.6 : 0.15}
                  strokeWidth={0.2}
                />
                <text
                  x={n.x}
                  y={n.y - 4}
                  textAnchor="middle"
                  fill={active ? "#5cd0ff" : "#d6ecff"}
                  fontSize="2.3"
                  fontFamily="monospace"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 font-mono text-[11px] text-muted-foreground">
        <span className="text-cyan/70">▸ hover</span> a node to trace its connections. This is the
        live architecture behind this site — Next.js frontend, first-party BFF proxy, NestJS API,
        Prisma on Postgres.
      </div>
    </Panel>
  );
}
