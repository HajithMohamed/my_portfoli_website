"use client";

import dynamic from "next/dynamic";

const Hero3DSceneCanvas = dynamic(
  () => import("@/components/3d/hero-3d-scene").then((m) => ({ default: m.Hero3DScene })),
  { ssr: false }
);

export function Hero3DSceneClient() {
  return <Hero3DSceneCanvas />;
}
