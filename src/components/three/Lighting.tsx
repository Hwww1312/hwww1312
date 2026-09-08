"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { resolveStory, storyState } from "@/lib/story/state";

const WARM = new THREE.Color("#ffd9a3");
const NEUTRAL = new THREE.Color("#fff6e8");
const scratch = new THREE.Color();

/**
 * Lighting for a light set.
 *
 * On a cream page the subject is darker than its surroundings, so the work is
 * done by a broad hemisphere fill plus one directional key that casts the
 * shadow grounding the plate. A rim light would be invisible here, so the
 * separation comes from the shadow instead.
 */
export function Lighting() {
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const sky = useRef<THREE.HemisphereLight>(null);

  useFrame(() => {
    const { lighting } = resolveStory(storyState.progress, storyState.isMobile);
    if (key.current) {
      key.current.position.set(...lighting.keyPosition);
      key.current.intensity = lighting.keyIntensity;
      key.current.color.copy(scratch.copy(NEUTRAL).lerp(WARM, lighting.keyWarmth));
    }
    if (fill.current) fill.current.intensity = lighting.rimIntensity;
    if (sky.current) sky.current.intensity = lighting.ambient;
  });

  return (
    <>
      {/* Cream sky, warm timber bounce from below. */}
      <hemisphereLight ref={sky} args={["#fff8ec", "#d8c3a0", 0.7]} />
      <directionalLight
        ref={key}
        position={[2.4, 4.2, 2.2]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-bias={-0.0006}
      />
      <directionalLight ref={fill} position={[-3.2, 1.8, -2.4]} intensity={0.5} color="#cfe0d6" />
    </>
  );
}
