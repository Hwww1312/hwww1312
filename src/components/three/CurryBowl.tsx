"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildDish, dishMaterials } from "@/lib/three/curry";
import { INTRO } from "@/data/storyConfig";
import { resolveIntro, resolveStory, storyState, window01 } from "@/lib/story/state";

/**
 * The hero: one Cambodian fish curry noodle bowl, floating.
 *
 * Everything the visitor sees of the dish is driven from here — the opening
 * rise out of the dark, the scroll pose, the pointer lean, the idle float,
 * and the small separation of the garnishes in chapter 04. All of it is
 * resolved from pure functions of scroll progress and elapsed time, so the
 * bowl can never jump between states: stop mid-scroll and it holds, scroll
 * back and it retraces exactly the poses it came through.
 */

/** The pointer never moves the dish more than this, in radians. */
const POINTER_YAW = 0.15; // ~8.5 degrees
const POINTER_PITCH = 0.09; // ~5 degrees

/** Idle float, in world units. About ten pixels at the hero framing. */
const FLOAT_Y = 0.03;

export function CurryBowl({ lowPower }: { lowPower: boolean }) {
  const anchor = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const clusterRefs = useRef<(THREE.Group | null)[]>([]);
  const maxAniso = useThree((s) => s.gl.capabilities.getMaxAnisotropy());

  const dish = useMemo(() => buildDish(lowPower ? "low" : "high"), [lowPower]);
  const materials = useMemo(() => dishMaterials(maxAniso), [maxAniso]);

  useEffect(() => () => dish.dispose(), [dish]);
  useEffect(() => () => materials.dispose(), [materials]);

  useFrame(() => {
    const a = anchor.current;
    const s = spin.current;
    if (!a || !s) return;

    const elapsed = storyState.elapsed;
    const intro = resolveIntro(elapsed - storyState.startedAt);
    const { model } = resolveStory(storyState.progress, storyState.isMobile);
    const still = storyState.reducedMotion;

    // The rise: up from below the frame, growing from three-quarter scale,
    // unwinding a little yaw as it settles. Slow, and with no overshoot.
    const riseY = (1 - intro.rise) * INTRO.riseFrom;
    const float = still ? 0 : Math.sin(elapsed * 0.38) * FLOAT_Y * intro.rise;

    a.position.set(
      model.position[0],
      model.position[1] + riseY + float,
      model.position[2],
    );

    const p = storyState.pointer;
    s.rotation.set(
      model.rotation[0] + p.dy * POINTER_PITCH,
      model.rotation[1] + p.dx * POINTER_YAW + (1 - intro.rise) * INTRO.yawFrom,
      model.rotation[2] + p.dx * 0.02,
    );
    s.scale.setScalar(
      model.scale * (INTRO.scaleFrom + (1 - INTRO.scaleFrom) * intro.rise),
    );

    // The separation. Each cluster leaves on its own beat and travels a very
    // short distance: the dish comes apart in the hand, it does not explode.
    dish.clusters.forEach((cluster, i) => {
      const node = clusterRefs.current[i];
      if (!node) return;
      const t = window01(model.spread, cluster.delay, cluster.delay + 0.62);
      const bob = still ? 0 : Math.sin(elapsed * 0.5 + cluster.phase) * 0.006 * t;
      node.position.set(
        cluster.drift[0] * t,
        cluster.drift[1] * t + bob,
        cluster.drift[2] * t,
      );
      node.rotation.set(
        cluster.spin[0] * t,
        cluster.spin[1] * t,
        cluster.spin[2] * t,
      );
    });
  });

  return (
    <group ref={anchor} dispose={null}>
      {/* No shadow catcher: the bowl is isolated in space, and a plane under
          it reads as a hard-edged rectangle against a transparent canvas —
          a floor where the whole point is that there is none. The grounding
          comes from the key's own self-shadowing and from the pool of warm
          light behind the dish instead. */}
      <group ref={spin}>
        <mesh geometry={dish.bowl} material={materials.ceramic} castShadow receiveShadow />
        <mesh geometry={dish.broth} material={materials.broth} receiveShadow />

        {dish.clusters.map((cluster, i) => (
          <group
            key={cluster.id}
            ref={(el) => {
              clusterRefs.current[i] = el;
            }}
          >
            <mesh
              geometry={cluster.geometry}
              material={materials[cluster.material]}
              castShadow={cluster.castShadow && !lowPower}
              receiveShadow
            />
          </group>
        ))}
      </group>
    </group>
  );
}
