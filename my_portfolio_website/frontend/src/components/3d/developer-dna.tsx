"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

function generateDNAStrand(length: number, radius: number) {
  const points: [number, number, number][] = [];
  const points2: [number, number, number][] = [];
  const lines: [number, number, number][][] = [];

  for (let i = 0; i < length; i++) {
    const t = (i / length) * Math.PI * 4;
    const y = (i - length / 2) * 0.5;
    
    const x1 = Math.cos(t) * radius;
    const z1 = Math.sin(t) * radius;
    
    const x2 = Math.cos(t + Math.PI) * radius;
    const z2 = Math.sin(t + Math.PI) * radius;

    points.push([x1, y, z1]);
    points2.push([x2, y, z2]);
    
    if (i % 3 === 0) {
      lines.push([
        [x1, y, z1],
        [x2, y, z2]
      ]);
    }
  }

  return { points, points2, lines };
}

function DNAScene() {
  const groupRef = useRef<THREE.Group>(null);
  
  const { points, points2, lines } = useMemo(() => generateDNAStrand(60, 3), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* First strand */}
      <Line points={points} color="#60a5fa" lineWidth={2} />
      {points.map((p, i) => (
        <Sphere key={`s1-${i}`} args={[0.15, 16, 16]} position={p}>
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
        </Sphere>
      ))}

      {/* Second strand */}
      <Line points={points2} color="#a78bfa" lineWidth={2} />
      {points2.map((p, i) => (
        <Sphere key={`s2-${i}`} args={[0.15, 16, 16]} position={p}>
          <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.5} />
        </Sphere>
      ))}

      {/* Connecting rungs */}
      {lines.map((line, i) => (
        <Line key={`l-${i}`} points={line} color="#ffffff" lineWidth={1} opacity={0.3} transparent />
      ))}
    </group>
  );
}

export function DeveloperDNA() {
  return (
    <div className="w-full h-[600px] bg-[#050816] relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050816] to-transparent z-10 pointer-events-none" />
      
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#60a5fa" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#a78bfa" />
        
        <DNAScene />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
