import * as THREE from "three";

/**
 * Procedural tableware.
 *
 * There is no scanned model of a plate of lok lak, and an image-to-mesh
 * service would produce a lumpy approximation. Instead the service pieces are
 * lathed from real profiles, which gives clean silhouettes, correct normals
 * and a glaze that actually reflects the key light. The food itself is the
 * restaurant's own photograph, mapped onto a shallow dome so it reads with
 * volume rather than as a sticker.
 */

/** Lathe a vessel from a 2D profile expressed as [radius, height] pairs. */
export function vesselGeometry(
  profile: readonly (readonly [number, number])[],
  segments = 96,
): THREE.LatheGeometry {
  const geo = new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
  geo.computeVertexNormals();
  return geo;
}

/** A wide, shallow dinner plate with a rolled rim. */
export const PLATE_PROFILE = [
  [0.0, 0.0], [0.62, 0.004], [0.78, 0.035], [0.94, 0.105], [1.0, 0.15],
  [1.02, 0.168], [0.99, 0.176], [0.92, 0.14], [0.75, 0.062], [0.6, 0.028], [0.0, 0.022],
] as const;

/** A deeper noodle bowl. */
export const BOWL_PROFILE = [
  [0.0, 0.0], [0.3, 0.012], [0.52, 0.09], [0.66, 0.24], [0.72, 0.4],
  [0.74, 0.46], [0.71, 0.468], [0.63, 0.4], [0.49, 0.235], [0.27, 0.05], [0.0, 0.03],
] as const;

/** The steamboat pot: straighter walls, wider mouth. */
export const POT_PROFILE = [
  [0.0, 0.0], [0.5, 0.01], [0.76, 0.06], [0.84, 0.2], [0.86, 0.42],
  [0.9, 0.47], [0.86, 0.485], [0.82, 0.44], [0.8, 0.2], [0.72, 0.075], [0.0, 0.045],
] as const;

/**
 * A shallow spherical cap for the food, re-UV'd with a planar top-down
 * projection so a photograph maps across it without pinching at the pole.
 */
export function foodDomeGeometry(radius: number, rise: number): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.42);
  geo.scale(radius, rise, radius);

  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i += 1) {
    uv.setXY(i, pos.getX(i) / (radius * 2) + 0.5, pos.getZ(i) / (radius * 2) + 0.5);
  }
  uv.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/** Glazed ceramic. Clearcoat is what sells it as tableware rather than clay. */
export function glazeMaterial(color: THREE.ColorRepresentation) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.32,
    metalness: 0.0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.22,
  });
}

/** Brushed steel for the steamboat pot and burner. */
export function steelMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#b9c2be",
    roughness: 0.28,
    metalness: 0.95,
    clearcoat: 0.2,
  });
}
