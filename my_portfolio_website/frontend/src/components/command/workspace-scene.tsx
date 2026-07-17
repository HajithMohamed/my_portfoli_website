"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Text, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";
import { Color } from "three";

/** Portrait aspect the screen geometry below is built around (w:h = 4:5). */
const PORTRAIT_W = 400;
const PORTRAIT_H = 500;

/**
 * Crop the CMS portrait to a fixed 4:5 around the face. Cloudinary does the cropping,
 * so the meshes can assume one aspect no matter what was uploaded. Non-Cloudinary URLs
 * pass through and simply get stretched to the same frame.
 */
function portraitSrc(url: string): string {
  return url.includes("/image/upload/")
    ? url.replace(
        "/image/upload/",
        `/image/upload/c_fill,g_face,w_${PORTRAIT_W},h_${PORTRAIT_H},q_auto/`,
      )
    : url;
}

/** The operator's photo, framed on a device screen. */
function OperatorPortrait({
  url,
  width,
  position,
}: {
  url: string;
  width: number;
  position: readonly [number, number, number];
}) {
  const texture = useTexture(portraitSrc(url));
  const height = width * (PORTRAIT_H / PORTRAIT_W);

  return (
    <group position={position as unknown as [number, number, number]}>
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[width + 0.05, height + 0.05]} />
        <meshBasicMaterial color="#5cd0ff" transparent opacity={0.45} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Floating tech nodes — the operator's actual day-to-day stack. */
const NODES_DESKTOP = [
  { label: "React", pos: [2.4, 1.2, 0.5] as const },
  { label: "NestJS", pos: [-2.6, 0.8, -0.4] as const },
  { label: "Postgres", pos: [2.2, -1.1, -0.6] as const },
  { label: "Docker", pos: [-2.2, -1.3, 0.3] as const },
  { label: "Next.js", pos: [0.2, 1.9, -0.8] as const },
  { label: "GitHub", pos: [0.1, -1.9, 0.5] as const },
];

const NODES_TABLET = [
  { label: "React", pos: [2.0, 1.0, 0.4] as const },
  { label: "NestJS", pos: [-2.0, 0.6, -0.3] as const },
  { label: "Postgres", pos: [1.8, -0.9, -0.5] as const },
  { label: "Next.js", pos: [-1.8, -1.0, 0.2] as const },
  { label: "GitHub", pos: [0.1, -1.5, 0.4] as const },
];

const NODES_MOBILE = [
  { label: "React", pos: [1.4, 0.9, 0.3] as const },
  { label: "NestJS", pos: [-1.4, 0.5, -0.2] as const },
  { label: "Next.js", pos: [1.2, -0.8, -0.3] as const },
  { label: "GitHub", pos: [-1.2, -0.9, 0.2] as const },
];

/* ── Device: Laptop (desktop) ── */
function Laptop({ portraitUrl }: { portraitUrl?: string }) {
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
        {portraitUrl ? <OperatorPortrait url={portraitUrl} width={0.72} position={[-0.62, 0, 0.05]} /> : null}
        <Text
          position={portraitUrl ? [0.45, 0, 0.05] : [0, 0, 0.05]}
          fontSize={0.11}
          color="#d6ecff"
          anchorX="center"
          anchorY="middle"
          maxWidth={portraitUrl ? 1.1 : 2}
        >
          {"> Hz LABS ~ $"}
        </Text>
      </group>
    </group>
  );
}

/* ── Device: Tablet (tablet viewports) ── */
function Tablet({ portraitUrl }: { portraitUrl?: string }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.25;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    ref.current.rotation.z = Math.sin(t * 0.15) * 0.03;
    ref.current.position.y = Math.sin(t * 0.4) * 0.1;
  });

  return (
    <group ref={ref}>
      {/* Tablet body — flat slab */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 2.4, 0.08]} />
        <meshStandardMaterial color="#0a1628" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Bezel edge glow */}
      <mesh position={[0, 0, 0.001]}>
        <boxGeometry args={[1.82, 2.42, 0.075]} />
        <meshStandardMaterial
          color="#1a3050"
          metalness={0.9}
          roughness={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.6, 2.15]} />
        <meshBasicMaterial color={new Color("#5cd0ff").multiplyScalar(0.3)} />
      </mesh>
      {/* Screen content */}
      {portraitUrl ? <OperatorPortrait url={portraitUrl} width={0.8} position={[0, 0.5, 0.05]} /> : null}
      <Text
        position={[0, portraitUrl ? -0.15 : 0.6, 0.05]}
        fontSize={0.1}
        color="#d6ecff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.4}
      >
        {"Hz LABS"}
      </Text>
      <Text
        position={[0, portraitUrl ? -0.35 : 0.3, 0.05]}
        fontSize={0.06}
        color="#5cd0ff"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.4}
      >
        {"> mission_control"}
      </Text>
      {/* Simulated UI lines on screen */}
      {(portraitUrl ? [-0.55, -0.7, -0.85] : [-0.1, -0.3, -0.5, -0.7]).map((y, i) => (
        <mesh key={i} position={[-0.2 + i * 0.05, y, 0.048]}>
          <planeGeometry args={[0.9 - i * 0.1, 0.025]} />
          <meshBasicMaterial
            color={new Color("#5cd0ff").multiplyScalar(0.15 + i * 0.05)}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
      {/* Home indicator */}
      <mesh position={[0, -1.1, 0.045]}>
        <planeGeometry args={[0.35, 0.03]} />
        <meshBasicMaterial
          color={new Color("#5cd0ff").multiplyScalar(0.5)}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

/* ── Device: Phone (mobile viewports) ── */
function Phone({ portraitUrl }: { portraitUrl?: string }) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.3;
    ref.current.rotation.x = Math.sin(t * 0.25) * 0.1;
    ref.current.rotation.z = Math.sin(t * 0.18) * 0.05;
    ref.current.position.y = Math.sin(t * 0.35) * 0.12;
  });

  return (
    <group ref={ref} scale={1.3}>
      {/* Phone body */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 1.9, 0.06]} />
        <meshStandardMaterial color="#0a1628" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Edge frame */}
      <mesh position={[0, 0, 0.001]}>
        <boxGeometry args={[0.92, 1.92, 0.055]} />
        <meshStandardMaterial
          color="#1a3050"
          metalness={0.9}
          roughness={0.35}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[0.78, 1.7]} />
        <meshBasicMaterial color={new Color("#5cd0ff").multiplyScalar(0.28)} />
      </mesh>
      {/* Notch / Dynamic Island */}
      <mesh position={[0, 0.78, 0.04]}>
        <planeGeometry args={[0.28, 0.06]} />
        <meshBasicMaterial color="#030711" />
      </mesh>
      {/* Screen content */}
      {portraitUrl ? <OperatorPortrait url={portraitUrl} width={0.46} position={[0, 0.36, 0.04]} /> : null}
      <Text
        position={[0, portraitUrl ? -0.12 : 0.45, 0.04]}
        fontSize={0.07}
        color="#d6ecff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {"Hz LABS"}
      </Text>
      <Text
        position={[0, portraitUrl ? -0.27 : 0.25, 0.04]}
        fontSize={0.04}
        color="#5cd0ff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {"> sys.online"}
      </Text>
      {/* Simulated UI elements */}
      {(portraitUrl ? [-0.42, -0.54, -0.66] : [-0.0, -0.15, -0.3, -0.45, -0.6]).map((y, i) => (
        <mesh key={i} position={[0, y, 0.038]}>
          <planeGeometry args={[0.55 - i * 0.04, 0.02]} />
          <meshBasicMaterial
            color={new Color("#5cd0ff").multiplyScalar(0.12 + i * 0.04)}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
      {/* Home indicator */}
      <mesh position={[0, -0.78, 0.037]}>
        <planeGeometry args={[0.2, 0.02]} />
        <meshBasicMaterial
          color={new Color("#5cd0ff").multiplyScalar(0.4)}
          transparent
          opacity={0.5}
        />
      </mesh>
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
        <Line key={i} points={seg} color="#5cd0ff" lineWidth={0.6} transparent opacity={0.25} />
      ))}
    </>
  );
}

function Particles({ count = 60 }: { count?: number }) {
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
          <meshBasicMaterial color="#5cd0ff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

export type DeviceType = "laptop" | "tablet" | "phone";

interface WorkspaceSceneProps {
  device?: DeviceType;
  particleCount?: number;
  /** Operator portrait shown on the device screen. */
  portraitUrl?: string;
}

export default function WorkspaceScene({
  device = "laptop",
  particleCount = 60,
  portraitUrl,
}: WorkspaceSceneProps) {
  const nodes =
    device === "phone"
      ? NODES_MOBILE
      : device === "tablet"
        ? NODES_TABLET
        : NODES_DESKTOP;

  const cameraPos: [number, number, number] =
    device === "phone"
      ? [0, 0.3, 5.5]
      : device === "tablet"
        ? [0, 0.4, 5.4]
        : [0, 0.6, 5.2];

  return (
    <Canvas
      dpr={[1, device === "laptop" ? 1.5 : 1]}
      camera={{ position: cameraPos, fov: device === "phone" ? 38 : 42 }}
      gl={{ antialias: device === "laptop", alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#5cd0ff" />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color="#3a8fb8" />

      {/* The portrait texture loads async; the device renders without it until then. */}
      <Suspense fallback={null}>
        {device === "laptop" && <Laptop portraitUrl={portraitUrl} />}
        {device === "tablet" && <Tablet portraitUrl={portraitUrl} />}
        {device === "phone" && <Phone portraitUrl={portraitUrl} />}
      </Suspense>

      <Connections nodes={nodes} />
      {nodes.map((n) => (
        <Node key={n.label} label={n.label} pos={n.pos} />
      ))}
      <Particles count={particleCount} />
    </Canvas>
  );
}
