"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  vx: number;
  vy: number;
  pulseSpeed: number;
  pulsePhase: number;
  isCyan: boolean;
}

/**
 * GlobalBackground — Fixed, continuous, futuristic HUD background across the entire portfolio.
 *
 * Implements the 6-layer specification:
 *  Layer 1: Solid #040710 background
 *  Layer 2: Very subtle ambient radial blue glows (#07101F, #10243A, #5DBBFF at 0.03-0.05)
 *  Layer 3: Lightweight canvas floating particles (HUD blue & cyan, non-teleporting, continuous)
 *  Layer 4: Large translucent geometric shapes (slow-rotating wireframe hexagons & polygons)
 *  Layer 5: Ghosted technology words ("Next.js", "React", "Node.js", "TypeScript", "Java", "MongoDB", "Spring Boot", "Flutter", "AWS") at 0.02-0.06 opacity
 *  Layer 6: Faint futuristic dot grid & scanline texture
 *
 * Fixed to the viewport at z-index -1. Never resets on scroll or route changes.
 */
export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

  // Target particle count: 48 desktop, 24 tablet, 14 mobile
  const particleCount = isDesktop ? 48 : isTablet ? 24 : 14;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize deterministic, stable particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.9 + Math.random() * 1.3, // 0.9px - 2.2px
        baseAlpha: 0.15 + Math.random() * 0.35, // 0.15 - 0.50
        vx: (Math.random() - 0.5) * 0.18, // Slow horizontal drift
        vy: -0.08 - Math.random() * 0.16, // Gentle upward float
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        isCyan: Math.random() > 0.45,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReduced) {
          p.x += p.vx;
          p.y += p.vy;
          p.pulsePhase += p.pulseSpeed;

          // Wrap edges smoothly
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        const alpha = Math.max(
          0.08,
          Math.min(0.65, p.baseAlpha * (0.75 + 0.25 * Math.sin(p.pulsePhase)))
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // HUD Blue #5DBBFF or Cyan #72D8FF
        ctx.fillStyle = p.isCyan
          ? `rgba(114, 216, 255, ${alpha})`
          : `rgba(93, 187, 255, ${alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.isCyan ? "rgba(114, 216, 255, 0.4)" : "rgba(93, 187, 255, 0.35)";
        ctx.fill();
      }

      if (!prefersReduced) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [particleCount, prefersReduced]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden select-none"
      aria-hidden="true"
      style={{ backgroundColor: "#040710" }}
    >
      {/* ─── LAYER 1 & 2: Solid Base & Subtle Ambient Radial Blue Glows ─── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 70% 50% at 15% 10%, rgba(16, 36, 58, 0.42) 0%, transparent 65%)",
            "radial-gradient(ellipse 60% 45% at 85% 35%, rgba(7, 16, 31, 0.65) 0%, transparent 70%)",
            "radial-gradient(ellipse 65% 50% at 28% 75%, rgba(16, 36, 58, 0.38) 0%, transparent 60%)",
            "radial-gradient(circle at 65% 18%, rgba(93, 187, 255, 0.035) 0%, transparent 45%)",
          ].join(", "),
        }}
      />

      {/* ─── LAYER 6: Extremely Faint Futuristic Dot Grid & Scanlines ─── */}
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: "radial-gradient(rgba(93, 187, 255, 0.032) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="absolute inset-0 opacity-40 hidden sm:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(93, 187, 255, 0.012) 3px, transparent 4px)",
        }}
      />

      {/* ─── LAYER 4: Large Translucent Geometric / HUD Shapes ─── */}
      {/* Shape 1: Large rotating hexagon wireframe — Top Right */}
      <svg
        className="absolute -top-16 -right-16 w-[380px] h-[380px] md:w-[480px] md:h-[480px] opacity-[0.038] animate-hud-spin pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="200,20 356,110 356,290 200,380 44,290 44,110"
          stroke="#5DBBFF"
          strokeWidth="1.5"
          strokeDasharray="8 8"
        />
        <circle cx="200" cy="200" r="130" stroke="#72D8FF" strokeWidth="1" strokeDasharray="3 9" />
        <circle cx="200" cy="200" r="4" fill="#5DBBFF" />
      </svg>

      {/* Shape 2: Concentric HUD polygon — Mid-Left */}
      <svg
        className="absolute top-[38%] -left-20 w-[320px] h-[320px] md:w-[420px] md:h-[420px] opacity-[0.032] animate-hud-spin-reverse pointer-events-none"
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points="180,30 310,105 310,255 180,330 50,255 50,105"
          stroke="#5DBBFF"
          strokeWidth="1.2"
        />
        <polygon
          points="180,75 270,127 270,233 180,285 90,233 90,127"
          stroke="#72D8FF"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Shape 3: Geometric Compass Coordinate Ring — Bottom Right */}
      <svg
        className="absolute -bottom-24 right-[10%] w-[360px] h-[360px] md:w-[460px] md:h-[460px] opacity-[0.03] animate-hud-spin pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="200" cy="200" r="160" stroke="#5DBBFF" strokeWidth="1" strokeDasharray="4 8" />
        <line x1="200" y1="20" x2="200" y2="60" stroke="#5DBBFF" strokeWidth="1.5" />
        <line x1="200" y1="340" x2="200" y2="380" stroke="#5DBBFF" strokeWidth="1.5" />
        <line x1="20" y1="200" x2="60" y2="200" stroke="#5DBBFF" strokeWidth="1.5" />
        <line x1="340" y1="200" x2="380" y2="200" stroke="#5DBBFF" strokeWidth="1.5" />
      </svg>

      {/* ─── LAYER 5: Ghosted Technology Words (0.025 - 0.055 opacity) ─── */}
      <div className="absolute inset-0 overflow-hidden font-mono font-bold uppercase tracking-wider text-[#5DBBFF]">
        {/* Next.js */}
        <span
          className="absolute top-[11%] left-[5%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.045] animate-word-drift-1"
          style={{ willChange: "transform" }}
        >
          Next.js
        </span>

        {/* React */}
        <span
          className="absolute top-[21%] right-[6%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.04] animate-word-drift-2"
          style={{ willChange: "transform" }}
        >
          React
        </span>

        {/* Flutter */}
        <span
          className="absolute top-[33%] left-[45%] text-4xl sm:text-5xl md:text-6xl opacity-[0.028] animate-word-drift-3 -translate-x-1/2"
          style={{ willChange: "transform" }}
        >
          Flutter
        </span>

        {/* TypeScript */}
        <span
          className="absolute top-[43%] left-[3%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.042] animate-word-drift-2"
          style={{ willChange: "transform" }}
        >
          TypeScript
        </span>

        {/* Node.js */}
        <span
          className="absolute top-[52%] right-[5%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.038] animate-word-drift-1"
          style={{ willChange: "transform" }}
        >
          Node.js
        </span>

        {/* MongoDB */}
        <span
          className="absolute top-[65%] left-[7%] text-4xl sm:text-5xl md:text-6xl lg:text-7xl opacity-[0.035] animate-word-drift-3"
          style={{ willChange: "transform" }}
        >
          MongoDB
        </span>

        {/* Spring Boot */}
        <span
          className="absolute top-[72%] right-[8%] text-4xl sm:text-5xl md:text-6xl lg:text-7xl opacity-[0.034] animate-word-drift-2"
          style={{ willChange: "transform" }}
        >
          Spring Boot
        </span>

        {/* Java */}
        <span
          className="absolute top-[85%] left-[12%] text-5xl sm:text-6xl md:text-7xl opacity-[0.04] animate-word-drift-1"
          style={{ willChange: "transform" }}
        >
          Java
        </span>

        {/* AWS */}
        <span
          className="absolute top-[87%] right-[14%] text-5xl sm:text-6xl md:text-7xl opacity-[0.038] animate-word-drift-3"
          style={{ willChange: "transform" }}
        >
          AWS
        </span>
      </div>

      {/* ─── LAYER 3: Floating Subtle Glowing Particles (HTML5 Canvas) ─── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
