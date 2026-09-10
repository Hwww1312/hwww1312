"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { INTRO } from "@/data/storyConfig";
import { resolveIntro, resolveStory, storyState } from "@/lib/story/state";

const target = new THREE.Vector3();
const position = new THREE.Vector3();
const back = new THREE.Vector3();

/**
 * The camera is owned here and nowhere else. Every frame it is placed
 * straight from the resolved story state, so no second animation system can
 * fight it for control, and scrubbing backwards retraces the same path.
 *
 * On top of the scroll pose it carries two things: the slow push forward that
 * finishes the opening sequence, and a parallax shift of a few centimetres
 * from the pointer. The parallax is small enough to be felt as depth rather
 * than seen as movement.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  useFrame(() => {
    const { camera: cam } = resolveStory(storyState.progress, storyState.isMobile);
    const intro = resolveIntro(storyState.elapsed - storyState.startedAt);

    position.set(...cam.position);
    target.set(...cam.target);

    // The push: start further back along the view axis and creep in.
    back.copy(position).sub(target).normalize();
    position.addScaledVector(back, (1 - intro.push) * INTRO.pushFrom);

    if (!storyState.reducedMotion) {
      const p = storyState.pointer;
      position.x += p.dx * 0.08;
      position.y -= p.dy * 0.05;
    }

    camera.position.copy(position);
    camera.lookAt(target);
    if (camera.fov !== cam.fov) {
      camera.fov = cam.fov;
      camera.updateProjectionMatrix();
    }
  }, -5);

  return null;
}
