"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";
import { HeroModel } from "@/components/three/HeroModel";
import { Lighting } from "@/components/three/Lighting";
import { EnvironmentFloor } from "@/components/three/Environment";
import { CameraRig } from "@/components/three/CameraRig";
import { ModelFallback } from "@/components/three/ModelFallback";
import { WebGLErrorBoundary } from "@/components/three/WebGLErrorBoundary";
import { setStoryRuntime } from "@/lib/animation/storyRuntime";
import { usePrefersReducedMotion } from "@/lib/accessibility/hooks";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function StoryCanvas() {
  const reducedMotion = usePrefersReducedMotion();
  const [webglOk] = useState(() =>
    typeof window === "undefined" ? true : supportsWebGL(),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStoryRuntime({ reducedMotion });
  }, [reducedMotion]);

  if (reducedMotion || !webglOk) {
    return (
      <div className="canvas-host grain-overlay" aria-hidden="true">
        <ModelFallback
          reason={
            reducedMotion
              ? "Motion reduced — static plate composition."
              : "3D unavailable — static plate composition."
          }
        />
      </div>
    );
  }

  return (
    <WebGLErrorBoundary>
      <div className="canvas-host grain-overlay" aria-hidden="true">
        {!ready ? <ModelFallback reason="Lighting the plate…" /> : null}
        <Canvas
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0.15, 1.35, 3.4], fov: 35, near: 0.1, far: 40 }}
          shadows
          onCreated={() => {
            setReady(true);
            setStoryRuntime({ webglReady: true });
          }}
        >
          <color attach="background" args={["#071c18"]} />
          <fog attach="fog" args={["#071c18", 6, 16]} />
          <Suspense fallback={null}>
            <Lighting />
            <EnvironmentFloor />
            <HeroModel />
            <CameraRig />
            <AdaptiveDpr pixelated />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
