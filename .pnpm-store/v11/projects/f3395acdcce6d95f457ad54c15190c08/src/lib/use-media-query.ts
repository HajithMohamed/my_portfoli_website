"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` when the given CSS media-query string matches.
 * Falls back to `false` during SSR / first render to avoid hydration mismatch.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/** Convenience: true when viewport ≥ 768px */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/** Convenience: true when viewport ≥ 1024px */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/** Convenience: true on devices that support hover (non-touch) */
export function useCanHover(): boolean {
  return useMediaQuery("(hover: hover)");
}
