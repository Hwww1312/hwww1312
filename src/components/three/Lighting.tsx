"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { resolveStory, storyState } from "@/lib/story/state";

const WARM = new THREE.Color("#ffd9a3");
const NEUTRAL = new THREE.Color("#fff6e8");
const scratch = new THREE.Color();

/**
 * One key light with a warmth dial, plus a lemongrass rim that separates the
 * ceramic from the near-black ground. Both are driven by the story timeline.
 */
export function Lighting() {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);

  useFrame(() => {
    const { lighting } = resolveStory(storyState.progress, storyState.isMobile);
    if (key.current) {
      key.current.position.set(...lighting.keyPosition);
      key.current.intensity = lighting.keyIntensity;
      key.current.color.copy(scratch.copy(NEUTRAL).lerp(WARM, lighting.keyWarmth));
    }
    if (rim.current) rim.current.intensity = lighting.rimIntensity;
    if (ambient.current) ambient.current.intensity = lighting.ambient;
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.08} color="#cfe0d6" />
      <directionalLight
        ref={key}
        position={[2.4, 4.2, 2.2]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-bias={-0.0006}
      />
      <directionalLight ref={rim} position={[-3.2, 1.6, -2.8]} intensity={1.6} color="#c8dc4b" />
    </>
  );
}
