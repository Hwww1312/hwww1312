"use client";

import { Suspense } from "react";
import { Preload } from "@react-three/drei";
import { GroundShadow } from "@/components/three/GroundShadow";
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
      {shadows && <GroundShadow />}
    </>
  );
}
