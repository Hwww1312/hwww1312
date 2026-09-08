"use client";

import { Suspense } from "react";
import { ContactShadows, Preload } from "@react-three/drei";
import { HeroModel } from "@/components/three/HeroModel";
import { Lighting } from "@/components/three/Lighting";
import { StoryEnvironment } from "@/components/three/StoryEnvironment";
import { CameraRig } from "@/components/three/CameraRig";

export function StoryScene({ shadows }: { shadows: boolean }) {
  return (
    <>
      <CameraRig />
      <Lighting />
      <Suspense fallback={null}>
        <StoryEnvironment />
        <HeroModel />
        <Preload all />
      </Suspense>
      {shadows && (
        <ContactShadows
          position={[0, -0.42, 0]}
          opacity={0.55}
          scale={9}
          blur={2.6}
          far={4}
          resolution={512}
          color="#010a07"
        />
      )}
    </>
  );
}
