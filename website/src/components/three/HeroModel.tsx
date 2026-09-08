"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { DISHES } from "@/data/siteContent";
import { storyRuntime } from "@/lib/animation/storyRuntime";

const DISH_PATHS = DISHES.map((d) => `/assets/${d.slug}.jpg`);

function createPlateGeometry() {
  // Profile: center well → rise → outer rim (lathed around Y)
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(0, 0.02),
    new THREE.Vector2(0.55, 0.02),
    new THREE.Vector2(0.78, 0.03),
    new THREE.Vector2(0.95, 0.06),
    new THREE.Vector2(1.08, 0.09),
    new THREE.Vector2(1.14, 0.07),
    new THREE.Vector2(1.16, 0.02),
    new THREE.Vector2(1.14, 0),
    new THREE.Vector2(0.9, -0.01),
    new THREE.Vector2(0, -0.01),
  ];
  return new THREE.LatheGeometry(pts, 72);
}

/**
 * PLACEHOLDER HERO OBJECT — not finished product design.
 * Single lathed ceramic plate + food disc. Replace with GLB later.
 */
export function HeroModel() {
  const group = useRef<THREE.Group>(null);
  const foodMat = useRef<THREE.MeshStandardMaterial>(null);
  const lidGroup = useRef<THREE.Group>(null);
  const steamGroup = useRef<THREE.Group>(null);

  const plateGeo = useMemo(() => createPlateGeometry(), []);

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
      : Math.sin(state.clock.elapsedTime * 0.5) * 0.012;

    g.position.set(
      s.modelPosition[0],
      s.modelPosition[1] + idle,
      s.modelPosition[2],
    );
    g.rotation.set(
      s.modelRotation[0],
      s.modelRotation[1] +
        (storyRuntime.reducedMotion ? 0 : state.clock.elapsedTime * 0.06),
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

    if (lidGroup.current) {
      const open = s.lidOpen;
      lidGroup.current.visible = open > 0.04;
      lidGroup.current.position.set(
        open * 0.4,
        0.08 + open * 0.75,
        open * -0.2,
      );
      lidGroup.current.rotation.set(-open * 1.05, open * 0.35, open * 0.15);
    }

    if (steamGroup.current) {
      steamGroup.current.visible = s.steam > 0.08;
      steamGroup.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        const t = state.clock.elapsedTime * (0.35 + i * 0.06) + i;
        mesh.position.y = 0.15 + ((t * 0.22) % 0.85);
        mesh.position.x = Math.sin(t + i) * 0.1;
        mesh.position.z = Math.cos(t * 0.7 + i) * 0.1;
        const fade = Math.max(0, 1 - mesh.position.y / 1.05);
        mat.opacity = s.steam * 0.3 * fade;
      });
    }
  });

  return (
    <group ref={group} dispose={null}>
      <mesh geometry={plateGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color="#efe8d8"
          roughness={0.28}
          metalness={0.06}
        />
      </mesh>

      {/* Food photograph sits in the well */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <circleGeometry args={[0.86, 72]} />
        <meshStandardMaterial
          ref={foodMat}
          map={textureList[0]}
          roughness={0.72}
          metalness={0.02}
        />
      </mesh>

      <group ref={lidGroup} visible={false}>
        <mesh castShadow>
          <sphereGeometry
            args={[0.62, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]}
          />
          <meshStandardMaterial
            color="#243832"
            roughness={0.42}
            metalness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0.34, 0]} castShadow>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial
            color="#c8dc4b"
            roughness={0.35}
            metalness={0.25}
          />
        </mesh>
      </group>

      <group ref={steamGroup} visible={false}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.065 + (i % 3) * 0.012, 10, 10]} />
            <meshBasicMaterial
              color="#f1ede1"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function HeroModelFallback() {
  return (
    <mesh>
      <cylinderGeometry args={[1, 1, 0.06, 48]} />
      <meshStandardMaterial color="#123a31" />
    </mesh>
  );
}
