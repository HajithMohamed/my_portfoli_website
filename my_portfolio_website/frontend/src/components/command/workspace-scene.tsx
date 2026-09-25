"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Text, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import type { Group } from "three";
import { Color } from "three";

/** The ambient scene deliberately stays in the blue-black JARVIS treatment. */
export const DARK_SCENE_PALETTE = {
  accent: "#5cd0ff",
  accentDim: "#3a8fb8",
  surface: "#0a1628",
  border: "#1a3050",
  base: "#030711",
  text: "#d6ecff",
} as const;

interface Palette {
  readonly accent: string;
  readonly accentDim: string;
  readonly surface: string;
  readonly border: string;
  readonly base: string;
  readonly text: string;
}

interface ScreenState {
  id: string;
  route: string;
  headline: string;
  detail: string;
  metrics: readonly [string, string, string];
}

const HOME_SCREEN: ScreenState = {
  id: "home",
  route: "HOME // COMMAND DECK",
  headline: "Operator online",
  detail: "portfolio.system / ready",
  metrics: ["GITHUB", "SYSTEMS", "COMMS"],
};

function screenForPathname(pathname: string): ScreenState {
  if (pathname === "/") return HOME_SCREEN;

  if (pathname.startsWith("/about")) {
    return {
      id: "about",
      route: "ABOUT // OPERATOR",
      headline: "Engineering profile",
      detail: "background / focus / availability",
      metrics: ["BIO", "MISSION", "TIMELINE"],
    };
  }

  if (pathname.startsWith("/projects")) {
    return {
      id: "projects",
      route: "PROJECTS // ARCHIVE",
      headline: "Shipping systems",
      detail: "repositories / case studies / builds",
      metrics: ["REPOS", "STACK", "STATUS"],
    };
  }

  if (pathname.startsWith("/certificates")) {
    return {
      id: "certificates",
      route: "CREDENTIALS // VAULT",
      headline: "Learning record",
      detail: "verified courses / milestones",
      metrics: ["CERTS", "HOURS", "GROWTH"],
    };
  }

  if (pathname.startsWith("/blog")) {
    return {
      id: "blog",
      route: "NOTES // FIELD LOG",
      headline: "Build in public",
      detail: "decisions / progress / lessons",
      metrics: ["LOGS", "IDEAS", "SIGNALS"],
    };
  }

  if (pathname.startsWith("/start-project")) {
    return {
      id: "intake",
      route: "INTAKE // NEW PROJECT",
      headline: "Start a build",
      detail: "scope / goals / collaboration",
      metrics: ["BRIEF", "SCOPE", "LAUNCH"],
    };
  }

  return {
    id: "system",
    route: "HZ LABS // SYSTEM",
    headline: "Workspace active",
    detail: "engineering console / online",
    metrics: ["STATUS", "FOCUS", "UPTIME"],
  };
}

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
  accentColor,
}: {
  url: string;
  width: number;
  position: readonly [number, number, number];
  accentColor: string;
}) {
  const texture = useTexture(portraitSrc(url));
  const height = width * (PORTRAIT_H / PORTRAIT_W);

  return (
    <group position={position as unknown as [number, number, number]}>
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[width + 0.05, height + 0.05]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.45} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** A deliberate empty state until a profile photo is uploaded in Admin > Profile. */
function PortraitPending({
  width,
  accentColor,
}: {
  width: number;
  accentColor: string;
}) {
  return (
    <group>
      <mesh position={[0, width * 0.08, 0]}>
        <circleGeometry args={[width * 0.27, 24]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.16} />
      </mesh>
      <mesh position={[0, -width * 0.18, 0]}>
        <circleGeometry args={[width * 0.42, 24, 0, Math.PI]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.1} />
      </mesh>
      <Text
        position={[0, -width * 0.48, 0.002]}
        fontSize={Math.min(width * 0.09, 0.06)}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
      >
        PROFILE READY
      </Text>
    </group>
  );
}

/**
 * Route-aware content that sits inside every device. The scene stays mounted;
 * only this information panel changes when the visitor navigates to a new page.
 */
function DeviceScreen({
  width,
  height,
  portraitUrl,
  palette,
  screen,
}: {
  width: number;
  height: number;
  portraitUrl?: string;
  palette: Palette;
  screen: ScreenState;
}) {
  const ref = useRef<Group>(null);
  const portraitWidth = width * (height > width ? 0.55 : 0.31);
  const portraitX = -width / 2 + portraitWidth / 2 + width * 0.08;
  const contentLeft = -width / 2 + portraitWidth + width * 0.13;
  const contentWidth = width / 2 - contentLeft - width * 0.09;
  const compact = height > width * 1.2;
  const titleSize = Math.min(width * 0.095, compact ? 0.08 : 0.105);
  const bodySize = Math.min(width * 0.06, compact ? 0.045 : 0.06);
  const routeSize = Math.min(width * 0.045, 0.043);
  const barY = compact ? -height * 0.17 : -height * 0.18;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 1.1) * 0.008;
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.002;
  });

  return (
    <group ref={ref} position={[0, 0, 0.052]}>
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color={palette.base} transparent opacity={0.92} />
      </mesh>

      <mesh position={[0, height * 0.34, 0]}>
        <planeGeometry args={[width * 0.9, 0.012]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.36} />
      </mesh>

      <group position={[portraitX, compact ? height * 0.16 : 0.02, 0.001]}>
        {portraitUrl ? (
          <OperatorPortrait
            url={portraitUrl}
            width={portraitWidth}
            position={[0, 0, 0.001]}
            accentColor={palette.accent}
          />
        ) : (
          <PortraitPending width={portraitWidth} accentColor={palette.accent} />
        )}
      </group>

      <group key={screen.id}>
        <Text
          position={[contentLeft, height * 0.28, 0.002]}
          fontSize={routeSize}
          color={palette.accent}
          anchorX="left"
          anchorY="middle"
          maxWidth={contentWidth}
        >
          {screen.route}
        </Text>
        <Text
          position={[contentLeft, height * 0.11, 0.002]}
          fontSize={titleSize}
          color={palette.text}
          anchorX="left"
          anchorY="middle"
          maxWidth={contentWidth}
        >
          {screen.headline}
        </Text>
        <Text
          position={[contentLeft, -height * 0.035, 0.002]}
          fontSize={bodySize}
          color={palette.accentDim}
          anchorX="left"
          anchorY="middle"
          maxWidth={contentWidth}
        >
          {screen.detail}
        </Text>

        {screen.metrics.map((metric, index) => {
          const metricWidth = contentWidth / screen.metrics.length - width * 0.018;
          const x = contentLeft + index * (metricWidth + width * 0.018);
          return (
            <group key={metric} position={[x + metricWidth / 2, barY, 0.002]}>
              <mesh>
                <planeGeometry args={[metricWidth, Math.max(height * 0.12, 0.04)]} />
                <meshBasicMaterial color={palette.accent} transparent opacity={0.12 + index * 0.04} />
              </mesh>
              <Text
                position={[0, 0, 0.002]}
                fontSize={Math.min(metricWidth * 0.18, bodySize * 0.85)}
                color={palette.text}
                anchorX="center"
                anchorY="middle"
                maxWidth={metricWidth * 0.86}
              >
                {metric}
              </Text>
            </group>
          );
        })}
      </group>

      <Text
        position={[width * 0.39, -height * 0.38, 0.002]}
        fontSize={routeSize * 0.86}
        color={palette.accent}
        anchorX="right"
        anchorY="middle"
      >
        LIVE • 24/7
      </Text>
    </group>
  );
}

/** Floating tech nodes — the operator's actual day-to-day stack. */
const NODES_DESKTOP = [
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

const NODES_TABLET = [
  { label: "React", pos: [1.9, 0.9, 0.3] as const },
  { label: "Next.js", pos: [-1.9, 0.8, -0.3] as const },
  { label: "Node.js", pos: [2.2, 0.2, -0.4] as const },
  { label: "TypeScript", pos: [-2.2, 0.0, 0.2] as const },
  { label: "MongoDB", pos: [1.7, -0.8, -0.3] as const },
  { label: "Docker", pos: [-1.8, -0.9, 0.2] as const },
  { label: "GitHub", pos: [0.1, -1.4, 0.3] as const },
  { label: "Java", pos: [-0.3, 1.2, -0.2] as const },
];

const NODES_MOBILE = [
  { label: "React", pos: [1.4, 0.9, 0.3] as const },
  { label: "Next.js", pos: [-1.4, 0.7, -0.2] as const },
  { label: "Node.js", pos: [1.3, -0.5, -0.3] as const },
  { label: "TypeScript", pos: [-1.3, -0.6, 0.2] as const },
  { label: "GitHub", pos: [0.0, -1.3, 0.2] as const },
  { label: "Docker", pos: [-0.2, 1.2, -0.1] as const },
];

/* ── Device: Laptop (desktop) ── */
function Laptop({
  portraitUrl,
  palette,
  screen,
}: {
  portraitUrl?: string;
  palette: Palette;
  screen: ScreenState;
}) {
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
        <meshStandardMaterial color={palette.surface} metalness={0.9} roughness={0.35} />
      </mesh>
      {/* Screen back */}
      <group position={[0, 0.55, -0.75]} rotation={[-0.35, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 1.5, 0.08]} />
          <meshStandardMaterial color={palette.surface} metalness={0.9} roughness={0.4} />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.25, 1.35]} />
          <meshBasicMaterial color={new Color(palette.accent).multiplyScalar(0.35)} />
        </mesh>
        <DeviceScreen
          width={2.13}
          height={1.23}
          portraitUrl={portraitUrl}
          palette={palette}
          screen={screen}
        />
      </group>
    </group>
  );
}

/* ── Device: Tablet (tablet viewports) ── */
function Tablet({
  portraitUrl,
  palette,
  screen,
}: {
  portraitUrl?: string;
  palette: Palette;
  screen: ScreenState;
}) {
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
        <meshStandardMaterial color={palette.surface} metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Bezel edge glow */}
      <mesh position={[0, 0, 0.001]}>
        <boxGeometry args={[1.82, 2.42, 0.075]} />
        <meshStandardMaterial
          color={palette.border}
          metalness={0.9}
          roughness={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.6, 2.15]} />
        <meshBasicMaterial color={new Color(palette.accent).multiplyScalar(0.3)} />
      </mesh>
      <DeviceScreen
        width={1.5}
        height={2.03}
        portraitUrl={portraitUrl}
        palette={palette}
        screen={screen}
      />
    </group>
  );
}

/* ── Device: Phone (mobile viewports) ── */
function Phone({
  portraitUrl,
  palette,
  screen,
}: {
  portraitUrl?: string;
  palette: Palette;
  screen: ScreenState;
}) {
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
        <meshStandardMaterial color={palette.surface} metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Edge frame */}
      <mesh position={[0, 0, 0.001]}>
        <boxGeometry args={[0.92, 1.92, 0.055]} />
        <meshStandardMaterial
          color={palette.border}
          metalness={0.9}
          roughness={0.35}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[0.78, 1.7]} />
        <meshBasicMaterial color={new Color(palette.accent).multiplyScalar(0.28)} />
      </mesh>
      {/* Notch / Dynamic Island */}
      <mesh position={[0, 0.78, 0.04]}>
        <planeGeometry args={[0.28, 0.06]} />
        <meshBasicMaterial color={palette.base} />
      </mesh>
      <DeviceScreen
        width={0.72}
        height={1.56}
        portraitUrl={portraitUrl}
        palette={palette}
        screen={screen}
      />
    </group>
  );
}

/** Rotating wireframe geodesic polyhedrons — the HUD atmosphere elements. */
function WireframePolyhedron({
  position,
  scale = 1,
  speed = 0.15,
  accentColor,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  accentColor: string;
}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * speed;
    ref.current.rotation.y = t * speed * 0.7;
    ref.current.rotation.z = t * speed * 0.3;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial
          color={accentColor}
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshBasicMaterial
          color={accentColor}
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}

function Node({
  label,
  pos,
  palette,
}: {
  label: string;
  pos: readonly [number, number, number];
  palette: Palette;
}) {
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={pos as unknown as [number, number, number]}>
        <mesh>
          <icosahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={palette.accent}
            emissive={palette.accent}
            emissiveIntensity={0.7}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        <Text
          position={[0, 0.42, 0]}
          fontSize={0.15}
          color={palette.text}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function Connections({
  nodes,
  accentColor,
}: {
  nodes: readonly { label: string; pos: readonly [number, number, number] }[];
  accentColor: string;
}) {
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
        <Line key={i} points={seg} color={accentColor} lineWidth={0.6} transparent opacity={0.25} />
      ))}
    </>
  );
}

function Particles({ count = 60, accentColor }: { count?: number; accentColor: string }) {
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
          <meshBasicMaterial color={accentColor} transparent opacity={0.6} />
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
  showNodes?: boolean;
  showParticles?: boolean;
}

export default function WorkspaceScene({
  device = "laptop",
  particleCount = 60,
  portraitUrl,
  showNodes = true,
  showParticles = true,
}: WorkspaceSceneProps) {
  const pathname = usePathname();
  const palette = DARK_SCENE_PALETTE;
  const screen = screenForPathname(pathname);

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
      dpr={1}
      camera={{ position: cameraPos, fov: device === "phone" ? 38 : 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color={palette.accent} />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color={palette.accentDim} />

      {/* The portrait texture loads async; the device renders without it until then. */}
      <Suspense fallback={null}>
        {device === "laptop" && <Laptop portraitUrl={portraitUrl} palette={palette} screen={screen} />}
        {device === "tablet" && <Tablet portraitUrl={portraitUrl} palette={palette} screen={screen} />}
        {device === "phone" && <Phone portraitUrl={portraitUrl} palette={palette} screen={screen} />}
      </Suspense>

      {showNodes && (
        <>
          <Connections nodes={nodes} accentColor={palette.accent} />
          {nodes.map((n) => (
            <Node key={n.label} label={n.label} pos={n.pos} palette={palette} />
          ))}
        </>
      )}
      {showParticles && <Particles count={particleCount} accentColor={palette.accent} />}

      {/* Wireframe geodesic polyhedrons — atmospheric HUD depth */}
      <WireframePolyhedron position={[-3.2, -1.0, -1.5]} scale={1.2} speed={0.1} accentColor={palette.accent} />
      <WireframePolyhedron position={[3.8, 0.5, -2.0]} scale={0.9} speed={0.18} accentColor={palette.accentDim} />
      <WireframePolyhedron position={[0, 2.2, -3.0]} scale={1.5} speed={0.08} accentColor={palette.accent} />
    </Canvas>
  );
}
