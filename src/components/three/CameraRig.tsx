"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { resolveStory, storyState } from "@/lib/story/state";

const target = new THREE.Vector3();

/**
 * The camera is owned here and nowhere else. Every frame it is placed straight
 * from the resolved story state, so no second animation system can fight it.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useFrame(() => {
    const { camera: cam } = resolveStory(storyState.progress, storyState.isMobile);
    camera.position.set(...cam.position);
    target.set(...cam.target);
    camera.lookAt(target);
    if (camera.fov !== cam.fov) {
      camera.fov = cam.fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
