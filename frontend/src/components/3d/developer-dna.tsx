"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Line, OrbitControls, Html } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { X, FolderGit2, Award, GitBranch } from "lucide-react";
import * as THREE from "three";
import type { Skill, Project, GithubSummary, Certificate } from "@/lib/types";

type Vec3 = [number, number, number];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "#60a5fa",
  Backend: "#a78bfa",
  Database: "#34d399",
  Tools: "#fbbf24",
  DevOps: "#fb7185",
  Language: "#38bdf8",
  Cloud: "#f472b6",
};

const YOU_COLOR = "#22d3ee";

function colorFor(category: string): string {
  return CATEGORY_COLORS[category] ?? "#94a3b8";
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type GraphNode = {
  id: string;
  kind: "you" | "category" | "skill";
  label: string;
  category: string;
  color: string;
  position: Vec3;
  proficiency?: number;
  skill?: Skill;
};

type GraphLink = { from: Vec3; to: Vec3; color: string; hub: boolean };

// ── A single glowing packet travelling from a hub back to the core ──
function Pulse({ from, to, color, offset }: { from: Vec3; to: Vec3; color: string; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.35 + offset) % 1;
    ref.current.position.set(
      THREE.MathUtils.lerp(from[0], to[0], t),
      THREE.MathUtils.lerp(from[1], to[1], t),
      THREE.MathUtils.lerp(from[2], to[2], t),
    );
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 10, 10]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function Node({
  node,
  active,
  dimmed,
  onHover,
  onSelect,
}: {
  node: GraphNode;
  active: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: (node: GraphNode) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const baseRadius =
    node.kind === "you" ? 0.72 : node.kind === "category" ? 0.42 : 0.22 + ((node.proficiency ?? 60) / 100) * 0.18;

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    let target = active ? 1.4 : 1;
    if (node.kind === "you") {
      target *= 1 + Math.sin(state.clock.elapsedTime * 2) * 0.06;
    }
    const next = mesh.scale.x + (target - mesh.scale.x) * 0.15;
    mesh.scale.setScalar(next);
  });

  return (
    <mesh
      ref={ref}
      position={node.position}
      onPointerOver={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onHover(node.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        onHover(null);
        document.body.style.cursor = "auto";
      }}
      onClick={(event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        onSelect(node);
      }}
    >
      <sphereGeometry args={[baseRadius, 32, 32]} />
      <meshStandardMaterial
        color={node.color}
        emissive={node.color}
        emissiveIntensity={active ? 1.5 : 0.55}
        roughness={0.25}
        metalness={0.4}
        transparent
        opacity={dimmed ? 0.25 : 1}
      />
      {(active || node.kind !== "skill") && (
        <Html center distanceFactor={12} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
          <div
            className={
              node.kind === "you"
                ? "whitespace-nowrap rounded-md bg-cyan-500/20 px-2 py-0.5 text-[11px] font-semibold text-cyan-100 ring-1 ring-cyan-400/40"
                : "whitespace-nowrap rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-medium text-slate-100 ring-1 ring-white/10"
            }
            style={{ opacity: dimmed ? 0.35 : 1 }}
          >
            {node.label}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Graph({
  nodes,
  links,
  hovered,
  selectedId,
  onHover,
  onSelect,
}: {
  nodes: GraphNode[];
  links: GraphLink[];
  hovered: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (node: GraphNode) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const activeId = hovered ?? selectedId;

  // Which category is currently focused (for dimming everything else).
  const focusCategory = useMemo(() => {
    if (!activeId) return null;
    const node = nodes.find((n) => n.id === activeId);
    if (!node || node.kind === "you") return null;
    return node.category;
  }, [activeId, nodes]);

  const hubLinks = useMemo(() => links.filter((l) => l.hub), [links]);

  return (
    <group ref={groupRef}>
      {links.map((link, index) => {
        const dim = focusCategory !== null && link.color !== colorFor(focusCategory);
        return (
          <Line
            key={`link-${index}`}
            points={[link.from, link.to]}
            color={link.color}
            lineWidth={link.hub ? 1.6 : 1}
            transparent
            opacity={dim ? 0.06 : link.hub ? 0.5 : 0.28}
          />
        );
      })}

      {hubLinks.map((link, index) => (
        <Pulse
          key={`pulse-${index}`}
          from={link.to}
          to={link.from}
          color={link.color}
          offset={index / Math.max(1, hubLinks.length)}
        />
      ))}

      {nodes.map((node) => {
        const isActive = activeId === node.id;
        const dimmed = focusCategory !== null && node.kind !== "you" && node.category !== focusCategory && !isActive;
        return (
          <Node
            key={node.id}
            node={node}
            active={isActive}
            dimmed={dimmed}
            onHover={onHover}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

// ── Details computed for the currently selected node ──
function relatedFor(
  node: GraphNode,
  projects: Project[],
  github: GithubSummary,
  certificates: Certificate[],
) {
  const key = normalize(node.label);
  const matches = (value?: string | null) => {
    if (!value) return false;
    const n = normalize(value);
    return n === key || n.includes(key) || key.includes(n);
  };

  const matchedProjects = projects.filter((project) => project.techStack.some((tech) => matches(tech)));
  const repos = Array.isArray(github?.recentRepos) ? github.recentRepos : [];
  const matchedRepos = repos.filter(
    (repo) => matches(repo.language) || (repo.topics ?? []).some((topic) => matches(topic)),
  );
  const matchedCerts = certificates.filter((cert) => matches(cert.title) || matches(cert.issuer));

  return { matchedProjects, matchedRepos, matchedCerts };
}

function DetailPanel({
  node,
  nodes,
  projects,
  github,
  certificates,
  onClose,
}: {
  node: GraphNode;
  nodes: GraphNode[];
  projects: Project[];
  github: GithubSummary;
  certificates: Certificate[];
  onClose: () => void;
}) {
  if (node.kind === "you") {
    const categories = nodes.filter((n) => n.kind === "category");
    const skillCount = nodes.filter((n) => n.kind === "skill").length;
    return (
      <PanelShell title={node.label} subtitle="The full stack, connected" color={YOU_COLOR} onClose={onClose}>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Skills" value={skillCount} />
          <Stat label="Domains" value={categories.length} />
          <Stat label="Projects" value={projects.length} />
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-400">
          Click any node to trace how a technology connects to the projects, repositories and credentials that prove it.
        </p>
      </PanelShell>
    );
  }

  if (node.kind === "category") {
    const skills = nodes.filter((n) => n.kind === "skill" && n.category === node.category);
    return (
      <PanelShell title={node.label} subtitle={`${skills.length} skills`} color={node.color} onClose={onClose}>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/10"
            >
              {skill.label}
            </span>
          ))}
        </div>
      </PanelShell>
    );
  }

  const { matchedProjects, matchedRepos, matchedCerts } = relatedFor(node, projects, github, certificates);
  return (
    <PanelShell
      title={node.label}
      subtitle={node.category}
      color={node.color}
      onClose={onClose}
    >
      {typeof node.proficiency === "number" && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Proficiency</span>
            <span>{node.proficiency}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full" style={{ width: `${node.proficiency}%`, backgroundColor: node.color }} />
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {matchedProjects.length > 0 && (
          <DetailRow icon={<FolderGit2 className="h-3.5 w-3.5" />} label={`Used in ${matchedProjects.length} project${matchedProjects.length > 1 ? "s" : ""}`}>
            {matchedProjects.slice(0, 4).map((project) => (
              <a
                key={project.id}
                href={`/projects/${project.slug}`}
                className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
              >
                {project.title}
              </a>
            ))}
          </DetailRow>
        )}

        {matchedRepos.length > 0 && (
          <DetailRow icon={<GitBranch className="h-3.5 w-3.5" />} label={`${matchedRepos.length} repositor${matchedRepos.length > 1 ? "ies" : "y"}`}>
            {matchedRepos.slice(0, 4).map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white"
              >
                {repo.name}
              </a>
            ))}
          </DetailRow>
        )}

        {matchedCerts.length > 0 && (
          <DetailRow icon={<Award className="h-3.5 w-3.5" />} label={`${matchedCerts.length} credential${matchedCerts.length > 1 ? "s" : ""}`}>
            {matchedCerts.slice(0, 4).map((cert) => (
              <span
                key={cert.id}
                className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-200 ring-1 ring-white/10"
              >
                {cert.title}
              </span>
            ))}
          </DetailRow>
        )}

        {matchedProjects.length === 0 && matchedRepos.length === 0 && matchedCerts.length === 0 && (
          <p className="text-xs leading-5 text-slate-400">
            Part of the toolkit — no linked projects or repositories tagged with this yet.
          </p>
        )}
      </div>
    </PanelShell>
  );
}

function PanelShell({
  title,
  subtitle,
  color,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  color: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="pointer-events-auto absolute inset-x-3 bottom-3 z-20 max-h-[62%] overflow-y-auto rounded-xl border border-white/10 bg-slate-950/85 p-4 backdrop-blur-xl"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
          <div>
            <h3 className="font-display text-base font-semibold leading-tight text-white">{title}</h3>
            <p className="text-[11px] capitalize text-slate-400">{subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {children}
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-center">
      <div className="font-display text-xl font-semibold text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
        <span className="text-blue-300">{icon}</span>
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function DeveloperDNA({
  skills,
  projects,
  github,
  certificates,
  name = "You",
}: {
  skills: Skill[];
  projects: Project[];
  github: GithubSummary;
  certificates: Certificate[];
  name?: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);

  const { nodes, links } = useMemo(() => {
    const graphNodes: GraphNode[] = [];
    const graphLinks: GraphLink[] = [];

    const you: GraphNode = {
      id: "you",
      kind: "you",
      label: initialsOf(name) || "You",
      category: "you",
      color: YOU_COLOR,
      position: [0, 0, 0],
    };
    graphNodes.push(you);

    const categories = [...new Set(skills.map((skill) => skill.category))];
    const hubRadius = 4.4;

    categories.forEach((category, categoryIndex) => {
      const angle = (categoryIndex / Math.max(1, categories.length)) * Math.PI * 2;
      const hubPosition: Vec3 = [
        Math.cos(angle) * hubRadius,
        Math.sin(angle) * hubRadius * 0.62,
        Math.sin(angle * 1.4) * 1.3,
      ];
      const color = colorFor(category);

      graphNodes.push({
        id: `cat-${category}`,
        kind: "category",
        label: category,
        category,
        color,
        position: hubPosition,
      });
      graphLinks.push({ from: [0, 0, 0], to: hubPosition, color, hub: true });

      const categorySkills = skills.filter((skill) => skill.category === category);
      categorySkills.forEach((skill, skillIndex) => {
        const leafAngle = (skillIndex / Math.max(1, categorySkills.length)) * Math.PI * 2;
        const leafRadius = 1.7 + (categorySkills.length > 6 ? 0.5 : 0);
        const leafPosition: Vec3 = [
          hubPosition[0] + Math.cos(leafAngle) * leafRadius,
          hubPosition[1] + Math.sin(leafAngle) * leafRadius,
          hubPosition[2] + Math.cos(leafAngle * 1.5) * 0.7,
        ];
        graphNodes.push({
          id: skill.id,
          kind: "skill",
          label: skill.name,
          category,
          color,
          position: leafPosition,
          proficiency: skill.proficiency,
          skill,
        });
        graphLinks.push({ from: hubPosition, to: leafPosition, color, hub: false });
      });
    });

    return { nodes: graphNodes, links: graphLinks };
  }, [skills, name]);

  if (skills.length === 0) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center rounded-xl border border-white/10 bg-[#050816] text-sm text-slate-500">
        Developer DNA activates once skills are added.
      </div>
    );
  }

  const anyActive = hovered !== null || selected !== null;

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#050816] shadow-2xl">
      {/* Header label */}
      <div className="pointer-events-none absolute left-4 top-4 z-10">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Developer DNA</div>
        <div className="mt-0.5 text-[11px] text-slate-500">How the stack connects</div>
      </div>

      {/* Top & bottom fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-16 bg-gradient-to-b from-[#050816] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-16 bg-gradient-to-t from-[#050816] to-transparent" />

      <Canvas
        camera={{ position: [0, 0, 13], fov: 50 }}
        onPointerMissed={() => setSelected(null)}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#60a5fa" />
        <pointLight position={[-10, -8, -10]} intensity={2} color="#a78bfa" />
        <Graph
          nodes={nodes}
          links={links}
          hovered={hovered}
          selectedId={selected?.id ?? null}
          onHover={setHovered}
          onSelect={setSelected}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!anyActive}
          autoRotateSpeed={0.6}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Hint */}
      {!selected && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 text-center text-[11px] text-slate-500">
          Drag to rotate · click a node to explore
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <DetailPanel
            key={selected.id}
            node={selected}
            nodes={nodes}
            projects={projects}
            github={github}
            certificates={certificates}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
