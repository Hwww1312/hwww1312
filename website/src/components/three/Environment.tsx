"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { storyRuntime } from "@/lib/animation/storyRuntime";

/** Soft ground plane + atmospheric vignette disc — no HDRI dependency. */
export function EnvironmentFloor() {
  const glow = useRef<Mesh>(null);

  useFrame(() => {
    if (!glow.current) return;
    const mat = glow.current.material as import("three").MeshBasicMaterial;
    mat.opacity = 0.08 + storyRuntime.state.envIntensity * 0.12;
  });

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.55, 0]}
        receiveShadow
      >
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#04110e" roughness={0.95} metalness={0} />
      </mesh>
      <mesh ref={glow} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.54, 0]}>
        <circleGeometry args={[1.6, 64]} />
        <meshBasicMaterial color="#c8dc4b" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}
