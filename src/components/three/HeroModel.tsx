"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  BOWL_PROFILE, PLATE_PROFILE, POT_PROFILE,
  foodDomeGeometry, glazeMaterial, steelMaterial, vesselGeometry,
} from "@/lib/three/ceramics";
import { resolveStory, storyState } from "@/lib/story/state";

/**
 * The hero object: one plate that opens into a table setting.
 *
 * At `spread = 0` the four service pieces are stacked into a single silhouette.
 * At `spread = 1` they lay out as a shared table. That is the Chapter 04
 * transformation, and it is a real change in the scene graph rather than a
 * camera trick, which is why it reads the same scrolling in either direction.
 */

type PieceKind = "plate" | "bowl" | "pot" | "side";

interface Piece {
  kind: PieceKind;
  dish: string;
  /** Where it sits when the pieces are stacked as one object. */
  stacked: [number, number, number];
  /** Where it sits once the table is laid. */
  table: [number, number, number];
  stackedScale: number;
  tableScale: number;
  foodRadius: number;
  foodRise: number;
  foodY: number;
}

const PIECES: Piece[] = [
  {
    kind: "plate", dish: "lok-lak",
    stacked: [0, 0, 0], table: [0, 0, 0.45],
    stackedScale: 1, tableScale: 1,
    foodRadius: 0.66, foodRise: 0.2, foodY: 0.03,
  },
  {
    kind: "bowl", dish: "beef-noodle",
    stacked: [0, -0.12, 0], table: [-1.5, 0, -0.1],
    stackedScale: 0.55, tableScale: 1,
    foodRadius: 0.5, foodRise: 0.1, foodY: 0.3,
  },
  {
    kind: "pot", dish: "hotpot",
    stacked: [0, -0.16, 0], table: [1.42, 0, -0.42],
    stackedScale: 0.5, tableScale: 1.05,
    foodRadius: 0.66, foodRise: 0.08, foodY: 0.36,
  },
  {
    kind: "side", dish: "skewers",
    stacked: [0, -0.08, 0], table: [-0.05, 0, -1.5],
    stackedScale: 0.5, tableScale: 0.78,
    foodRadius: 0.6, foodRise: 0.14, foodY: 0.03,
  },
];

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Centre-crop a rectangular photograph into the dome's square UV space. */
function useDishTextures() {
  const urls = useMemo(() => PIECES.map((p) => `/images/dishes/${p.dish}.jpg`), []);
  const textures = useTexture(urls);
  return useMemo(() => {
    const list = Array.isArray(textures) ? textures : [textures];
    list.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      const img = t.image as { width: number; height: number } | undefined;
      if (img?.width && img?.height) {
        const aspect = img.width / img.height;
        if (aspect > 1) {
          t.repeat.set(1 / aspect, 1);
          t.offset.set((1 - 1 / aspect) / 2, 0);
        } else {
          t.repeat.set(1, aspect);
          t.offset.set(0, (1 - aspect) / 2);
        }
      }
      t.needsUpdate = true;
    });
    return list;
  }, [textures]);
}

export function HeroModel() {
  const group = useRef<THREE.Group>(null);
  const pieceRefs = useRef<(THREE.Group | null)[]>([]);
  const textures = useDishTextures();

  const geometries = useMemo(
    () => ({
      plate: vesselGeometry(PLATE_PROFILE),
      bowl: vesselGeometry(BOWL_PROFILE),
      pot: vesselGeometry(POT_PROFILE),
      side: vesselGeometry(PLATE_PROFILE, 72),
      food: PIECES.map((p) => foodDomeGeometry(p.foodRadius, p.foodRise)),
    }),
    [],
  );

  const materials = useMemo(
    () => ({
      plate: glazeMaterial("#efe9dc"),
      bowl: glazeMaterial("#e9e3d4"),
      pot: steelMaterial(),
      side: glazeMaterial("#e6dfd0"),
    }),
    [],
  );

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const { model } = resolveStory(storyState.progress, storyState.isMobile);

    g.position.set(...model.position);
    g.rotation.set(...model.rotation);
    g.scale.setScalar(model.scale);

    // A slow idle drift keeps the object alive during the opening hold.
    if (!storyState.reducedMotion) {
      g.rotation.y += Math.sin(performance.now() * 0.00016) * delta * 0.035;
    }

    PIECES.forEach((piece, i) => {
      const node = pieceRefs.current[i];
      if (!node) return;
      const s = model.spread;
      node.position.set(
        THREE.MathUtils.lerp(piece.stacked[0], piece.table[0], s),
        THREE.MathUtils.lerp(piece.stacked[1], piece.table[1], s),
        THREE.MathUtils.lerp(piece.stacked[2], piece.table[2], s),
      );
      node.scale.setScalar(THREE.MathUtils.lerp(piece.stackedScale, piece.tableScale, s));
      // The plate is always present; the rest resolve out of it.
      node.visible = piece.kind === "plate" || s > 0.02;
    });
  });

  return (
    <group ref={group} dispose={null}>
      {PIECES.map((piece, i) => (
        <group
          key={piece.kind}
          ref={(el) => {
            pieceRefs.current[i] = el;
          }}
        >
          <mesh
            geometry={geometries[piece.kind]}
            material={materials[piece.kind]}
            castShadow
            receiveShadow
          />
          <mesh geometry={geometries.food[i]} position={[0, piece.foodY, 0]}>
            <meshStandardMaterial
              map={textures[i]}
              roughness={0.62}
              metalness={0.02}
            />
          </mesh>
          {piece.kind === "pot" && (
            // Burner beneath the steamboat, so the pot is not floating.
            <mesh position={[0, -0.06, 0]} material={materials.pot}>
              <cylinderGeometry args={[0.5, 0.62, 0.12, 48]} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

/** Preload so the first painted frame already has the food on the plate. */
HeroModel.preloadUrls = PIECES.map((p) => `/images/dishes/${p.dish}.jpg`);
export { smoothstep };
