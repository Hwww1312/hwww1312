"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { resolveStory, storyState } from "@/lib/story/state";

/**
 * The contact shadow has to sit under the object, and the object moves on
 * every chapter. Pinning the shadow to a fixed height leaves it floating above
 * the plate, which is what makes crockery look pasted onto the page. This
 * group tracks the resolved model position each frame so the plate always has
 * ground beneath it.
 */
export function GroundShadow() {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const { model } = resolveStory(storyState.progress, storyState.isMobile);
    group.current?.position.set(model.position[0], model.position[1] - 0.01, model.position[2]);
  });

  return (
    <group ref={group}>
      <ContactShadows
        opacity={0.62}
        scale={6}
        blur={1.9}
        far={2.4}
        resolution={512}
        color="#4a3f2c"
      />
    </group>
  );
}
