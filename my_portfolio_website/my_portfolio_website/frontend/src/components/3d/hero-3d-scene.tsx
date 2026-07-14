"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

function AnimatedNodes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.5, 32, 32]} position={[3, 2, 0]}>
          <meshStandardMaterial color="#60a5fa" metalness={0.8} roughness={0.2} emissive="#60a5fa" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
      
      <Float speed={2.5} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.4, 32, 32]} position={[-3, -1, 2]}>
          <meshStandardMaterial color="#a78bfa" metalness={0.8} roughness={0.2} emissive="#a78bfa" emissiveIntensity={0.5} />
        </Sphere>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <Sphere args={[0.6, 32, 32]} position={[0, -2, -3]}>
          <meshStandardMaterial color="#34d399" metalness={0.8} roughness={0.2} emissive="#34d399" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
    </group>
  );
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#60a5fa" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#a78bfa" />
        
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <AnimatedNodes />
      </Canvas>
    </div>
  );
}
