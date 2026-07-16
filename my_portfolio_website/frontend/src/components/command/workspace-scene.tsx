"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { Color } from "three";

/** Floating tech nodes — the operator's actual day-to-day stack. */
const NODES = [
  { label: "React", pos: [2.4, 1.2, 0.5] as const },
  { label: "NestJS", pos: [-2.6, 0.8, -0.4] as const },
  { label: "Postgres", pos: [2.2, -1.1, -0.6] as const },
  { label: "Docker", pos: [-2.2, -1.3, 0.3] as const },
  { label: "Next.js", pos: [0.2, 1.9, -0.8] as const },
  { label: "GitHub", pos: [0.1, -1.9, 0.5] as const },
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
      {/* Base */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <boxGeometry args={[2.4, 0.08, 1.6]} />
        <meshStandardMaterial color="#0a1628" metalness={0.9} roughness={0.35} />
      </mesh>
      {/* Screen back */}
      <group position={[0, 0.55, -0.75]} rotation={[-0.35, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 1.5, 0.08]} />
          <meshStandardMaterial color="#0a1628" metalness={0.9} roughness={0.4} />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.25, 1.35]} />
          <meshBasicMaterial color={new Color("#5cd0ff").multiplyScalar(0.35)} />
        </mesh>
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.11}
          color="#d6ecff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {"> Hz LABS ~ $"}
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
            color="#5cd0ff"
            emissive="#5cd0ff"
            emissiveIntensity={0.7}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        <Text
          position={[0, 0.42, 0]}
          fontSize={0.15}
          color="#d6ecff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function Connections() {
  const points = useMemo(
    () =>
      NODES.map((n) => [
        [0, 0.3, 0] as [number, number, number],
        n.pos as unknown as [number, number, number],
      ]),
    [],
  );
  return (
    <>
      {points.map((seg, i) => (
        <Line key={i} points={seg} color="#5cd0ff" lineWidth={0.6} transparent opacity={0.25} />
      ))}
    </>
  );
}

function Particles() {
  const ref = useRef<Group>(null);
  const items = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 6 - 2,
        s: 0.01 + Math.random() * 0.02,
      })),
    [],
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
          <meshBasicMaterial color="#5cd0ff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export default function WorkspaceScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.6, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#5cd0ff" />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color="#3a8fb8" />
      <Laptop />
      <Connections />
      {NODES.map((n) => (
        <Node key={n.label} label={n.label} pos={n.pos} />
      ))}
      <Particles />
    </Canvas>
  );
}
