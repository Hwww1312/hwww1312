"use client";

import dynamic from "next/dynamic";
import { Suspense, forwardRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { ModelFallback } from "@/components/three/ModelFallback";
import { storyState } from "@/lib/story/state";

const StoryScene = dynamic(
  () => import("./StoryScene").then((m) => m.StoryScene),
  { ssr: false },
);

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * One persistent canvas for the whole story, fixed behind the page.
 *
 * Because it is fixed rather than pinned, there is no GSAP pin-spacer in the
 * document flow, so the HTML keeps its natural rhythm and nothing collapses
 * when the viewport resizes. It never receives pointer events, so every link
 * and button underneath stays clickable.
 */
export const StoryCanvas = forwardRef<HTMLDivElement, { inView: boolean }>(function StoryCanvas(
  { inView },
  ref,
) {
  const [support, setSupport] = useState<"pending" | "yes" | "no">("pending");
  const [visible, setVisible] = useState(true);
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    setSupport(hasWebGL() ? "yes" : "no");
    // Coarse pointer plus few cores is a reasonable proxy for a phone that
    // will not enjoy contact shadows.
    const cores = navigator.hardwareConcurrency ?? 8;
    // Four cores is ordinary desktop hardware in 2025, so it is not on its
    // own a reason to strip the scene back.
    setLowPower(window.matchMedia("(pointer: coarse)").matches || cores <= 2);

    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  if (support === "no") return <ModelFallback />;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      aria-hidden="true"
    >
      {support === "yes" && (
        <Canvas
          // Rendering stops when the tab is hidden or the story has scrolled
          // away, so the page never burns battery in the background.
          frameloop={visible && inView ? "always" : "never"}
          dpr={[1, lowPower ? 1.5 : 2]}
          gl={{ antialias: !lowPower, powerPreference: "high-performance", alpha: true }}
          // Shadows stay on everywhere: the cast shadow is what grounds the
          // plate, so it is resolution that gives way on weak hardware, not the
          // shadow itself.
          shadows="soft"
          // Filmic, so highlights on the glaze roll off instead of clipping
          // flat to white the way they do under linear mapping.
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.0;
            storyState.ready = true;
          }}
          camera={{ position: [0, 1.15, 5.1], fov: 34, near: 0.1, far: 60 }}
        >
          <Suspense fallback={null}>
            <StoryScene lowPower={lowPower} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
});
