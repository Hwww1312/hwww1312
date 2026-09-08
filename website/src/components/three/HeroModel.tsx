"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { DISHES } from "@/data/siteContent";
import { storyRuntime } from "@/lib/animation/storyRuntime";

const DISH_PATHS = DISHES.map((d) => `/assets/${d.slug}.jpg`);

/**
 * PLACEHOLDER HERO OBJECT
 * Procedural ceramic plate + food disc textured with real restaurant photos.
 * Replace with a production GLB when available — see docs/ASSET_REPLACEMENT.md.
 * Do not treat this mesh as finished product design.
 */
export function HeroModel() {
  const group = useRef<THREE.Group>(null);
  const foodMat = useRef<THREE.MeshStandardMaterial>(null);
  const moundMat = useRef<THREE.MeshStandardMaterial>(null);
  const lidGroup = useRef<THREE.Group>(null);
  const steamGroup = useRef<THREE.Group>(null);

  const textures = useTexture(DISH_PATHS);
  const textureList = useMemo(
    () => (Array.isArray(textures) ? textures : [textures]),
    [textures],
  );

  useMemo(() => {
    textureList.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = 8;
    });
  }, [textureList]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;

    const s = storyRuntime.state;
    const idle = storyRuntime.reducedMotion
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.55) * 0.02;

    g.position.set(
      s.modelPosition[0],
      s.modelPosition[1] + idle,
      s.modelPosition[2],
    );
    g.rotation.set(
      s.modelRotation[0],
      s.modelRotation[1] +
        (storyRuntime.reducedMotion ? 0 : state.clock.elapsedTime * 0.04),
      s.modelRotation[2],
    );
    g.scale.setScalar(s.modelScale);

    const idx = Math.min(
      Math.max(0, Math.round(s.dishIndex)),
      textureList.length - 1,
    );
    const map = textureList[idx];
    if (foodMat.current && foodMat.current.map !== map) {
      foodMat.current.map = map;
      foodMat.current.needsUpdate = true;
    }
    if (moundMat.current && moundMat.current.map !== map) {
      moundMat.current.map = map;
      moundMat.current.needsUpdate = true;
    }

    if (lidGroup.current) {
      lidGroup.current.visible = s.lidOpen > 0.02;
      lidGroup.current.position.y = s.lidOpen * 0.55;
      lidGroup.current.rotation.x = -s.lidOpen * 0.55;
      lidGroup.current.rotation.z = s.lidOpen * 0.25;
    }

    if (steamGroup.current) {
      steamGroup.current.visible = s.steam > 0.05;
      steamGroup.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const t = state.clock.elapsedTime * (0.4 + i * 0.08) + i;
        mesh.position.y = 0.35 + ((t * 0.25) % 0.9);
        mesh.position.x = Math.sin(t + i) * 0.12;
        mesh.position.z = Math.cos(t * 0.8 + i) * 0.12;
        mat.opacity = Math.max(0, s.steam * (0.35 - mesh.position.y * 0.2));
      });
    }
  });

  return (
    <group ref={group} dispose={null}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.05, 1.15, 0.08, 64]} />
        <meshStandardMaterial
          color="#e8e2d4"
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.82, 1.02, 64]} />
        <meshStandardMaterial
          color="#d9d2c1"
          roughness={0.4}
          metalness={0.02}
        />
      </mesh>

      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <circleGeometry args={[0.78, 64]} />
        <meshStandardMaterial
          ref={foodMat}
          map={textureList[0]}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      <mesh position={[0, 0.14, 0]} castShadow>
        <sphereGeometry
          args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]}
        />
        <meshStandardMaterial
          ref={moundMat}
          map={textureList[0]}
          roughness={0.85}
          metalness={0}
          transparent
          opacity={0.55}
        />
      </mesh>

      <group ref={lidGroup} visible={false}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <sphereGeometry
            args={[0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]}
          />
          <meshStandardMaterial
            color="#2a3d36"
            roughness={0.45}
            metalness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.72, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#c8dc4b"
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
      </group>

      <group ref={steamGroup} visible={false}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.08 + (i % 3) * 0.02, 12, 12]} />
            <meshBasicMaterial
              color="#f1ede1"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.12, 64]} />
        <meshBasicMaterial color="#c8dc4b" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

export function HeroModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.2, 1]} />
      <meshStandardMaterial color="#123a31" />
    </mesh>
  );
}
