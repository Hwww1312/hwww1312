"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { resolveStory, storyState } from "@/lib/story/state";

const WARM = new THREE.Color("#ffd9a3");
const NEUTRAL = new THREE.Color("#fff6e8");
const scratch = new THREE.Color();

/**
 * A studio rig, not a room light.
 *
 * One hard key rakes across the food, a cool kicker carves the far edge, and
 * almost nothing else — so the shadow side goes properly dark and the surface
 * work on the meat has something to read against. Ambient is kept thin on
 * purpose: a generous fill throws the whole look away.
 *
 * Intensities carry a factor of PI because three meters lights in physical
 * units, while the chapter values are authored in the legacy scale.
 */
export function Lighting({ lowPower }: { lowPower: boolean }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const sky = useRef<THREE.HemisphereLight>(null);
  const target = useRef<THREE.Object3D>(null);

  useFrame(() => {
    const { lighting, model } = resolveStory(storyState.progress, storyState.isMobile);
    if (key.current) {
      key.current.position.set(
        model.position[0] + lighting.keyPosition[0],
        lighting.keyPosition[1],
        lighting.keyPosition[2],
      );
      key.current.intensity = lighting.keyIntensity * 2.5 * Math.PI;
      key.current.color.copy(scratch.copy(NEUTRAL).lerp(WARM, lighting.keyWarmth));
    }
    // Aim the key at the subject, or the shadow frustum drifts off it as the
    // model travels across the page. The binding is done here rather than as
    // a prop because the target ref is still null on the first render.
    if (target.current && key.current) {
      key.current.target = target.current;
      target.current.position.set(...model.position);
      target.current.updateMatrixWorld();
    }
    if (fill.current) fill.current.intensity = 0.3 * Math.PI;
    if (sky.current) sky.current.intensity = lighting.ambient * 0.11 * Math.PI * Math.PI;
  });

  return (
    <>
      <hemisphereLight ref={sky} args={["#fff4e2", "#6b5a44", 0.2]} />
      <object3D ref={target} />
      <directionalLight
        ref={key}
        position={[2.6, 4, 2.6]}
        intensity={10}
        color="#fff2dc"
        castShadow
        shadow-mapSize={lowPower ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-3.4}
        shadow-camera-right={3.4}
        shadow-camera-top={3.4}
        shadow-camera-bottom={-3.4}
        shadow-camera-near={0.4}
        shadow-camera-far={14}
        shadow-bias={-0.0004}
        shadow-normalBias={0.022}
        shadow-radius={1.6}
      />
      {/* the kicker: cool, from behind, just enough to cut the silhouette off
          the cream page without reading as a second sun */}
      <directionalLight ref={fill} position={[-3.0, 1.5, -2.8]} intensity={1} color="#bcd6e4" />
    </>
  );
}
