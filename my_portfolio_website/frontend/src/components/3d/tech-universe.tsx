"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { Skill } from "@/lib/types";

function TechNode({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[0.5 * scale, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

function Scene({ skills }: { skills: Skill[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const nodes = useMemo(() => {
    const categories = [...new Set(skills.map((s) => s.category))];
    const catColors: Record<string, string> = {
      Frontend: "#60a5fa",
      Backend: "#a78bfa",
      Database: "#34d399",
      Tools: "#fbbf24",
    };

    return skills.map((skill, i) => {
      const phi = Math.acos(-1 + (2 * i) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      const radius = 6 + (skill.proficiency / 100) * 2;

      return {
        id: skill.id,
        position: [
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi),
        ] as [number, number, number],
        color: catColors[skill.category] || "#94a3b8",
        scale: 0.5 + (skill.proficiency / 100) * 0.8,
      };
    });
  }, [skills]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#60a5fa" />
      
      <group ref={groupRef}>
        {nodes.map((node) => (
          <TechNode
            key={node.id}
            position={node.position}
            color={node.color}
            scale={node.scale}
          />
        ))}

        {/* Central Core */}
        <Sphere args={[2, 64, 64]}>
          <MeshDistortMaterial
            color="#1e3a8a"
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.9}
            roughness={0.1}
            distort={0.3}
            speed={1.5}
          />
        </Sphere>
      </group>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function TechUniverse({ skills }: { skills: Skill[] }) {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <Scene skills={skills} />
      </Canvas>
    </div>
  );
}
