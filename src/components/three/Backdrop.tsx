"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { radialSprite } from "@/lib/three/textures";
import { resolveIntro, resolveStory, storyState } from "@/lib/story/state";

const dir = new THREE.Vector3();
const bowl = new THREE.Vector3();

/**
 * The pool of warm light the dish floats in.
 *
 * A single additive card that always sits directly behind the bowl on the
 * camera axis, so it reads as a light source in the room rather than as a
 * gradient stuck to the back of the frame. It is the one thing on the page
 * allowed to bloom freely, which is what gives the rim light somewhere to
 * come from.
 */
export function Backdrop() {
  const plane = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera);
  const texture = useMemo(
    () => radialSprite("rgba(255,178,88,1)", "rgba(120,50,10,0)", 0.42),
    [],
  );

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    const mesh = plane.current;
    if (!mesh) return;
    const { model, lighting } = resolveStory(storyState.progress, storyState.isMobile);
    const intro = resolveIntro(storyState.elapsed - storyState.startedAt);

    bowl.set(model.position[0], model.position[1] + 0.35, model.position[2]);
    dir.copy(bowl).sub(camera.position).normalize();
    mesh.position.copy(bowl).addScaledVector(dir, 2.6);
    mesh.quaternion.copy(camera.quaternion);

    const material = mesh.material as THREE.MeshBasicMaterial;
    material.opacity = 0.52 * lighting.glow * intro.light;
  });

  return (
    <mesh ref={plane} frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[7.5, 7.5]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
        toneMapped
      />
    </mesh>
  );
}
