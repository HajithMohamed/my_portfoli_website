"use client";

import { useEffect, useRef, useState } from "react";
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
  colorType: "blue" | "cyan" | "white";
}

/**
 * GlobalSystemBackground
 *
 * ONE unified, fixed, persistent developer workstation / JARVIS HUD background
 * across the entire portfolio.
 *
 * Implements the complete specification:
 *  - Layer 0: Solid dark base (#040710)
 *  - Layer 1: Extremely subtle ambient blue light (low-opacity radial gradients)
 *  - Layer 2: Technical grid (subtle 36px horizontal & vertical lines, 0.02 opacity)
 *  - Layer 3: Telemetry particle system (40-60 desktop, 24 mobile; 1px-3px, slow continuous drift)
 *  - Layer 4: Large geometric HUD objects (huge wireframe hexagons, orbital rings, crosshairs, 45s-90s slow rotation)
 *  - Layer 5: Ghost technology names (Next.js, React, Node.js, TypeScript, Java, Spring Boot, MongoDB, MySQL, NestJS, Flutter, Docker, AWS, Git, GitHub) at 0.018-0.040 opacity
 *  - Layer 6: Background system terminal details (SYS.CORE ONLINE, API.STATUS LIVE, AP-SOUTH-1, UPTIME 99.98%)
 *  - Layer 7: HUD connection lines with traveling telemetry pulse (●────────●)
 *  - Subtle mouse parallax (2-5px smooth offset)
 *
 * Fixed to viewport at z-index -1. Never remounts or restarts on scroll or page navigation.
 */
export function GlobalSystemBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

  // Mouse parallax state
  const mouseOffset = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const particleCount = isDesktop ? 60 : isTablet ? 32 : 18;

  // Mouse parallax tracking (subtle 2px - 5px offset)
  useEffect(() => {
    if (!isDesktop || prefersReduced) return;

    let animId = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseOffset.current.targetX = nx * 5; // max 5px
      mouseOffset.current.targetY = ny * 5;
    };

    const damp = () => {
      const mo = mouseOffset.current;
      mo.x += (mo.targetX - mo.x) * 0.05;
      mo.y += (mo.targetY - mo.y) * 0.05;

      const parallaxLayer = document.getElementById("hz-hud-parallax-layer");
      if (parallaxLayer) {
        parallaxLayer.style.transform = `translate3d(${-mo.x.toFixed(2)}px, ${-mo.y.toFixed(2)}px, 0)`;
      }

      animId = requestAnimationFrame(damp);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    animId = requestAnimationFrame(damp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, [isDesktop, prefersReduced]);

  // Canvas Telemetry Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Deterministic particle generation
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.9 + Math.random() * 1.5, // 0.9px - 2.4px
        baseAlpha: 0.10 + Math.random() * 0.25, // 0.10 - 0.35
        vx: (Math.random() - 0.5) * 0.14, // Extremely slow horizontal drift
        vy: -0.06 - Math.random() * 0.14, // Very slow vertical drift
        pulseSpeed: 0.012 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        colorType: typeRand > 0.65 ? "cyan" : typeRand > 0.25 ? "blue" : "white",
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

          // Seamless edge wrapping without teleporting
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        const alpha = Math.max(
          0.06,
          Math.min(0.42, p.baseAlpha * (0.8 + 0.2 * Math.sin(p.pulsePhase)))
        );

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.colorType === "cyan") {
          ctx.fillStyle = `rgba(114, 216, 255, ${alpha})`;
          ctx.shadowColor = "rgba(114, 216, 255, 0.4)";
        } else if (p.colorType === "blue") {
          ctx.fillStyle = `rgba(93, 187, 255, ${alpha})`;
          ctx.shadowColor = "rgba(93, 187, 255, 0.35)";
        } else {
          ctx.fillStyle = `rgba(230, 245, 255, ${alpha * 0.8})`;
          ctx.shadowColor = "rgba(230, 245, 255, 0.25)";
        }

        ctx.shadowBlur = 3;
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
      ref={containerRef}
      className="pointer-events-none fixed inset-0 w-full h-full overflow-hidden select-none z-[-1]"
      aria-hidden="true"
      style={{ backgroundColor: "#040710" }}
    >
      {/* ─── LAYER 0 & 1: Solid Dark Base (#040710) + Subtle Ambient Blue Light ─── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 70% 45% at 50% 18%, rgba(70, 160, 220, 0.048) 0%, transparent 60%)",
            "radial-gradient(ellipse 65% 40% at 85% 42%, rgba(16, 36, 58, 0.32) 0%, transparent 65%)",
            "radial-gradient(ellipse 60% 50% at 15% 72%, rgba(7, 16, 31, 0.50) 0%, transparent 65%)",
          ].join(", "),
        }}
      />

      {/* ─── LAYER 2: Technical Grid (Subtle 36px lines, 0.018 - 0.030 opacity) ─── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(to right, rgba(93, 187, 255, 0.022) 1px, transparent 1px)",
            "linear-gradient(to bottom, rgba(93, 187, 255, 0.022) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "36px 36px",
        }}
      />

      {/* Damped Parallax Container for Layers 4, 5, 6, 7 */}
      <div id="hz-hud-parallax-layer" className="absolute inset-0 will-change-transform">
        {/* ─── LAYER 6: System Terminal Details (Background Telemetry Diagnostics) ─── */}
        <div className="absolute inset-0 font-mono text-[9px] uppercase tracking-[0.3em] text-[#5DBBFF]/30 select-none">
          {/* Top Left Telemetry */}
          <div className="absolute top-20 left-8 hidden lg:flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#5DBBFF]/40 animate-pulse" />
            <span>SYS.CORE // ONLINE</span>
          </div>

          {/* Top Right Status */}
          <div className="absolute top-20 right-8 hidden lg:flex items-center gap-2">
            <span>NETWORK // CONNECTED</span>
            <span className="inline-block h-1 w-6 bg-[#5DBBFF]/20" />
          </div>

          {/* Mid Left Node Status */}
          <div className="absolute top-[48%] left-8 hidden xl:flex flex-col gap-1 text-[8px] text-[#5DBBFF]/25">
            <span>NODE // STABLE</span>
            <span>API.STATUS // LIVE</span>
          </div>

          {/* Mid Right Database Status */}
          <div className="absolute top-[52%] right-8 hidden xl:flex flex-col items-end gap-1 text-[8px] text-[#5DBBFF]/25">
            <span>DATABASE // CONNECTED</span>
            <span>ENCRYPTION // AES-256</span>
          </div>

          {/* Bottom Left Region Info */}
          <div className="absolute bottom-10 left-8 hidden md:flex items-center gap-3 text-[#5DBBFF]/25">
            <span>REGION // AP-SOUTH-1</span>
            <span>•</span>
            <span>SYS.STATUS: LIVE</span>
          </div>

          {/* Bottom Right Build Info */}
          <div className="absolute bottom-10 right-8 hidden md:flex items-center gap-3 text-[#5DBBFF]/25">
            <span>BUILD // v5.0.0</span>
            <span>•</span>
            <span>UPTIME // 99.98%</span>
          </div>
        </div>

        {/* ─── LAYER 7: HUD Connection Lines with Telemetry Pulse (●────────●) ─── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Telemetry pulse animation */}
            <filter id="hud-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection Line 1: Top-Center to Top-Right Network Line */}
          <g opacity="0.035" className="hidden md:block">
            <line x1="58%" y1="18%" x2="78%" y2="18%" stroke="#5DBBFF" strokeWidth="1" strokeDasharray="4 6" />
            <line x1="78%" y1="18%" x2="88%" y2="28%" stroke="#5DBBFF" strokeWidth="1" />
            <circle cx="58%" cy="18%" r="3" fill="#5DBBFF" />
            <circle cx="78%" cy="18%" r="2.5" fill="#5DBBFF" />
            <circle cx="88%" cy="28%" r="3" fill="#5DBBFF" />
          </g>

          {/* Connection Line 2: Mid-Left to Center Network Line */}
          <g opacity="0.03" className="hidden lg:block">
            <line x1="12%" y1="62%" x2="26%" y2="62%" stroke="#5DBBFF" strokeWidth="1" />
            <line x1="26%" y1="62%" x2="34%" y2="70%" stroke="#5DBBFF" strokeWidth="1" strokeDasharray="3 5" />
            <circle cx="12%" cy="62%" r="2.5" fill="#5DBBFF" />
            <circle cx="26%" cy="62%" r="3" fill="#5DBBFF" />
            <circle cx="34%" cy="70%" r="2" fill="#5DBBFF" />
          </g>

          {/* Connection Line 3: Bottom-Center Data Bridge (●────────●) */}
          <g opacity="0.035" className="hidden sm:block">
            <line x1="42%" y1="88%" x2="62%" y2="88%" stroke="#5DBBFF" strokeWidth="1" />
            <circle cx="42%" cy="88%" r="3" fill="#5DBBFF" />
            <circle cx="62%" cy="88%" r="3" fill="#5DBBFF" />
          </g>
        </svg>

        {/* ─── LAYER 4: Large Geometric HUD Objects (Slow floating / rotation 45s-90s) ─── */}
        {/* Hexagon 1: Top-Right Wireframe Hexagon (480px) with Concentric Ring */}
        <svg
          className="absolute -top-20 -right-20 w-[420px] h-[420px] lg:w-[520px] lg:h-[520px] opacity-[0.032] animate-hud-spin pointer-events-none"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="250,25 445,138 445,362 250,475 55,362 55,138"
            stroke="#5DBBFF"
            strokeWidth="1.2"
            strokeDasharray="8 8"
          />
          <circle cx="250" cy="250" r="160" stroke="#72D8FF" strokeWidth="1" strokeDasharray="4 8" />
          <line x1="250" y1="50" x2="250" y2="450" stroke="#5DBBFF" strokeWidth="0.8" strokeDasharray="2 6" />
          <line x1="50" y1="250" x2="450" y2="250" stroke="#5DBBFF" strokeWidth="0.8" strokeDasharray="2 6" />
          <circle cx="250" cy="250" r="4" fill="#5DBBFF" />
        </svg>

        {/* Shape 2: Mid-Left Technical Diamond / Crosshair Polygon (380px) */}
        <svg
          className="absolute top-[36%] -left-28 w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] opacity-[0.028] animate-hud-spin-reverse pointer-events-none"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="200,30 345,115 345,285 200,370 55,285 55,115"
            stroke="#5DBBFF"
            strokeWidth="1.2"
          />
          <polygon
            points="200,80 300,140 300,260 200,320 100,260 100,140"
            stroke="#72D8FF"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
          <line x1="200" y1="10" x2="200" y2="390" stroke="#5DBBFF" strokeWidth="0.8" strokeDasharray="3 9" />
        </svg>

        {/* Shape 3: Bottom-Right Large Radar Compass Ring (480px) */}
        <svg
          className="absolute -bottom-28 right-[6%] w-[380px] h-[380px] lg:w-[480px] lg:h-[480px] opacity-[0.026] animate-hud-spin pointer-events-none"
          viewBox="0 0 480 480"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="240" cy="240" r="190" stroke="#5DBBFF" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="240" cy="240" r="130" stroke="#72D8FF" strokeWidth="0.8" strokeDasharray="3 6" />
          <line x1="240" y1="30" x2="240" y2="70" stroke="#5DBBFF" strokeWidth="1.5" />
          <line x1="240" y1="410" x2="240" y2="450" stroke="#5DBBFF" strokeWidth="1.5" />
          <line x1="30" y1="240" x2="70" y2="240" stroke="#5DBBFF" strokeWidth="1.5" />
          <line x1="410" y1="240" x2="450" y2="240" stroke="#5DBBFF" strokeWidth="1.5" />
        </svg>

        {/* ─── LAYER 5: Ghost Technology Names (Opacity strictly 0.018 - 0.038) ─── */}
        <div className="absolute inset-0 overflow-hidden font-mono font-bold uppercase tracking-wider text-[#5DBBFF] select-none pointer-events-none">
          {/* Next.js */}
          <span
            className="absolute top-[10%] left-[5%] text-6xl sm:text-7xl md:text-8xl lg:text-9xl opacity-[0.035] animate-word-drift-1"
            style={{ willChange: "transform" }}
          >
            Next.js
          </span>

          {/* React */}
          <span
            className="absolute top-[20%] right-[7%] text-6xl sm:text-7xl md:text-8xl lg:text-9xl opacity-[0.032] animate-word-drift-2"
            style={{ willChange: "transform" }}
          >
            React
          </span>

          {/* Node.js */}
          <span
            className="absolute top-[48%] right-[6%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.030] animate-word-drift-1"
            style={{ willChange: "transform" }}
          >
            Node.js
          </span>

          {/* TypeScript */}
          <span
            className="absolute top-[38%] left-[4%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.032] animate-word-drift-2"
            style={{ willChange: "transform" }}
          >
            TypeScript
          </span>

          {/* MongoDB */}
          <span
            className="absolute top-[62%] right-[8%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.028] animate-word-drift-3"
            style={{ willChange: "transform" }}
          >
            MongoDB
          </span>

          {/* Java */}
          <span
            className="absolute top-[68%] left-[6%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.030] animate-word-drift-1"
            style={{ willChange: "transform" }}
          >
            Java
          </span>

          {/* Spring Boot */}
          <span
            className="absolute top-[78%] right-[12%] text-4xl sm:text-5xl md:text-6xl lg:text-7xl opacity-[0.026] animate-word-drift-2"
            style={{ willChange: "transform" }}
          >
            Spring Boot
          </span>

          {/* Docker */}
          <span
            className="absolute top-[86%] left-[10%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.030] animate-word-drift-3"
            style={{ willChange: "transform" }}
          >
            Docker
          </span>

          {/* AWS */}
          <span
            className="absolute top-[88%] right-[16%] text-5xl sm:text-6xl md:text-7xl lg:text-8xl opacity-[0.028] animate-word-drift-1"
            style={{ willChange: "transform" }}
          >
            AWS
          </span>

          {/* Flutter (Center-Subtle) */}
          <span
            className="absolute top-[28%] left-[48%] -translate-x-1/2 text-4xl sm:text-5xl md:text-6xl opacity-[0.020] animate-word-drift-3 hidden md:block"
            style={{ willChange: "transform" }}
          >
            Flutter
          </span>

          {/* NestJS */}
          <span
            className="absolute top-[56%] left-[42%] -translate-x-1/2 text-4xl sm:text-5xl md:text-6xl opacity-[0.020] animate-word-drift-2 hidden lg:block"
            style={{ willChange: "transform" }}
          >
            NestJS
          </span>

          {/* Git */}
          <span
            className="absolute top-[16%] left-[45%] text-4xl sm:text-5xl opacity-[0.022] animate-word-drift-1 hidden lg:block"
            style={{ willChange: "transform" }}
          >
            Git
          </span>
        </div>
      </div>

      {/* ─── LAYER 3: Telemetry Particle System (HTML5 Canvas) ─── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
