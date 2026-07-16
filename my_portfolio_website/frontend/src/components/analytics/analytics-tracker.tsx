"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track, trackLeave, trackPageView, analyticsDisabled } from "@/lib/analytics";

/**
 * Site-wide visitor tracking: page views on route change, scroll depth,
 * time-on-page (sent as a leave beacon), and delegated click tracking for
 * GitHub / social / CV links. Renders nothing.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const enteredAt = useRef(Date.now());
  const maxScroll = useRef(0);
  const currentPath = useRef(pathname);

  // Page views + leave beacon per route.
  useEffect(() => {
    if (!pathname || pathname.startsWith("/_internal") || analyticsDisabled()) {
      return;
    }
    currentPath.current = pathname;
    enteredAt.current = Date.now();
    maxScroll.current = 0;
    trackPageView(pathname);

    function flush() {
      trackLeave(
        currentPath.current ?? "/",
        (Date.now() - enteredAt.current) / 1000,
        maxScroll.current,
      );
    }
    function onVisibility() {
      if (document.visibilityState === "hidden") flush();
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [pathname]);

  // Scroll depth (max % of the document seen).
  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const seen = Math.round((window.scrollY / total) * 100);
      if (seen > maxScroll.current) {
        maxScroll.current = Math.min(100, seen);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Delegated click tracking for outbound + conversion links.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const explicit = anchor.dataset.track;
      if (explicit) {
        track(explicit, { href: anchor.href });
        return;
      }
      const href = anchor.href;
      if (/github\.com/i.test(href)) {
        track("github_click", { href });
      } else if (/linkedin\.com|twitter\.com|x\.com|instagram\.com|facebook\.com/i.test(href)) {
        track("social_click", { href });
      } else if (href.startsWith("mailto:")) {
        track("social_click", { href: "mailto" });
      }
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
