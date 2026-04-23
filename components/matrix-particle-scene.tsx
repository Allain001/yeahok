"use client";

import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group } from "three";

function ParticleField() {
  const groupRef = useRef<Group>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(1800);
    for (let i = 0; i < data.length; i += 3) {
      const t = i / 3;
      data[i] = (Math.sin(t * 0.45) + Math.cos(t * 0.18)) * 2.4;
      data[i + 1] = (Math.cos(t * 0.35) - Math.sin(t * 0.22)) * 1.8;
      data[i + 2] = (Math.sin(t * 0.08) + Math.cos(t * 0.14)) * 2.1;
    }
    return data;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.18;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Points positions={positions} stride={3}>
        <PointMaterial transparent color="#00d4ff" size={0.08} sizeAttenuation depthWrite={false} />
      </Points>
      <mesh rotation={[0.6, 0.8, 0]}>
        <torusKnotGeometry args={[1.8, 0.16, 160, 24]} />
        <meshStandardMaterial color="#7c3aed" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export function MatrixParticleScene() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={["#030712"]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[4, 6, 5]} intensity={2.4} color="#00d4ff" />
        <directionalLight position={[-4, -2, -3]} intensity={1.6} color="#7c3aed" />
        <ParticleField />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(3,7,18,0.7)_100%)]" />
    </div>
  );
}
