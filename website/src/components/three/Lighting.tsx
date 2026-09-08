"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { SpotLight, DirectionalLight } from "three";
import { storyRuntime } from "@/lib/animation/storyRuntime";

export function Lighting() {
  const key = useRef<DirectionalLight>(null);
  const accent = useRef<SpotLight>(null);
  const fill = useRef<DirectionalLight>(null);

  useFrame(() => {
    const s = storyRuntime.state;
    if (key.current) key.current.intensity = s.lightIntensity;
    if (accent.current) accent.current.intensity = s.accentIntensity;
    if (fill.current) fill.current.intensity = 0.35 + s.envIntensity * 0.25;
  });

  return (
    <>
      <ambientLight intensity={0.18} color="#9db2a9" />
      <directionalLight
        ref={key}
        position={[3.5, 6, 2]}
        intensity={1.35}
        color="#fff6e8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight
        ref={fill}
        position={[-3, 2, -2]}
        intensity={0.4}
        color="#7ea89a"
      />
      <spotLight
        ref={accent}
        position={[0, 5, 1]}
        angle={0.45}
        penumbra={0.7}
        intensity={0.55}
        color="#c8dc4b"
        castShadow
      />
    </>
  );
}
