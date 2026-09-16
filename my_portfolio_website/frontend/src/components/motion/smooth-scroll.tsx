"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Lenis-powered smooth scroll with GSAP ScrollTrigger sync.
 *
 * Rules:
 *  - Disabled entirely on `/admin/*` routes (admin uses native scroll).
 *  - Disabled when OS `prefers-reduced-motion` is active.
 *  - Uses `lerp: 0.1` for silk-smooth inertia without feeling sluggish.
 *  - Syncs with GSAP ScrollTrigger when gsap is loaded (lazy).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const prefersReduced = useReducedMotion();

  const isAdmin = pathname.startsWith("/admin");
  const shouldDisable = isAdmin || prefersReduced;

  useEffect(() => {
    if (shouldDisable) {
      // Ensure any stale instance is cleaned up
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false, // keep native scroll on touch devices
    });
    lenisRef.current = lenis;

    // Optionally sync with GSAP ScrollTrigger if it's available.
    // We import gsap dynamically so the smooth-scroll component
    // doesn't force a synchronous GSAP bundle on admin pages.
    let scrollTriggerHandler: (() => void) | null = null;
    import("gsap")
      .then((gsapModule) => {
        const gsap = gsapModule.default || gsapModule;
        return import("gsap/ScrollTrigger").then((stModule) => {
          const ScrollTrigger =
            stModule.ScrollTrigger || stModule.default;
          gsap.registerPlugin(ScrollTrigger);
          scrollTriggerHandler = ScrollTrigger.update;
          lenis.on("scroll", scrollTriggerHandler);
        });
      })
      .catch(() => {
        // GSAP not available — fine, Lenis works standalone
      });

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (scrollTriggerHandler) {
        lenis.off("scroll", scrollTriggerHandler);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [shouldDisable]);

  // Scroll to top on route change (Lenis manages scroll position)
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return <>{children}</>;
}
