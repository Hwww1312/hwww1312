"use client";

import { useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { damp, resolveIntro, storyState, window01 } from "@/lib/story/state";

/**
 * The one place time and pointer input enter the scene.
 *
 * It runs at the lowest priority so every other `useFrame` in the tree reads
 * values that were settled this frame, and it is the only writer of
 * `storyState.startedAt` and the damped pointer — so the camera, the rig and
 * the bowl can never drift out of step with one another.
 */
export function Sequencer() {
  useEffect(() => {
    if (storyState.reducedMotion) return;
    const p = storyState.pointer;

    const onMove = (e: PointerEvent) => {
      p.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.y = (e.clientY / window.innerHeight) * 2 - 1;
      p.movedAt = storyState.elapsed;
    };
    const onLeave = () => {
      p.x = 0;
      p.y = 0;
    };

    // Passive: this must never delay a scroll.
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    storyState.elapsed = elapsed;
    if (storyState.startedAt < 0) storyState.startedAt = elapsed;

    // Clamp the step so a dropped frame or a backgrounded tab cannot make
    // anything jump when it comes back.
    const dt = Math.min(delta, 0.1);
    const p = storyState.pointer;
    // The bowl only follows an active pointer. Leave the mouse still and the
    // influence bleeds away over a few seconds and the dish returns to rest.
    const rest = 1 - window01(elapsed - p.movedAt, 1.8, 4.5);
    p.dx = damp(p.dx, p.x * rest, 0.0022, dt);
    p.dy = damp(p.dy, p.y * rest, 0.0022, dt);

    // Opt-in diagnostics. The controller's own debug payload is only written
    // on a scroll tick, so the opening sequence — which runs with the page
    // perfectly still — needs a live one of its own.
    if (storyState.debug) {
      (window as unknown as { __live?: unknown }).__live = {
        t: +(elapsed - storyState.startedAt).toFixed(2),
        intro: resolveIntro(elapsed - storyState.startedAt),
        pointer: { dx: +p.dx.toFixed(3), dy: +p.dy.toFixed(3) },
        grading: storyState.grading,
      };
    }
  }, -10);

  return null;
}
