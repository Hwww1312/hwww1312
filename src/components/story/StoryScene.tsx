"use client";

import { Suspense, useEffect } from "react";
import { Preload } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Backdrop } from "@/components/three/Backdrop";
import { CameraRig } from "@/components/three/CameraRig";
import { CurryBowl } from "@/components/three/CurryBowl";
import { IngredientLabels } from "@/components/three/IngredientLabels";
import { Lighting } from "@/components/three/Lighting";
import { PostFX } from "@/components/three/PostFX";
import { Sequencer } from "@/components/three/Sequencer";
import { Steam } from "@/components/three/Steam";
import { StoryEnvironment } from "@/components/three/StoryEnvironment";

/**
 * Nothing renders on demand needs a nudge: under reduced motion the canvas is
 * driven by `invalidate` rather than a running loop, and the first couple of
 * seconds of frames are what let the environment map, the contact shadow and
 * the generated textures land before it goes quiet for good.
 */
function Warmup() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    const until = performance.now() + 2000;
    const tick = () => {
      invalidate();
      if (performance.now() < until) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);
  return null;
}

export function StoryScene({
  lowPower,
  reducedMotion,
}: {
  lowPower: boolean;
  reducedMotion: boolean;
}) {
  const gl = useThree((s) => s.gl);

  // The grade renders the scene into a half-float target. Where that cannot
  // be rendered to, the page falls back to the renderer's own tone mapping
  // rather than showing a black canvas.
  //
  // `extensions.has` both queries and enables, so this is also what turns the
  // capability on for the render targets the grade allocates.
  const canGrade =
    !lowPower &&
    (gl.extensions.has("EXT_color_buffer_float") ||
      gl.extensions.has("EXT_color_buffer_half_float"));

  return (
    <>
      <Sequencer />
      <CameraRig />
      <Lighting lowPower={lowPower} />
      <Suspense fallback={null}>
        <StoryEnvironment />
        <Backdrop />
        {/* The call-outs live inside the bowl's frame, so their anchors ride
            with the dish as it turns rather than floating beside it. */}
        <CurryBowl lowPower={lowPower}>
          <IngredientLabels />
        </CurryBowl>
        <Steam lowPower={lowPower} />
        <Preload all />
      </Suspense>
      {canGrade && <PostFX />}
      {reducedMotion && <Warmup />}
    </>
  );
}
