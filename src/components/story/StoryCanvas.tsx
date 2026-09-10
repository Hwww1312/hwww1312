"use client";

import dynamic from "next/dynamic";
import { Suspense, forwardRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CHAPTERS } from "@/data/storyConfig";
import { ModelFallback } from "@/components/three/ModelFallback";
import { storyState } from "@/lib/story/state";

const StoryScene = dynamic(
  () => import("./StoryScene").then((m) => m.StoryScene),
  { ssr: false },
);

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const HERO = CHAPTERS[0].camera;

/**
 * The single exposure knob for the whole page, matched between the graded
 * path and the plain renderer fallback so both look like the same film.
 * It is well under one on purpose: the shadow side of the bowl has to fall
 * away into the dark, and a correctly exposed dish on a black ground is a
 * blown-out dish everywhere else.
 */
export const EXPOSURE = 0.52;

/**
 * One persistent canvas for the whole story, fixed behind the page.
 *
 * Because it is fixed rather than pinned there is no GSAP pin-spacer in the
 * document flow, so the HTML keeps its natural rhythm and nothing collapses
 * when the viewport resizes. It never receives pointer events, so every link
 * and button underneath stays clickable — which is what lets the hero and the
 * closing statement sit behind the canvas and be overlapped by the bowl while
 * remaining perfectly readable and perfectly interactive.
 */
export const StoryCanvas = forwardRef<HTMLDivElement, { inView: boolean }>(
  function StoryCanvas({ inView }, ref) {
    const [support, setSupport] = useState<"pending" | "yes" | "no">("pending");
    const [visible, setVisible] = useState(true);
    const [lowPower, setLowPower] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
      setSupport(hasWebGL() ? "yes" : "no");

      // A coarse pointer is the real signal — it is what every phone and
      // tablet reports. Core count is only a backstop for very old machines:
      // four cores is ordinary desktop hardware and is not on its own a
      // reason to strip the scene back.
      const cores = navigator.hardwareConcurrency ?? 8;
      setLowPower(window.matchMedia("(pointer: coarse)").matches || cores < 4);

      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(motion.matches);
      storyState.reducedMotion = motion.matches;

      // A restored scroll position or a deep link means the visitor is not
      // looking at the hero, and playing the reveal into an empty frame looks
      // broken rather than cinematic.
      storyState.skipIntro = window.scrollY > 40;
      storyState.debug = window.location.search.includes("storydebug");

      const onVisibility = () => setVisible(!document.hidden);
      document.addEventListener("visibilitychange", onVisibility);
      return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    if (support === "no") return <ModelFallback />;

    return (
      <div
        ref={ref}
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        aria-hidden="true"
      >
        {support === "yes" && (
          <Canvas
            // Rendering stops when the tab is hidden or the story has scrolled
            // away, so the page never burns battery in the background. Under
            // reduced motion there is nothing to animate, so frames are drawn
            // on demand instead of sixty times a second.
            frameloop={
              reducedMotion ? "demand" : visible && inView ? "always" : "never"
            }
            dpr={[1, lowPower ? 1.5 : 2]}
            gl={{
              antialias: !lowPower,
              powerPreference: "high-performance",
              // Transparent, so the page's own typography shows through and
              // the bowl can genuinely overlap it.
              alpha: true,
            }}
            shadows="soft"
            onCreated={({ gl }) => {
              // The fallback path for hardware that cannot take the grade.
              // Where the grade runs it turns this off and tone maps itself.
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = EXPOSURE;
              gl.setClearColor(0x000000, 0);
              storyState.ready = true;
            }}
            camera={{
              position: HERO.position,
              fov: HERO.fov,
              near: 0.1,
              far: 60,
            }}
          >
            <Suspense fallback={null}>
              <StoryScene lowPower={lowPower} reducedMotion={reducedMotion} />
            </Suspense>
          </Canvas>
        )}
      </div>
    );
  },
);
