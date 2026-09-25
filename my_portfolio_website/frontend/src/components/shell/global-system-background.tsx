"use client";

import { useEffect, useRef, useState } from "react";
import { PersistentDeviceScene } from "@/components/shell/persistent-device-scene";
import { useMediaQuery } from "@/lib/use-media-query";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface Particle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
}

/** Loads the optional image set in Admin > Profile without coupling the scene to one page. */
function useProfilePortrait() {
  const [portraitUrl, setPortraitUrl] = useState<string | undefined>();

  useEffect(() => {
    const controller = new AbortController();

    async function loadPortrait() {
      try {
        const response = await fetch("/bff/profile", { signal: controller.signal });
        if (!response.ok) return;

        const profile = (await response.json()) as { profileImageUrl?: unknown };
        if (typeof profile.profileImageUrl === "string" && profile.profileImageUrl.trim()) {
          setPortraitUrl(profile.profileImageUrl);
        }
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          // The animation deliberately has an image-free operator fallback.
          console.warn("[GlobalSystemBackground] Profile portrait is unavailable.");
        }
      }
    }

    void loadPortrait();
    return () => controller.abort();
  }, []);

  return portraitUrl;
}

/**
 * A single fixed animation layer for the whole application. It lives in the
 * root layout, so page scrolling and App Router navigation never restart it.
 */
export function GlobalSystemBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const prefersReducedMotion = useReducedMotion();
  const portraitUrl = useProfilePortrait();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const particles: Particle[] = Array.from({ length: isDesktop ? 30 : 14 }, () => ({
      x: 0,
      y: 0,
      radius: 0.5 + Math.random() * 1.1,
      alpha: 0.08 + Math.random() * 0.2,
      speed: 0.04 + Math.random() * 0.12,
      phase: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles.forEach((particle) => {
        particle.x = Math.random() * width;
        particle.y = Math.random() * height;
      });
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        if (!prefersReducedMotion) {
          particle.y -= particle.speed;
          particle.phase += 0.015;
          if (particle.y < -8) {
            particle.y = height + 8;
            particle.x = Math.random() * width;
          }
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(92, 208, 255, ${particle.alpha * (0.68 + Math.sin(particle.phase) * 0.32)})`;
        context.fill();
      });

      if (!prefersReducedMotion) animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [isDesktop, prefersReducedMotion]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#040710] select-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_72%_35%,rgba(30,91,128,0.18),transparent_66%),radial-gradient(ellipse_62%_45%_at_16%_82%,rgba(7,20,38,0.7),transparent_70%)]" />
      <PersistentDeviceScene portraitUrl={portraitUrl} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
