"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * The reflection environment is built from light shapes rather than an HDRI
 * download: no third-party CDN at runtime, and the highlights across the glaze
 * are art-directed to match the page rather than borrowed from a studio map.
 * Tuned for the cream ground, so the crockery reflects a bright room.
 */
export function StoryEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={["#f2e7d3"]} />
      {/* Broad overhead softbox: daylight across the table. */}
      <Lightformer intensity={2.6} position={[0, 5, 1]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 7, 1]} color="#fffaf0" />
      {/* Warm bounce off the timber tabletop. */}
      <Lightformer intensity={1.3} position={[0, -2.4, 2]} rotation={[-Math.PI / 2, 0, 0]} scale={[8, 5, 1]} color="#e0c89e" />
      {/* Cool window light from the side, so the glaze has somewhere to look. */}
      <Lightformer intensity={1.4} position={[-4.6, 1.4, -2.6]} rotation={[0, Math.PI / 2, 0]} scale={[5, 4, 1]} color="#dfeee6" />
      <Lightformer intensity={0.9} position={[4.6, 1.6, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[4, 3, 1]} color="#f6ead6" />
    </Environment>
  );
}
