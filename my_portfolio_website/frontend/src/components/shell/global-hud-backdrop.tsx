"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "@/lib/use-media-query";

const WorkspaceScene = dynamic(() => import("@/components/command/workspace-scene"), {
  ssr: false,
});

export function GlobalHudBackdrop() {
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const device = isDesktop ? "laptop" : isTablet ? "tablet" : "phone";
  const particleCount = isDesktop ? 60 : isTablet ? 30 : 15;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* 3D WebGL Constellation Canvas across all pages */}
      <div className="absolute inset-0 opacity-[0.24] md:opacity-[0.30]">
        <WorkspaceScene device={device} particleCount={particleCount} />
      </div>

      {/* Floating Animated Ambient Glow Orbs — Theme-Reactive (Jarvis & Ember) */}
      <div
        className="absolute left-1/4 top-1/6 w-[52vw] h-[52vw] rounded-full blur-[140px] mix-blend-screen animate-orb pointer-events-none md:w-[40vw] md:h-[40vw] transition-all duration-700"
        style={{ background: "var(--orb-1, rgba(92, 208, 255, 0.15))" }}
      />
      <div
        className="absolute right-1/4 bottom-1/4 w-[42vw] h-[42vw] rounded-full blur-[120px] mix-blend-screen animate-orb pointer-events-none md:w-[32vw] md:h-[32vw] transition-all duration-700"
        style={{ background: "var(--orb-2, rgba(167, 139, 250, 0.12))", animationDelay: "-10s" }}
      />
      <div
        className="absolute left-1/3 bottom-10 w-[35vw] h-[35vw] rounded-full blur-[100px] mix-blend-screen animate-orb pointer-events-none transition-all duration-700"
        style={{ background: "var(--orb-3, rgba(245, 158, 11, 0.09))", animationDelay: "-5s" }}
      />
    </div>
  );
}
