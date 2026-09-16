"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Detects the OS-level `prefers-reduced-motion` media query.
 *
 * Returns `true` when reduced motion is preferred — callers should
 * skip entrance animations, use `duration: 0`, and disable Lenis.
 *
 * On the server (SSR) this defaults to `false` so first-paint includes
 * motion; the client synchronously corrects on hydration.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    // Sync initial value in case it changed between SSR and hydration
    setPrefersReduced(mql.matches);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
