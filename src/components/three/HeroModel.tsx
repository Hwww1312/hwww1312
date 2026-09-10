"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  BOWL_PROFILE, GLAZE, PLATE_PROFILE, POT_PROFILE,
  brothMaterial, glazeMaterial, steelMaterial, vesselGeometry,
} from "@/lib/three/ceramics";
import { type MeatKind, meatGeometry, meatSurface } from "@/lib/three/meat";
import { resolveStory, storyState } from "@/lib/story/state";

/**
 * The hero object: skewers off the grill landing on a plate, and that plate
 * opening into a shared table.
 *
 * Nothing here is a photograph. Every surface is generated geometry, so the
 * restaurant's own listing images are not reproduced on the page.
 */

const SKEWER_COUNT = 5;
const KINDS: MeatKind[] = ["beef", "pork", "beef", "pork", "beef"];

interface Piece {
  kind: "plate" | "bowl" | "pot" | "side";
  stacked: [number, number, number];
  table: [number, number, number];
  stackedScale: number;
  tableScale: number;
}

const PIECES: Piece[] = [
  { kind: "plate", stacked: [0, 0, 0], table: [0, 0, 0.45], stackedScale: 1, tableScale: 1 },
  { kind: "bowl", stacked: [0, -0.12, 0], table: [-1.5, 0, -0.1], stackedScale: 0.55, tableScale: 1 },
  { kind: "pot", stacked: [0, -0.16, 0], table: [1.42, 0, -0.42], stackedScale: 0.5, tableScale: 1.05 },
  { kind: "side", stacked: [0, -0.08, 0], table: [-0.05, 0, -1.5], stackedScale: 0.5, tableScale: 0.78 },
];

const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Where each skewer starts, arcs through, and comes to rest. */
const FLIGHT = Array.from({ length: SKEWER_COUNT }, (_, i) => {
  const spread = i - 2;
  return {
    from: [3.4 + i * 0.28, 2.5 + i * 0.34, -1.3 - i * 0.2] as const,
    ctrl: [1.5 + spread * 0.2, 1.9 + i * 0.12, -0.35] as const,
    to: [spread * 0.06, 0.1 + Math.abs(spread) * 0.012, spread * 0.3] as const,
    rotFrom: [0.9 - i * 0.25, -1.4 + i * 0.3, 1.25 - i * 0.2] as const,
    rotTo: [0.02 * spread, -0.16 + spread * 0.2, 0.02 * spread] as const,
    delay: 0.28 + i * 0.155,
    dur: 1.35,
  };
});

/**
 * Four painted variants per kind is enough that the eye stops finding
 * repeats, and cheap enough to build on the main thread at load.
 */
function useSkewerParts(maxAniso: number) {
  return useMemo(() => {
    const stickGeo = new THREE.CylinderGeometry(0.0105, 0.008, 1.46, 10);
    const stickMat = new THREE.MeshStandardMaterial({
      color: "#7a5f34", roughness: 0.88, metalness: 0, envMapIntensity: 0.25,
    });

    const cache = new Map<string, THREE.MeshStandardMaterial>();
    const material = (kind: MeatKind, seed: number) => {
      const key = `${kind}:${seed % 4}`;
      let base = cache.get(key);
      if (!base) {
        const t = meatSurface(kind, seed);
        const tex = (cv: HTMLCanvasElement, srgb: boolean) => {
          const tx = new THREE.CanvasTexture(cv);
          tx.anisotropy = maxAniso;
          if (srgb) tx.colorSpace = THREE.SRGBColorSpace;
          return tx;
        };
        base = new THREE.MeshStandardMaterial({
          map: tex(t.alb, true),
          roughnessMap: tex(t.rgh, false),
          bumpMap: tex(t.bmp, false),
          bumpScale: 0.06,
          roughness: 1,
          metalness: 0,
          envMapIntensity: 0.55,
        });
        cache.set(key, base);
      }
      // one shared painted surface, tinted per chunk so four cubes on a
      // skewer are not the same cube four times
      const m = base.clone();
      m.color.setScalar(0.86 + ((seed * 37) % 13) / 13 * 0.26);
      return m;
    };

    const chunks = KINDS.map((kind, s) =>
      Array.from({ length: 4 }, (_, i) => {
        const seed = (s + 1) * 4 + i;
        return {
          geo: meatGeometry(0.104 + ((seed * 29) % 7) / 7 * 0.016, seed),
          mat: material(kind, seed),
          x: -0.405 + i * 0.27,
          rot: [(seed % 7) * 0.9, (seed % 5) * 1.3, (seed % 3) * 0.7] as const,
        };
      }),
    );
    return { stickGeo, stickMat, chunks };
  }, [maxAniso]);
}

export function HeroModel() {
  const group = useRef<THREE.Group>(null);
  const pieceRefs = useRef<(THREE.Group | null)[]>([]);
  const skewerRefs = useRef<(THREE.Group | null)[]>([]);
  const bench = useRef<THREE.Mesh>(null);
  const maxAniso = useThree((state) => state.gl.capabilities.getMaxAnisotropy());
  const parts = useSkewerParts(maxAniso);

  const geometries = useMemo(
    () => ({
      plate: vesselGeometry(PLATE_PROFILE),
      bowl: vesselGeometry(BOWL_PROFILE),
      pot: vesselGeometry(POT_PROFILE),
      side: vesselGeometry(PLATE_PROFILE, 72),
    }),
    [],
  );

  const materials = useMemo(
    () => ({
      plate: glazeMaterial(GLAZE.plate),
      bowl: glazeMaterial(GLAZE.bowl),
      pot: steelMaterial(),
      side: glazeMaterial(GLAZE.side),
      broth: brothMaterial("#4a2f18"),
      soup: brothMaterial("#b98a34"),
      bench: new THREE.MeshStandardMaterial({ color: "#ded0b0", roughness: 0.95 }),
    }),
    [],
  );

  useFrame((frameState) => {
    const g = group.current;
    if (!g) return;
    const elapsed = frameState.clock.getElapsedTime();
    const { model } = resolveStory(storyState.progress, storyState.isMobile);

    g.position.set(...model.position);
    g.rotation.set(...model.rotation);
    g.scale.setScalar(model.scale);

    const spread = model.spread;

    PIECES.forEach((piece, i) => {
      const node = pieceRefs.current[i];
      if (!node) return;
      node.position.set(
        THREE.MathUtils.lerp(piece.stacked[0], piece.table[0], spread),
        THREE.MathUtils.lerp(piece.stacked[1], piece.table[1], spread),
        THREE.MathUtils.lerp(piece.stacked[2], piece.table[2], spread),
      );
      node.scale.setScalar(THREE.MathUtils.lerp(piece.stackedScale, piece.tableScale, spread));
      node.visible = piece.kind === "plate" || spread > 0.02;
    });

    // The flight: each skewer arcs in on its own delay, then settles.
    FLIGHT.forEach((f, i) => {
      const node = skewerRefs.current[i];
      if (!node) return;
      const t = storyState.reducedMotion ? 1 : clamp01((elapsed - f.delay) / f.dur);
      const e = easeOutQuint(t);
      const u = 1 - e;
      const settle =
        t >= 1 && !storyState.reducedMotion
          ? Math.exp(-(elapsed - f.delay - f.dur) * 5) * Math.sin((elapsed - f.delay - f.dur) * 22) * 0.012
          : 0;
      const idle = t >= 1 && !storyState.reducedMotion ? Math.sin(elapsed * 0.9 + i) * 0.006 : 0;
      node.position.set(
        u * u * f.from[0] + 2 * u * e * f.ctrl[0] + e * e * f.to[0],
        u * u * f.from[1] + 2 * u * e * f.ctrl[1] + e * e * f.to[1] + settle + idle,
        u * u * f.from[2] + 2 * u * e * f.ctrl[2] + e * e * f.to[2],
      );
      node.rotation.set(
        THREE.MathUtils.lerp(f.rotFrom[0], f.rotTo[0], e),
        THREE.MathUtils.lerp(f.rotFrom[1], f.rotTo[1], e),
        THREE.MathUtils.lerp(f.rotFrom[2], f.rotTo[2], e),
      );
      node.visible = t > 0;
    });
  });

  return (
    <group ref={group} dispose={null}>
      {/* the pass the plate rests on, kept close to the page ground */}
      <mesh ref={bench} position={[0, -0.055, 0]} material={materials.bench} receiveShadow>
        <cylinderGeometry args={[9, 9, 0.05, 80]} />
      </mesh>

      {PIECES.map((piece, i) => (
        <group
          key={piece.kind}
          ref={(el) => {
            pieceRefs.current[i] = el;
          }}
        >
          <mesh geometry={geometries[piece.kind]} material={materials[piece.kind]} castShadow receiveShadow />
          {piece.kind === "bowl" && (
            <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.broth}>
              <circleGeometry args={[0.6, 48]} />
            </mesh>
          )}
          {piece.kind === "pot" && (
            <>
              <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.soup}>
                <circleGeometry args={[0.74, 48]} />
              </mesh>
              <mesh position={[0, -0.06, 0]} material={materials.pot}>
                <cylinderGeometry args={[0.5, 0.62, 0.12, 40]} />
              </mesh>
            </>
          )}
        </group>
      ))}

      {/* the skewers themselves, parented to the plate's frame */}
      {FLIGHT.map((_, s) => (
        <group
          key={s}
          ref={(el) => {
            skewerRefs.current[s] = el;
          }}
        >
          <mesh
            geometry={parts.stickGeo}
            material={parts.stickMat}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          />
          {parts.chunks[s].map((c, i) => (
            <mesh
              key={i}
              geometry={c.geo}
              material={c.mat}
              position={[c.x, 0, 0]}
              scale={[1.06, 0.92, 1]}
              rotation={[c.rot[0], c.rot[1], c.rot[2]]}
              castShadow
              receiveShadow
            />
          ))}
        </group>
      ))}
    </group>
  );
}
