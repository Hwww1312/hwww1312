"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { resolveIntro, resolveStory, storyState } from "@/lib/story/state";

const WARM = new THREE.Color("#ffcf8a");
const NEUTRAL = new THREE.Color("#fff4e4");
const scratch = new THREE.Color();
const keyPos = new THREE.Vector3();

/**
 * A four-source studio rig, not a room light.
 *
 * Key — a warm golden spot from above and slightly in front, and by a long
 * way the strongest source. It is a spot rather than a directional so the
 * page can open on a narrow cone that widens as the dish is revealed, and so
 * the light falls off past the bowl instead of lighting an empty void.
 *
 * Rim — warm orange from behind and low. This is what separates the ceramic
 * from the dark ground; without it the bowl's silhouette dissolves.
 *
 * Fill — a very soft neutral bounce from the opposite side, just enough that
 * the shadow side keeps its shape.
 *
 * Accent — a whisper of tropical green raking across the herbs. It is meant
 * to be felt rather than seen: turn it up and the whole scene goes swampy.
 *
 * Intensities carry a factor of PI because three meters lights in physical
 * units while the chapter values are authored on a plain 0-2 scale.
 */
export function Lighting({ lowPower }: { lowPower: boolean }) {
  const key = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const accent = useRef<THREE.DirectionalLight>(null);
  const sky = useRef<THREE.HemisphereLight>(null);
  const target = useRef<THREE.Object3D>(null);

  useFrame(() => {
    const { lighting, model } = resolveStory(storyState.progress, storyState.isMobile);
    const intro = resolveIntro(storyState.elapsed - storyState.startedAt);

    // Aim everything at the dish. Without this the shadow frustum drifts off
    // the subject as the bowl travels across the page.
    const t = target.current;
    if (t) {
      t.position.set(...model.position);
      t.updateMatrixWorld();
    }

    if (key.current && t) {
      key.current.target = t;
      keyPos.set(
        model.position[0] + lighting.keyPosition[0],
        lighting.keyPosition[1],
        lighting.keyPosition[2],
      );
      key.current.position.copy(keyPos);
      // Physical falloff means intensity has to be normalised against the
      // throw, or moving the lamp changes the exposure of the whole page.
      const d2 = keyPos.distanceToSquared(t.position);
      key.current.intensity = lighting.keyIntensity * 1.15 * Math.PI * d2 * intro.light;
      key.current.color.copy(scratch.copy(NEUTRAL).lerp(WARM, lighting.keyWarmth));
      // The reveal: a narrow cone that opens out as the food comes up.
      key.current.angle = 0.2 + intro.light * 0.28;
    }

    // The supporting sources come up behind the key, so the first thing the
    // page shows is one shaft of warm light finding the bowl.
    const follow = intro.light * intro.light;
    if (rim.current) {
      rim.current.target = t ?? rim.current.target;
      rim.current.intensity = lighting.rimIntensity * 0.62 * Math.PI * follow;
    }
    if (fill.current) fill.current.intensity = lighting.fillIntensity * 0.4 * Math.PI * follow;
    if (accent.current) {
      accent.current.intensity = lighting.accentIntensity * 0.4 * Math.PI * follow;
    }
    if (sky.current) sky.current.intensity = lighting.ambient * 0.1 * follow;
  });

  return (
    <>
      <hemisphereLight ref={sky} args={["#4a3a2a", "#0a0705", 0.2]} />
      <object3D ref={target} />

      <spotLight
        ref={key}
        position={[-2.1, 4.2, 2.6]}
        intensity={0}
        angle={0.2}
        penumbra={0.72}
        decay={2}
        distance={0}
        color="#ffe0b4"
        castShadow
        shadow-mapSize={lowPower ? [1024, 1024] : [2048, 2048]}
        shadow-camera-near={0.6}
        shadow-camera-far={16}
        shadow-bias={-0.0006}
        shadow-normalBias={0.018}
        shadow-radius={2.2}
        shadow-focus={1}
      />

      {/* Rim: behind and low, warm gold. The separation light. */}
      <directionalLight ref={rim} position={[1.4, 0.9, -3.6]} intensity={0} color="#ff9c3e" />

      {/* Fill: soft, neutral, opposite the key. */}
      <directionalLight ref={fill} position={[3.4, 1.4, 2.2]} intensity={0} color="#e8e4dc" />

      {/* Accent: tropical green, raking, and almost subliminal. */}
      <directionalLight ref={accent} position={[-2.8, 0.3, -1.4]} intensity={0} color="#63c07d" />
    </>
  );
}
