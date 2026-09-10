"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SURFACE } from "@/lib/three/curry";
import { radialSprite, rng, steamSprite } from "@/lib/three/textures";
import { resolveIntro, resolveStory, storyState, clamp01 } from "@/lib/story/state";

/**
 * Steam off the curry, and dust in the light.
 *
 * Both are single instanced draws. The steam is additive over a dark ground,
 * which means a puff fades by going towards black rather than by needing a
 * per-instance alpha — so the whole field is one `InstancedMesh` with an
 * instance colour, and no custom shader.
 *
 * It is kept deliberately thin. Steam that reads clearly in a still frame is
 * far too much steam in motion, and the food has to stay legible through it.
 */

interface Puff {
  /** Where on the broth it lifts off. */
  x: number;
  z: number;
  /** Seconds for one full rise. */
  life: number;
  /** Offset into that cycle, so they do not pulse together. */
  offset: number;
  drift: number;
  sway: number;
  size: number;
  tint: number;
}

export function Steam({ lowPower }: { lowPower: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const motes = useRef<THREE.Points>(null);
  const camera = useThree((s) => s.camera);

  const count = lowPower ? 10 : 26;
  const moteCount = lowPower ? 0 : 56;

  const texture = useMemo(() => steamSprite(), []);
  const moteTexture = useMemo(
    () => radialSprite("rgba(255,226,178,1)", "rgba(255,190,110,0)"),
    [],
  );

  const puffs = useMemo<Puff[]>(() => {
    const random = rng(775511);
    return Array.from({ length: count }, () => {
      const a = random() * Math.PI * 2;
      const r = random() * 0.5;
      return {
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        life: 5.5 + random() * 4.5,
        offset: random(),
        drift: (random() - 0.5) * 0.34,
        sway: random() * Math.PI * 2,
        size: 0.2 + random() * 0.24,
        tint: random(),
      };
    });
  }, [count]);

  const moteGeometry = useMemo(() => {
    const random = rng(31337);
    const positions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i += 1) {
      positions[i * 3] = (random() - 0.5) * 7;
      positions[i * 3 + 1] = (random() - 0.5) * 4.4;
      positions[i * 3 + 2] = (random() - 0.5) * 4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [moteCount]);

  useEffect(() => {
    return () => {
      texture.dispose();
      moteTexture.dispose();
      moteGeometry.dispose();
    };
  }, [texture, moteTexture, moteGeometry]);

  const scratch = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      p: new THREE.Vector3(),
      s: new THREE.Vector3(),
      c: new THREE.Color(),
      warm: new THREE.Color("#ffdcae"),
      cool: new THREE.Color("#d8dcd6"),
    }),
    [],
  );

  useFrame(() => {
    const inst = mesh.current;
    if (!inst) return;

    const elapsed = storyState.elapsed;
    const intro = resolveIntro(elapsed - storyState.startedAt);
    const { model, lighting } = resolveStory(storyState.progress, storyState.isMobile);

    // Steam is a chapter-04 accent as much as a hero detail: it thickens as
    // the dish comes apart, and thins out when the type needs the frame.
    const strength =
      intro.light * (0.55 + model.spread * 0.55) * clamp01(lighting.glow * 0.9 + 0.18);
    // Frozen mid-rise for anyone who asked for less motion, so the frame
    // still reads as a hot bowl without anything moving.
    const time = storyState.reducedMotion ? 3.2 : elapsed;

    for (let i = 0; i < puffs.length; i += 1) {
      const puff = puffs[i];
      const t = ((time / puff.life + puff.offset) % 1 + 1) % 1;

      // Rise, spreading and slowing as it goes.
      const y = SURFACE + t * 0.95;
      const spread = 0.16 + t * 0.6;
      const sway = Math.sin(time * 0.25 + puff.sway) * 0.16 * t;

      // Offset by the bowl's own position: the steam field is a sibling of
      // the dish, not a child of it, so without this it rises from the
      // middle of the page while the bowl sits off to one side.
      scratch.p.set(
        model.position[0] + puff.x * (1 + t * 0.5) + puff.drift * t + sway,
        model.position[1] + y,
        model.position[2] + puff.z * (1 + t * 0.5) + sway * 0.6,
      );
      const size = puff.size * (0.45 + spread);
      scratch.s.set(size, size, size);
      // Billboard: steam has no silhouette of its own to lose.
      scratch.m.compose(scratch.p, camera.quaternion, scratch.s);
      inst.setMatrixAt(i, scratch.m);

      // In and out: nothing pops on, nothing cuts off.
      const fade = Math.sin(t * Math.PI) ** 1.6;
      const level = fade * strength * 0.085;
      scratch.c.copy(scratch.cool).lerp(scratch.warm, puff.tint * 0.8 + 0.2);
      scratch.c.multiplyScalar(level);
      inst.setColorAt(i, scratch.c);
    }

    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;

    // The dust drifts with the bowl so it never reads as a separate layer.
    const dust = motes.current;
    if (dust) {
      dust.position.set(model.position[0] * 0.6, 0.4, 0);
      dust.rotation.y = storyState.reducedMotion ? 0 : elapsed * 0.012;
      const material = dust.material as THREE.PointsMaterial;
      material.opacity = 0.2 * intro.light * clamp01(lighting.glow);
    }
  });

  return (
    <>
      <instancedMesh
        ref={mesh}
        args={[undefined, undefined, count]}
        frustumCulled={false}
        renderOrder={2}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped
        />
      </instancedMesh>

      {moteCount > 0 && (
        <points ref={motes} geometry={moteGeometry} frustumCulled={false} renderOrder={1}>
          <pointsMaterial
            map={moteTexture}
            size={0.055}
            sizeAttenuation
            transparent
            opacity={0.3}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped
          />
        </points>
      )}
    </>
  );
}
