"use client";

export function GlobalHudBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Floating Animated Ambient Glow Orbs — Theme-Reactive (Jarvis & Ember) with Subtle Dark Depth */}
      <div
        className="absolute left-1/4 top-1/6 w-[45vw] h-[45vw] rounded-full blur-[140px] mix-blend-screen animate-orb pointer-events-none md:w-[35vw] md:h-[35vw] transition-all duration-700 opacity-60"
        style={{ background: "var(--orb-1, rgba(92, 208, 255, 0.08))" }}
      />
      <div
        className="absolute right-1/4 bottom-1/4 w-[38vw] h-[38vw] rounded-full blur-[120px] mix-blend-screen animate-orb pointer-events-none md:w-[28vw] md:h-[28vw] transition-all duration-700 opacity-60"
        style={{ background: "var(--orb-2, rgba(167, 139, 250, 0.06))", animationDelay: "-10s" }}
      />
      <div
        className="absolute left-1/3 bottom-10 w-[30vw] h-[30vw] rounded-full blur-[100px] mix-blend-screen animate-orb pointer-events-none transition-all duration-700 opacity-50"
        style={{ background: "var(--orb-3, rgba(245, 158, 11, 0.05))", animationDelay: "-5s" }}
      />
    </div>
  );
}
