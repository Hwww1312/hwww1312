"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { MOBILE_OFFSETS } from "@/data/storyConfig";
import { storyRuntime } from "@/lib/animation/storyRuntime";

export function CameraRig() {
  const { camera } = useThree();

  useFrame(() => {
    const s = storyRuntime.state;
    const mobile = storyRuntime.mobile;
    const zBoost = mobile ? MOBILE_OFFSETS.cameraZ : 0;

    camera.position.set(
      s.cameraPosition[0] * (mobile ? 0.85 : 1),
      s.cameraPosition[1],
      s.cameraPosition[2] + zBoost,
    );
    camera.lookAt(
      s.cameraLookAt[0],
      s.cameraLookAt[1],
      s.cameraLookAt[2],
    );
  });

  return null;
}
