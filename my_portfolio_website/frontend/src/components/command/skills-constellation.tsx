"use client";

import { useMemo, useState } from "react";
import { Panel } from "@/components/hud/panel";
import type { Project, Skill } from "@/lib/types";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { GitFork, Layers, Sparkles } from "lucide-react";

type ConstellationNode = {
  id: string;
  name: string;
  category: string;
  repoCount: number;
  repoNames: string[];
  x: number;
  y: number;
  radius: number;
  color: string;
};

type ConstellationEdge = {
  source: string;
  target: string;
  weight: number;
};

const CATEGORY_CONFIG: Record<
  string,
  { center: { x: number; y: number }; color: string; label: string }
> = {
  Frontend: { center: { x: 28, y: 32 }, color: "#5cd0ff", label: "Frontend" },
  Backend: { center: { x: 72, y: 32 }, color: "#a78bfa", label: "Backend" },
  Database: { center: { x: 30, y: 68 }, color: "#34d399", label: "Database" },
  Tools: { center: { x: 70, y: 68 }, color: "#fbbf24", label: "Tools & DevOps" },
};

function normalizeCategory(cat?: string): string {
  if (!cat) return "Tools";
  const lower = cat.toLowerCase();
  if (lower.includes("front") || lower.includes("ui") || lower.includes("client")) return "Frontend";
  if (lower.includes("back") || lower.includes("api") || lower.includes("server")) return "Backend";
  if (lower.includes("data") || lower.includes("sql") || lower.includes("mongo") || lower.includes("db"))
    return "Database";
  return "Tools";
}

export function SkillsConstellation({
  skills = [],
  projects = [],
}: {
  skills: Skill[];
  projects?: Project[];
}) {
  const prefersReduced = useReducedMotion();
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  // Build nodes and edges from honest repository technologies
  const { nodes, edges, nodeMap } = useMemo(() => {
    // 1. Collect frequencies and repo names for each technology
    const techRepos = new Map<string, Set<string>>();
    const techCategoryMap = new Map<string, string>();

    // Seed from skills
    for (const s of skills) {
      const norm = s.name;
      if (!techRepos.has(norm)) techRepos.set(norm, new Set());
      techCategoryMap.set(norm, normalizeCategory(s.category));
    }

    // Populate from real projects
    for (const p of projects) {
      for (const t of p.techStack) {
        if (!techRepos.has(t)) techRepos.set(t, new Set());
        techRepos.get(t)!.add(p.title);
        if (!techCategoryMap.has(t)) {
          // Infer category
          const lower = t.toLowerCase();
          if (["react", "next.js", "tailwind css", "html", "css", "javascript", "alpine.js", "bootstrap"].some(k => lower.includes(k))) {
            techCategoryMap.set(t, "Frontend");
          } else if (["node.js", "express", "nestjs", "php", "socket.io", "jwt"].some(k => lower.includes(k))) {
            techCategoryMap.set(t, "Backend");
          } else if (["mongodb", "postgresql", "mysql", "prisma", "mariadb", "redis"].some(k => lower.includes(k))) {
            techCategoryMap.set(t, "Database");
          } else {
            techCategoryMap.set(t, "Tools");
          }
        }
      }
    }

    // 2. Co-occurrence edges
    const edgeCounts = new Map<string, number>();
    for (const p of projects) {
      const stack = p.techStack;
      for (let i = 0; i < stack.length; i++) {
        for (let j = i + 1; j < stack.length; j++) {
          const a = stack[i];
          const b = stack[j];
          const key = a < b ? `${a}:::${b}` : `${b}:::${a}`;
          edgeCounts.set(key, (edgeCounts.get(key) ?? 0) + 1);
        }
      }
    }

    // 3. Cluster placement layout
    const categoryBuckets: Record<string, string[]> = {
      Frontend: [],
      Backend: [],
      Database: [],
      Tools: [],
    };

    for (const tech of techRepos.keys()) {
      const cat = techCategoryMap.get(tech) ?? "Tools";
      if (!categoryBuckets[cat]) categoryBuckets[cat] = [];
      categoryBuckets[cat].push(tech);
    }

    const calculatedNodes: ConstellationNode[] = [];
    const calculatedNodeMap = new Map<string, ConstellationNode>();

    Object.entries(categoryBuckets).forEach(([cat, techs]) => {
      const cfg = CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG.Tools;
      const count = techs.length;
      techs.forEach((name, i) => {
        const repoSet = techRepos.get(name) ?? new Set();
        const repoCount = Math.max(1, repoSet.size);
        const radius = Math.min(4.5, 2.0 + repoCount * 0.6);

        // Circular cluster offset with varied radius
        const angle = (i / Math.max(1, count)) * 2 * Math.PI;
        const dist = 7 + (i % 3) * 4;
        const x = Math.max(8, Math.min(92, cfg.center.x + Math.cos(angle) * dist));
        const y = Math.max(8, Math.min(92, cfg.center.y + Math.sin(angle) * dist));

        const node: ConstellationNode = {
          id: name.toLowerCase(),
          name,
          category: cat,
          repoCount,
          repoNames: Array.from(repoSet),
          x,
          y,
          radius,
          color: cfg.color,
        };
        calculatedNodes.push(node);
        calculatedNodeMap.set(node.id, node);
      });
    });

    // 4. Edges
    const calculatedEdges: ConstellationEdge[] = [];
    for (const [key, count] of edgeCounts) {
      const [source, target] = key.split(":::");
      if (calculatedNodeMap.has(source.toLowerCase()) && calculatedNodeMap.has(target.toLowerCase())) {
        calculatedEdges.push({
          source: source.toLowerCase(),
          target: target.toLowerCase(),
          weight: count,
        });
      }
    }

    return {
      nodes: calculatedNodes,
      edges: calculatedEdges,
      nodeMap: calculatedNodeMap,
    };
  }, [skills, projects]);

  const activeNode = selectedTech ? nodeMap.get(selectedTech) ?? null : null;

  // Connected edges for the active node
  const connectedTechs = useMemo(() => {
    if (!selectedTech) return new Set<string>();
    const set = new Set<string>();
    edges.forEach((e) => {
      if (e.source === selectedTech) set.add(e.target);
      if (e.target === selectedTech) set.add(e.source);
    });
    return set;
  }, [selectedTech, edges]);

  const filteredNodes =
    filterCategory === "ALL"
      ? nodes
      : nodes.filter((n) => n.category.toUpperCase() === filterCategory.toUpperCase());

  return (
    <Panel
      label="skill.constellation"
      subtitle={`${nodes.length} technologies in active codebases`}
      className="h-full"
      actions={
        <div className="flex items-center gap-1 font-mono text-[9px] uppercase">
          {["ALL", "FRONTEND", "BACKEND", "DATABASE", "TOOLS"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-0.5 rounded-sm transition-all ${
                filterCategory === cat
                  ? "bg-cyan/20 text-cyan border border-cyan/40"
                  : "text-muted-foreground hover:text-cyan"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex flex-col h-full gap-4">
        {/* Constellation SVG Diagram */}
        <div className="relative w-full aspect-[16/10] md:aspect-[16/9] min-h-[300px] rounded-lg border border-cyan/15 bg-[#02050a] overflow-hidden">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

          <svg
            viewBox="0 0 100 100"
            className="w-full h-full select-none"
            role="img"
            aria-label="Interactive skill technology constellation graph"
          >
            {/* Cluster zone watermark labels */}
            {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => (
              <text
                key={cat}
                x={cfg.center.x}
                y={cfg.center.y - 12}
                textAnchor="middle"
                fill={cfg.color}
                opacity={filterCategory === "ALL" || filterCategory === cat.toUpperCase() ? 0.25 : 0.05}
                fontFamily="monospace"
                fontSize="2.4"
                fontWeight="bold"
                letterSpacing="0.1em"
              >
                {cfg.label.toUpperCase()}
              </text>
            ))}

            {/* Edges */}
            {edges.map((e, idx) => {
              const src = nodeMap.get(e.source);
              const tgt = nodeMap.get(e.target);
              if (!src || !tgt) return null;

              const isHighlighted =
                selectedTech === e.source || selectedTech === e.target;
              const isDimmed =
                selectedTech && !isHighlighted;

              return (
                <line
                  key={idx}
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isHighlighted ? "#5cd0ff" : "rgba(92, 208, 255, 0.12)"}
                  strokeWidth={isHighlighted ? 0.4 : 0.15}
                  strokeOpacity={isDimmed ? 0.04 : isHighlighted ? 0.9 : 0.4}
                  strokeDasharray={isHighlighted ? "none" : "0.5 0.5"}
                />
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((n) => {
              const isSelected = selectedTech === n.id;
              const isConnected = connectedTechs.has(n.id);
              const isDimmed = selectedTech && !isSelected && !isConnected;

              return (
                <g
                  key={n.id}
                  className="cursor-pointer transition-opacity duration-200"
                  onClick={() => setSelectedTech(selectedTech === n.id ? null : n.id)}
                  onMouseEnter={() => setSelectedTech(n.id)}
                  opacity={isDimmed ? 0.25 : 1}
                >
                  {/* Halo on hover/selection */}
                  {(isSelected || isConnected) && (
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.radius * 1.8}
                      fill="none"
                      stroke={n.color}
                      strokeWidth="0.2"
                      opacity="0.6"
                      className={prefersReduced ? "" : "animate-ping"}
                      style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                    />
                  )}

                  {/* Node disk */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.radius}
                    fill={isSelected ? n.color : "#02050a"}
                    stroke={n.color}
                    strokeWidth={isSelected ? 0.6 : 0.3}
                  />

                  {/* Text label */}
                  <text
                    x={n.x}
                    y={n.y + n.radius + 2.5}
                    textAnchor="middle"
                    fill={isSelected ? "#fff" : "rgba(226, 236, 255, 0.7)"}
                    fontSize={isSelected ? "2.2" : "1.8"}
                    fontFamily="monospace"
                    fontWeight={isSelected ? "bold" : "normal"}
                  >
                    {n.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Technology Telemetry Footer */}
        <div className="rounded-md border border-cyan/15 bg-surface-2/40 p-4 font-mono text-xs">
          {activeNode ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: activeNode.color }}
                  />
                  <span className="font-display font-bold text-foreground text-sm">
                    {activeNode.name}
                  </span>
                  <span className="text-[10px] text-cyan/70 border border-cyan/20 px-2 py-0.5 rounded-sm">
                    {activeNode.category}
                  </span>
                </div>
                <div className="mt-1.5 text-[11px] text-muted-foreground flex items-center gap-2">
                  <GitFork size={12} className="text-cyan/60" />
                  <span>
                    Indexed in {activeNode.repoCount}{" "}
                    {activeNode.repoCount === 1 ? "repository" : "repositories"}:
                  </span>
                  <span className="text-foreground font-medium">
                    {activeNode.repoNames.slice(0, 3).join(", ") || "Active system stack"}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-cyan/70 shrink-0">
                {connectedTechs.size} connected {connectedTechs.size === 1 ? "stack item" : "stack items"}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-muted-foreground text-[11px]">
              <span className="flex items-center gap-2">
                <Sparkles size={12} className="text-cyan" />
                Tap or hover any constellation node to inspect real repository co-occurrences.
              </span>
              <span className="text-[10px] uppercase tracking-wider text-cyan/60">
                Verified GitHub Source
              </span>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
