import * as THREE from "three";

/**
 * Procedural tableware and grilled skewers.
 *
 * Nothing on this page is photographic. The service pieces are lathed from
 * real ceramic profiles and the food is modelled, so the restaurant's own
 * Google photographs are not reproduced anywhere on the site.
 */

/** Lathe a vessel from a 2D profile expressed as [radius, height] pairs. */
export function vesselGeometry(
  profile: readonly (readonly [number, number])[],
  segments = 84,
): THREE.LatheGeometry {
  const geo = new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
  geo.computeVertexNormals();
  return geo;
}

export const PLATE_PROFILE = [
  [0.0, 0.0], [0.62, 0.004], [0.78, 0.035], [0.94, 0.105], [1.0, 0.15],
  [1.02, 0.168], [0.99, 0.176], [0.92, 0.14], [0.75, 0.062], [0.6, 0.028], [0.0, 0.022],
] as const;

export const BOWL_PROFILE = [
  [0.0, 0.0], [0.3, 0.012], [0.52, 0.09], [0.66, 0.24], [0.72, 0.4],
  [0.74, 0.46], [0.71, 0.468], [0.63, 0.4], [0.49, 0.235], [0.27, 0.05], [0.0, 0.03],
] as const;

export const POT_PROFILE = [
  [0.0, 0.0], [0.5, 0.01], [0.76, 0.06], [0.84, 0.2], [0.86, 0.42],
  [0.9, 0.47], [0.86, 0.485], [0.82, 0.44], [0.8, 0.2], [0.72, 0.075], [0.0, 0.045],
] as const;

/** Celadon, so the crockery holds against the warm cream page. */
export const GLAZE = { plate: "#86a08f", bowl: "#769384", side: "#8ea89a" } as const;

export function glazeMaterial(color: THREE.ColorRepresentation) {
  return new THREE.MeshPhysicalMaterial({
    color, roughness: 0.38, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.42,
  });
}

export function steelMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: "#b9c2be", roughness: 0.28, metalness: 0.95, clearcoat: 0.2,
  });
}

/** A still broth surface for the bowl and the steamboat. */
export function brothMaterial(color: THREE.ColorRepresentation) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.24, metalness: 0.05 });
}
