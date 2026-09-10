"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { studioEnvironment } from "@/lib/three/textures";

/**
 * Installs the painted studio environment used for image-based lighting.
 *
 * Drawn at runtime rather than fetched, so there is no HDRI download and no
 * third-party request, and the highlights on the broth and the glaze are
 * art-directed rather than inherited from someone else's photograph.
 */
export function StoryEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const env = studioEnvironment(gl);
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [gl, scene]);

  return null;
}
