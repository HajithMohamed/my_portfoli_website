"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Text } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";
import { Color } from "three";
import { PERSONAL_IDENTITY } from "@/lib/identity";
import { useMediaQuery } from "@/lib/use-media-query";

const PALETTE = {
  accent: "#5cd0ff",
  accentDim: "#3a8fb8",
  surface: "#0a1628",
  border: "#1a3050",
  base: "#030711",
  text: "#d6ecff",
};

const NODES = [
  { label: "React", pos: [-2.7, 1.4, 0.2] as const },
  { label: "Next.js", pos: [2.7, 1.5, 0.1] as const },
  { label: "Node.js", pos: [3.3, 0.9, -0.2] as const },
  { label: "TypeScript", pos: [-3.1, 0.5, 0.1] as const },
  { label: "Spring Boot", pos: [2.8, 0.2, 0.3] as const },
  { label: "MongoDB", pos: [3.7, -0.3, -0.3] as const },
  { label: "AWS", pos: [3.0, -0.7, 0.2] as const },
  { label: "Java", pos: [3.6, -1.2, -0.2] as const },
  { label: "MySQL", pos: [2.7, -1.5, 0.2] as const },
  { label: "GitHub", pos: [-2.0, -1.6, 0.3] as const },
  { label: "Docker", pos: [-3.3, -1.5, -0.1] as const },
  { label: "Flutter", pos: [0.2, -1.8, 0.4] as const },
];

const NODES_SMALL = [
  { label: "React", pos: [1.4, 0.9, 0.3] as const },
  { label: "Next.js", pos: [-1.4, 0.7, -0.2] as const },
  { label: "Node.js", pos: [1.3, -0.5, -0.3] as const },
  { label: "TypeScript", pos: [-1.3, -0.6, 0.2] as const },
  { label: "GitHub", pos: [0.0, -1.3, 0.2] as const },
  { label: "Docker", pos: [-0.2, 1.2, -0.1] as const },
];

function Laptop() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.25) * 0.35;
    ref.current.rotation.x = -0.2 + Math.sin(t * 0.4) * 0.05;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[2.4, 0.08, 1.6]} />
        <meshStandardMaterial color={PALETTE.surface} metalness={0.9} roughness={0.35} />
      </mesh>
      <group position={[0, 0.55, -0.75]} rotation={[-0.35, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 1.5, 0.08]} />
          <meshStandardMaterial color={PALETTE.surface} metalness={0.9} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.25, 1.35]} />
          <meshBasicMaterial color={new Color(PALETTE.accent).multiplyScalar(0.35)} />
        </mesh>
        <Text
          position={[0, 0.15, 0.05]}
          fontSize={0.11}
          color={PALETTE.text}
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {PERSONAL_IDENTITY.name}
        </Text>
        <Text
          position={[0, -0.05, 0.05]}
          fontSize={0.07}
          color={PALETTE.accent}
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {"> full_stack_developer"}
        </Text>
      </group>
    </group>
  );
}

function Node({ label, pos }: { label: string; pos: readonly [number, number, number] }) {
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={pos as unknown as [number, number, number]}>
        <mesh>
          <icosahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={PALETTE.accent}
            emissive={PALETTE.accent}
            emissiveIntensity={0.7}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        <Text
          position={[0, 0.42, 0]}
          fontSize={0.15}
          color={PALETTE.text}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function Connections({ nodes }: { nodes: readonly { label: string; pos: readonly [number, number, number] }[] }) {
  const points = useMemo(
    () =>
      nodes.map((n) => [
        [0, 0.3, 0] as [number, number, number],
        n.pos as unknown as [number, number, number],
      ]),
    [nodes],
  );
  return (
    <>
      {points.map((seg, i) => (
        <Line key={i} points={seg} color={PALETTE.accent} lineWidth={0.6} transparent opacity={0.25} />
      ))}
    </>
  );
}

function Particles({ count = 50 }: { count?: number }) {
  const ref = useRef<Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 6 - 2,
        s: 0.01 + Math.random() * 0.02,
      })),
    [count],
  );
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });
  return (
    <group ref={ref}>
      {items.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.s, 6, 6]} />
          <meshBasicMaterial color={PALETTE.accent} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function WireframePolyhedron({
  position,
  scale = 1,
  speed = 0.15,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * speed;
    ref.current.rotation.y = t * speed * 0.7;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial color={PALETTE.accent} wireframe transparent opacity={0.12} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial color={PALETTE.accent} wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/**
 * Self-contained global 3D scene background.
 * Renders a floating laptop, 12 tech nodes, wireframe polyhedrons, and particles.
 * Mounts directly — no dynamic import needed.
 */
export function GlobalScene3D() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const nodes = isDesktop ? NODES : NODES_SMALL;
  const particleCount = isDesktop ? 50 : 20;

  return (
    <div className="absolute inset-0 w-full h-full" style={{ opacity: 0.42 }}>
      <Canvas
        dpr={1}
        camera={{ position: [0, 0.6, 5.2], fov: 42 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color={PALETTE.accent} />
        <pointLight position={[-4, -2, 3]} intensity={0.8} color={PALETTE.accentDim} />

        <Suspense fallback={null}>
          <Laptop />
        </Suspense>

        <Connections nodes={nodes} />
        {nodes.map((n) => (
          <Node key={n.label} label={n.label} pos={n.pos} />
        ))}

        <Particles count={particleCount} />

        <WireframePolyhedron position={[-3.2, -1.0, -1.5]} scale={1.2} speed={0.1} />
        <WireframePolyhedron position={[3.8, 0.5, -2.0]} scale={0.9} speed={0.18} />
        <WireframePolyhedron position={[0, 2.2, -3.0]} scale={1.5} speed={0.08} />
      </Canvas>
    </div>
  );
}
