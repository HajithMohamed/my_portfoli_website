"use client";

import { useRef, useEffect, useState } from "react";
import type { Skill } from "@/lib/types";

interface Node {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "rgb(96,165,250)",   // blue
  Backend: "rgb(167,139,250)",   // violet
  Database: "rgb(52,211,153)",   // emerald
  Tools: "rgb(251,191,36)",      // amber
};

const DEFAULT_COLOR = "rgb(148,163,184)"; // slate

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function SkillsGalaxy({ skills }: { skills: Skill[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const hoveredRef = useRef<Node | null>(null);
  const frameRef = useRef<number>(0);
  const [hoveredSkill, setHoveredSkill] = useState<Node | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Build node orbits by category
    const categories = [...new Set(skills.map((s) => s.category))];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    nodesRef.current = skills.map((skill, i) => {
      const catIndex = categories.indexOf(skill.category);
      const baseRadius = 80 + catIndex * 70;
      const catSkills = skills.filter((s) => s.category === skill.category);
      const skillIndex = catSkills.indexOf(skill);
      const angle = (skillIndex / catSkills.length) * Math.PI * 2 + catIndex * 0.5;

      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        x: centerX + baseRadius * Math.cos(angle),
        y: centerY + baseRadius * Math.sin(angle),
        vx: 0,
        vy: 0,
        radius: 8 + (skill.proficiency / 100) * 8,
        angle,
        orbitRadius: baseRadius,
        orbitSpeed: (0.0003 + Math.random() * 0.0002) * (Math.random() > 0.5 ? 1 : -1),
        color: CATEGORY_COLORS[skill.category] ?? DEFAULT_COLOR,
      };
    });

    let t = 0;

    const draw = () => {
      t += 1;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Draw faint orbit rings
      categories.forEach((cat, i) => {
        const r = 80 + i * 70;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.04)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Update node positions (orbit)
      nodesRef.current.forEach((node) => {
        if (hoveredRef.current?.id === node.id) return;
        node.angle += node.orbitSpeed;
        node.x = cx + node.orbitRadius * Math.cos(node.angle);
        node.y = cy + node.orbitRadius * Math.sin(node.angle);
      });

      // Draw connection lines between nearby nodes (same category)
      nodesRef.current.forEach((nodeA, ai) => {
        nodesRef.current.slice(ai + 1).forEach((nodeB) => {
          if (nodeA.category !== nodeB.category) return;
          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 180) return;
          const alpha = (1 - dist / 180) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Draw center avatar
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
      grad.addColorStop(0, "rgba(96,165,250,0.4)");
      grad.addColorStop(1, "rgba(96,165,250,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(96,165,250,0.8)";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("HZ", cx, cy);

      // Draw nodes
      nodesRef.current.forEach((node) => {
        const isHovered = hoveredRef.current?.id === node.id;
        const displayRadius = isHovered ? node.radius * 1.8 : node.radius;

        // Glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, displayRadius * 2.5);
        glow.addColorStop(0, node.color.replace("rgb", "rgba").replace(")", ",0.35)"));
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(node.x, node.y, displayRadius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, displayRadius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? node.color.replace("rgb", "rgba").replace(")", ",0.9)")
          : node.color.replace("rgb", "rgba").replace(")", ",0.6)");
        ctx.fill();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.stroke();

        // Label
        const labelAlpha = isHovered ? 1 : 0.7;
        ctx.fillStyle = `rgba(255,255,255,${labelAlpha})`;
        ctx.font = `${isHovered ? "bold " : ""}${isHovered ? 12 : 10}px system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.name, node.x, node.y + displayRadius + 4);
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my };
      let found: Node | null = null;
      nodesRef.current.forEach((node) => {
        const dx = node.x - mx;
        const dy = node.y - my;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius * 2) {
          found = node;
        }
      });
      hoveredRef.current = found;
      setHoveredSkill(found);
      canvas.style.cursor = found ? "pointer" : "default";
    };

    canvas.addEventListener("mousemove", handleMove);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMove);
    };
  }, [skills]);

  return (
    <div className="relative w-full h-[520px]">
      <canvas ref={canvasRef} className="w-full h-full" />
      {hoveredSkill && (
        <div
          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-900/90 backdrop-blur-md px-5 py-3 text-center shadow-2xl"
          style={{ minWidth: 180 }}
        >
          <p className="text-sm font-semibold text-white">{hoveredSkill.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{hoveredSkill.category}</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${hoveredSkill.proficiency}%`,
                backgroundColor: hoveredSkill.color,
              }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{hoveredSkill.proficiency}% proficiency</p>
        </div>
      )}
    </div>
  );
}
