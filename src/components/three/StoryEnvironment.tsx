"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * The reflection environment is built from light shapes rather than an HDRI
 * download: no third-party CDN at runtime, and the highlights across the glaze
 * are art-directed to match the brand rather than borrowed from a studio map.
 */
export function StoryEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#05140f"]} />
      {/* Broad overhead softbox: the pendant above the table. */}
      <Lightformer intensity={3.2} position={[0, 5, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[9, 6, 1]} color="#fff3e2" />
      {/* Warm bounce off the timber tabletop. */}
      <Lightformer intensity={1.1} position={[0, -2.4, 2]} rotation={[-Math.PI / 2, 0, 0]} scale={[8, 5, 1]} color="#c9a071" />
      {/* Lemongrass edge that traces the rim. */}
      <Lightformer intensity={1.9} position={[-4.5, 1.2, -3]} rotation={[0, Math.PI / 2, 0]} scale={[5, 4, 1]} color="#c8dc4b" />
      <Lightformer intensity={0.8} position={[4.6, 1.6, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[4, 3, 1]} color="#9fd8c2" />
    </Environment>
  );
}
