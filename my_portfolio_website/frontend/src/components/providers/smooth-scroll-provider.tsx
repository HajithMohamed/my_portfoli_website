"use client";

import { SmoothScroll } from "@/components/motion/smooth-scroll";

/**
 * Wrapper kept for backward-compatibility with layout.tsx imports.
 * Delegates to the real Lenis-powered SmoothScroll component.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
