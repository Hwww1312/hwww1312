import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { brothMaps, glazeBump, rng } from "./textures";

/**
 * The dish, modelled from scratch.
 *
 * A Cambodian fish curry noodle bowl: a thrown ceramic bowl, a golden curry
 * with fat rendered out across the surface, a nest of rice noodles, and the
 * raw garnishes plated over the top — green beans, bean sprouts, cucumber,
 * coriander, chilli and lime.
 *
 * Nothing here is a photograph or a downloaded asset. Every surface is
 * generated geometry with a runtime-drawn texture, which is what keeps the
 * page free of both third-party requests and the restaurant's own listing
 * imagery.
 *
 * Scale: the bowl has an outer radius of 1 and a rim at y = 0.67, so one unit
 * is roughly eleven centimetres. Garnish sizes below are readable against
 * that — a coriander leaf at 0.12 is about thirteen millimetres.
 */

export type Vec3 = [number, number, number];

const TAU = Math.PI * 2;

/* ------------------------------------------------------------------ *
 * Primitives
 * ------------------------------------------------------------------ */

/**
 * Lathe a vessel from a 2D profile of [radius, height] pairs.
 *
 * The profile is traversed as one loop — out along the underside, up the
 * outside, over the rim and back down the inside — so a single mesh carries
 * both faces of the bowl with normals pointing the right way on each.
 */
export function latheFrom(
  profile: readonly (readonly [number, number])[],
  segments: number,
): THREE.LatheGeometry {
  // The normals LatheGeometry generates are kept as they are. Recomputing
  // them from face winding tears the closing seam open, which shows up as a
  // notch in the rim exactly where the revolution meets itself.
  return new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
}

/**
 * A noodle bowl, not a soup plate: deep enough that the curry sits well down
 * inside it and the inner wall carries a shadow, which is what gives the dish
 * its depth from a three-quarter angle.
 */
export const BOWL_PROFILE = [
  [0.0, 0.0],
  [0.24, 0.0],
  [0.3, 0.014],
  [0.315, 0.07],
  [0.38, 0.125],
  [0.52, 0.235],
  [0.66, 0.385],
  [0.8, 0.545],
  [0.92, 0.7],
  [0.985, 0.815],
  [1.0, 0.86],
  [0.992, 0.882],
  [0.952, 0.872],
  [0.905, 0.8],
  [0.815, 0.66],
  [0.7, 0.52],
  [0.56, 0.38],
  [0.42, 0.25],
  [0.31, 0.14],
  [0.255, 0.1],
  [0.0, 0.092],
] as const;

/** Where the curry sits. Everything plated on it is placed against this. */
export const SURFACE = 0.605;
/** The radius of the curry at that height, just shy of the bowl wall. */
export const SURFACE_RADIUS = 0.755;

/**
 * The surface of the curry: a very shallow parabolic dome rather than a disc,
 * so the key light travels across it as a moving highlight instead of
 * flipping on and off as the camera crosses the specular angle.
 *
 * Traversed outside-in, which is what puts the normals on top.
 */
export function brothCap(radius: number, sag: number, rings = 16, segments: number) {
  const profile: [number, number][] = [];
  for (let i = rings; i >= 0; i -= 1) {
    const t = i / rings;
    profile.push([radius * t, sag * (1 - t * t)]);
  }
  const geo = latheFrom(profile, segments);

  // A lathe lays its UVs out in polar coordinates, which turns the mottling
  // in the curry into a set of concentric rings and a seam. Re-project them
  // flat from above instead: the surface is nearly horizontal, so a planar
  // map from the XZ plane is both correct and free of any seam.
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i += 1) {
    uv.setXY(i, pos.getX(i) / (radius * 2) + 0.5, pos.getZ(i) / (radius * 2) + 0.5);
  }
  uv.needsUpdate = true;
  return geo;
}

/**
 * A tube of varying radius swept along a curve — the one primitive three does
 * not ship. Noodles, sprouts, beans, stems and chillies are all this.
 *
 * The radius is always taken to zero at both ends unless the caller asks for
 * caps, so an open tube never shows its hollow interior.
 */
export function taperedTube(
  curve: THREE.Curve<THREE.Vector3>,
  radiusAt: (t: number) => number,
  tubular: number,
  radial: number,
  capped = false,
): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(tubular, false);
  const position: number[] = [];
  const normal: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  const P = new THREE.Vector3();

  const taper = (t: number) => {
    if (capped) return 1;
    const edge = 0.05;
    return Math.sqrt(Math.min(1, t / edge) * Math.min(1, (1 - t) / edge));
  };

  for (let i = 0; i <= tubular; i += 1) {
    const t = i / tubular;
    curve.getPointAt(t, P);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const r = radiusAt(t) * taper(t);
    for (let j = 0; j <= radial; j += 1) {
      const v = (j / radial) * TAU;
      const sin = Math.sin(v);
      const cos = -Math.cos(v);
      const nx = cos * N.x + sin * B.x;
      const ny = cos * N.y + sin * B.y;
      const nz = cos * N.z + sin * B.z;
      normal.push(nx, ny, nz);
      position.push(P.x + r * nx, P.y + r * ny, P.z + r * nz);
      uv.push(t, j / radial);
    }
  }

  for (let i = 1; i <= tubular; i += 1) {
    for (let j = 1; j <= radial; j += 1) {
      const a = (radial + 1) * (i - 1) + (j - 1);
      const b = (radial + 1) * i + (j - 1);
      const c = (radial + 1) * i + j;
      const d = (radial + 1) * (i - 1) + j;
      index.push(a, b, d, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normal, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(index);

  if (!capped) return geo;

  // Cut ends read as cut ends: a hemisphere the width of the tube, which is
  // what a snapped green bean or a sliced sprout actually looks like.
  const parts = [geo];
  for (const t of [0, 1]) {
    const cap = new THREE.SphereGeometry(radiusAt(t), 10, 6);
    curve.getPointAt(t, P);
    cap.translate(P.x, P.y, P.z);
    parts.push(cap);
  }
  const merged = mergeGeometries(parts, false);
  parts.forEach((part) => part !== merged && part.dispose());
  return merged ?? geo;
}

/** A coriander leaf: three soft lobes, cupped rather than flat. */
export function leafGeometry(length: number, segments: number): THREE.BufferGeometry {
  const w = length * 0.44;
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(w * 0.9, length * 0.12, w * 1.35, length * 0.42, w, length * 0.71);
  s.bezierCurveTo(w * 0.82, length * 0.88, w * 0.36, length * 0.83, 0, length);
  s.bezierCurveTo(-w * 0.36, length * 0.83, -w * 0.82, length * 0.88, -w, length * 0.71);
  s.bezierCurveTo(-w * 1.35, length * 0.42, -w * 0.9, length * 0.12, 0, 0);

  const geo = new THREE.ShapeGeometry(s, segments);
  // Cup the leaf around its own midrib, then lay it flat into the XZ plane.
  // Kept shallow: a deep cup at this size reads as a pea pod, not a leaf.
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, -(x * x * 2.6 + (y - length * 0.5) * (y - length * 0.5) * 0.5));
  }
  geo.rotateX(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

/** A lime wedge, cut face out: a circular sector given a little thickness. */
export function limeWedge(radius: number, angle: number, thickness: number) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.absarc(0, 0, radius, -angle / 2, angle / 2, false);
  s.lineTo(0, 0);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.22,
    bevelSize: radius * 0.055,
    bevelSegments: 2,
    curveSegments: 14,
  });
  geo.translate(0, 0, -thickness / 2);
  geo.computeVertexNormals();
  return geo;
}

/* ------------------------------------------------------------------ *
 * Plating
 * ------------------------------------------------------------------ */

interface Placed {
  geo: THREE.BufferGeometry;
  pos: Vec3;
  rot?: Vec3;
  scale?: number | Vec3;
}

/** Merge a set of placed pieces into one geometry, and one draw call. */
function bake(pieces: Placed[]): THREE.BufferGeometry {
  const m = new THREE.Matrix4();
  const e = new THREE.Euler();
  const q = new THREE.Quaternion();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  const copies = pieces.map((piece) => {
    const g = piece.geo.clone();
    e.set(...(piece.rot ?? [0, 0, 0]));
    q.setFromEuler(e);
    p.set(...piece.pos);
    if (typeof piece.scale === "number") s.setScalar(piece.scale);
    else if (piece.scale) s.set(...piece.scale);
    else s.setScalar(1);
    m.compose(p, q, s);
    g.applyMatrix4(m);
    return g;
  });
  const merged = mergeGeometries(copies, false);
  copies.forEach((c) => c !== merged && c.dispose());
  if (!merged) throw new Error("failed to merge dish geometry");
  return merged;
}

/** Polar helper: everything on the dish is placed by angle and radius. */
const at = (angle: number, radius: number, y: number): Vec3 => [
  Math.cos(angle) * radius,
  y,
  Math.sin(angle) * radius,
];

export type MaterialKey =
  | "ceramic"
  | "broth"
  | "noodle"
  | "bean"
  | "sprout"
  | "sproutHead"
  | "cucumber"
  | "cucumberSkin"
  | "herb"
  | "chilli"
  | "chilliStem"
  | "limeFlesh"
  | "limeRind"
  | "crisp"
  | "fish"
  | "fat";

/**
 * One cluster of the dish: a single merged geometry, a single material, and
 * the small move it makes when the dish separates in chapter 04.
 *
 * `drift` is where the cluster travels to at full separation. Every value is
 * deliberately small — this is a dish coming apart in the hand, not an
 * exploded parts diagram — and `delay` staggers the clusters so they lift one
 * after another rather than all at once.
 */
export interface Cluster {
  id: string;
  geometry: THREE.BufferGeometry;
  material: MaterialKey;
  drift: Vec3;
  /** Extra rotation at full separation, in radians. */
  spin: Vec3;
  /** 0 to 0.45: when in the separation this cluster starts moving. */
  delay: number;
  /** Phase offset for the idle drift, so nothing bobs in unison. */
  phase: number;
  castShadow: boolean;
}

export interface Dish {
  bowl: THREE.BufferGeometry;
  broth: THREE.BufferGeometry;
  clusters: Cluster[];
  dispose(): void;
}

/**
 * Build the whole dish.
 *
 * `detail` trades geometry for framerate: the low setting halves the noodle
 * count and drops every radial segment count, which is the difference between
 * a comfortable 60fps and a struggle on a mid-range phone.
 */
export function buildDish(detail: "high" | "low"): Dish {
  const hi = detail === "high";
  const random = rng(19871312);
  const seg = hi ? 96 : 52;
  const clusters: Cluster[] = [];

  const bowl = latheFrom(BOWL_PROFILE, seg);
  const broth = brothCap(SURFACE_RADIUS, 0.02, hi ? 20 : 10, seg);
  broth.translate(0, SURFACE - 0.01, 0);

  /**
   * The plating is a wheel. Each ingredient owns a sector of the bowl and is
   * scattered across it, which is how the dish is actually assembled — the
   * beans in one arc, the sprouts in the next — rather than tossed together.
   * Radii stay under 0.62 so nothing clips the inner wall as it rises.
   */
  const sector = (centre: number, spread: number, i: number, n: number) =>
    centre + (n === 1 ? 0 : (i / (n - 1) - 0.5) * 2 * spread) + (random() - 0.5) * 0.22;

  /* --- rice noodles: one nest, one draw call ---------------------- */
  const noodleCount = hi ? 26 : 13;
  const noodles: Placed[] = [];
  for (let i = 0; i < noodleCount; i += 1) {
    const a0 = random() * TAU;
    const arc = 1.6 + random() * 2.8;
    const rad = 0.17 + random() * 0.44;
    const wob = 0.04 + random() * 0.08;
    const freq = 1 + Math.floor(random() * 3);
    const phase = random() * TAU;
    const yBase = SURFACE + 0.004 + random() * 0.036;
    const pts: THREE.Vector3[] = [];
    const N = 8;
    for (let k = 0; k <= N; k += 1) {
      const t = k / N;
      const a = a0 + arc * t;
      const rr = rad + Math.sin(t * Math.PI * freq + phase) * wob;
      // Both ends sink into the curry, so the nest emerges from the broth
      // instead of hovering above it.
      const dip = Math.pow(Math.abs(t * 2 - 1), 2.4) * 0.07;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * rr,
          yBase + Math.sin(t * Math.PI * (freq + 1) + phase) * 0.018 - dip,
          Math.sin(a) * rr,
        ),
      );
    }
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.4);
    const r = 0.0145 + random() * 0.0045;
    noodles.push({
      geo: taperedTube(curve, () => r, hi ? 30 : 18, hi ? 7 : 5),
      pos: [0, 0, 0],
    });
  }
  clusters.push({
    id: "noodles",
    geometry: bake(noodles),
    material: "noodle",
    drift: [0, 0.09, 0.02],
    spin: [0, 0.1, 0],
    delay: 0,
    phase: 0.4,
    castShadow: true,
  });
  noodles.forEach((n) => n.geo.dispose());

  /* --- green beans ------------------------------------------------ */
  const beanGeo = (() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.085, 0, 0),
      new THREE.Vector3(-0.025, 0.01, 0.008),
      new THREE.Vector3(0.035, 0.01, -0.006),
      new THREE.Vector3(0.085, 0, 0),
    ]);
    return taperedTube(curve, () => 0.028, 12, hi ? 8 : 6, true);
  })();
  const beans: Placed[] = [];
  const beanCount = hi ? 6 : 4;
  for (let i = 0; i < beanCount; i += 1) {
    const a = sector(2.2, 0.62, i, beanCount);
    beans.push({
      geo: beanGeo,
      pos: at(a, 0.32 + random() * 0.29, SURFACE + 0.03 + random() * 0.02),
      rot: [random() * 0.4 - 0.2, a + 1.3 + random() * 0.7, random() * 0.3 - 0.15],
    });
  }
  clusters.push({
    id: "beans",
    geometry: bake(beans),
    material: "bean",
    drift: [-0.08, 0.15, -0.26],
    spin: [0.22, 0.3, 0.1],
    delay: 0.18,
    phase: 1.9,
    castShadow: true,
  });
  beanGeo.dispose();

  /* --- bean sprouts ----------------------------------------------- */
  const sproutGeo = (() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.075, 0, 0),
      new THREE.Vector3(-0.018, 0.015, 0.01),
      new THREE.Vector3(0.045, 0.01, 0.003),
      new THREE.Vector3(0.085, -0.005, -0.01),
    ]);
    return taperedTube(curve, (t) => 0.0115 - t * 0.003, 14, hi ? 7 : 5, true);
  })();
  const sprouts: Placed[] = [];
  const sproutHeads: Placed[] = [];
  const headGeo = new THREE.SphereGeometry(0.019, 10, 7);
  const sproutCount = hi ? 10 : 6;
  for (let i = 0; i < sproutCount; i += 1) {
    const a = sector(3.55, 0.8, i, sproutCount);
    const rr = 0.24 + random() * 0.36;
    const y = SURFACE + 0.028 + random() * 0.026;
    const rot: Vec3 = [random() * 0.5 - 0.25, a + 1.7 + random() * 0.9, random() * 0.4 - 0.2];
    sprouts.push({ geo: sproutGeo, pos: at(a, rr, y), rot });
    // The head sits at the tail of the sprout, wherever that ended up.
    const dir = new THREE.Vector3(-0.075, 0, 0).applyEuler(new THREE.Euler(...rot));
    const base = at(a, rr, y);
    sproutHeads.push({
      geo: headGeo,
      pos: [base[0] + dir.x, base[1] + dir.y, base[2] + dir.z],
      scale: [1, 0.82, 0.9],
    });
  }
  const sproutDrift: Vec3 = [-0.24, 0.17, 0.06];
  clusters.push({
    id: "sprouts",
    geometry: bake(sprouts),
    material: "sprout",
    drift: sproutDrift,
    spin: [0.1, -0.3, 0.16],
    delay: 0.1,
    phase: 3.1,
    castShadow: true,
  });
  clusters.push({
    id: "sprout-heads",
    geometry: bake(sproutHeads),
    material: "sproutHead",
    drift: sproutDrift,
    spin: [0.1, -0.3, 0.16],
    delay: 0.1,
    phase: 3.1,
    castShadow: false,
  });
  sproutGeo.dispose();
  headGeo.dispose();

  /* --- cucumber, cut as fine batons -------------------------------- */
  const baton = new THREE.BoxGeometry(0.19, 0.026, 0.03);
  const skin = new THREE.BoxGeometry(0.192, 0.008, 0.032);
  const cucumber: Placed[] = [];
  const cucumberSkin: Placed[] = [];
  const cucumberCount = hi ? 6 : 4;
  for (let i = 0; i < cucumberCount; i += 1) {
    const a = sector(4.75, 0.6, i, cucumberCount);
    const rr = 0.32 + random() * 0.29;
    const y = SURFACE + 0.026 + random() * 0.022;
    const rot: Vec3 = [random() * 0.3 - 0.15, a + 1.5 + random() * 0.6, random() * 0.25 - 0.12];
    cucumber.push({ geo: baton, pos: at(a, rr, y), rot });
    const up = new THREE.Vector3(0, 0.017, 0).applyEuler(new THREE.Euler(...rot));
    const base = at(a, rr, y);
    cucumberSkin.push({
      geo: skin,
      pos: [base[0] + up.x, base[1] + up.y, base[2] + up.z],
      rot,
    });
  }
  const cucumberDrift: Vec3 = [-0.3, 0.12, 0.16];
  clusters.push({
    id: "cucumber",
    geometry: bake(cucumber),
    material: "cucumber",
    drift: cucumberDrift,
    spin: [0.1, 0.24, -0.18],
    delay: 0.26,
    phase: 5.2,
    castShadow: true,
  });
  clusters.push({
    id: "cucumber-skin",
    geometry: bake(cucumberSkin),
    material: "cucumberSkin",
    drift: cucumberDrift,
    spin: [0.1, 0.24, -0.18],
    delay: 0.26,
    phase: 5.2,
    castShadow: false,
  });
  baton.dispose();
  skin.dispose();

  /* --- coriander, torn over the top -------------------------------- */
  const leafA = leafGeometry(0.105, hi ? 10 : 5);
  const leafB = leafGeometry(0.082, hi ? 10 : 5);
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.035, 0.006, 0.01),
    new THREE.Vector3(0.075, 0.003, 0.005),
  ]);
  const stem = taperedTube(stemCurve, () => 0.006, 8, 5, true);
  const herbs: Placed[] = [];
  const herbCount = hi ? 11 : 6;
  for (let i = 0; i < herbCount; i += 1) {
    // Herbs are the one thing scattered right across the bowl rather than
    // kept to a sector: they go on last, by hand, from above.
    const a = (i / herbCount) * TAU + (random() - 0.5) * 0.5;
    const rr = 0.12 + random() * 0.5;
    herbs.push({
      geo: i % 3 === 0 ? leafB : leafA,
      pos: at(a, rr, SURFACE + 0.036 + random() * 0.03),
      rot: [random() * 0.5 - 0.25, random() * TAU, random() * 0.5 - 0.25],
      scale: 0.82 + random() * 0.3,
    });
    if (i % 3 === 1) {
      herbs.push({
        geo: stem,
        pos: at(a + 0.25, rr * 0.85, SURFACE + 0.026 + random() * 0.016),
        rot: [0, random() * TAU, random() * 0.24 - 0.12],
      });
    }
  }
  clusters.push({
    id: "herbs",
    geometry: bake(herbs),
    material: "herb",
    drift: [0.04, 0.34, 0.06],
    spin: [0.2, 0.55, 0.2],
    delay: 0.06,
    phase: 0.9,
    castShadow: true,
  });
  leafA.dispose();
  leafB.dispose();
  stem.dispose();

  /* --- chilli: two whole, a few sliced ---------------------------- */
  const chilliCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.1, 0, 0),
    new THREE.Vector3(-0.032, 0.012, 0.016),
    new THREE.Vector3(0.042, 0.01, 0.008),
    new THREE.Vector3(0.11, -0.004, -0.016),
  ]);
  const chilliBody = taperedTube(
    chilliCurve,
    (t) => 0.026 * Math.pow(1 - t, 0.62) + 0.0015,
    16,
    hi ? 9 : 6,
  );
  const ring = new THREE.TorusGeometry(0.034, 0.011, hi ? 8 : 6, hi ? 14 : 9);
  const chilli: Placed[] = [
    { geo: chilliBody, pos: at(5.62, 0.42, SURFACE + 0.038), rot: [0.14, 0.8, 0.08] },
    { geo: chilliBody, pos: at(6.05, 0.3, SURFACE + 0.03), rot: [-0.08, 2.2, -0.12], scale: 0.86 },
  ];
  for (let i = 0; i < 5; i += 1) {
    const a = random() * TAU;
    chilli.push({
      geo: ring,
      pos: at(a, 0.18 + random() * 0.44, SURFACE + 0.022 + random() * 0.016),
      rot: [Math.PI / 2 + (random() * 0.45 - 0.22), random() * TAU, 0],
    });
  }
  const chilliStemGeo = taperedTube(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.026, 0.012, 0),
      new THREE.Vector3(0.048, 0.026, 0.003),
    ]),
    () => 0.0075,
    8,
    5,
    true,
  );
  clusters.push({
    id: "chilli",
    geometry: bake(chilli),
    material: "chilli",
    drift: [0.06, 0.11, 0.28],
    spin: [0.1, -0.4, 0.24],
    delay: 0.02,
    phase: 2.4,
    castShadow: true,
  });
  clusters.push({
    id: "chilli-stems",
    geometry: bake([
      {
        geo: chilliStemGeo,
        pos: at(5.62, 0.42, SURFACE + 0.038),
        rot: [0.14, 0.8 + Math.PI, 0.08],
      },
      {
        geo: chilliStemGeo,
        pos: at(6.05, 0.3, SURFACE + 0.03),
        rot: [-0.08, 2.2 + Math.PI, -0.12],
      },
    ]),
    material: "chilliStem",
    drift: [0.06, 0.11, 0.28],
    spin: [0.1, -0.4, 0.24],
    delay: 0.02,
    phase: 2.4,
    castShadow: false,
  });
  chilliBody.dispose();
  ring.dispose();
  chilliStemGeo.dispose();

  /* --- lime wedge, propped on the rim ------------------------------ */
  const wedge = limeWedge(0.155, 0.95, 0.06);
  // Resting against the garnish rather than propped on the rim: any higher
  // and the wedge breaks out through the inside of the bowl.
  const limePos = at(1.32, 0.44, SURFACE + 0.055);
  const limeRot: Vec3 = [0.62, 1.32 + Math.PI / 2, 0.34];
  const rind = new THREE.TorusGeometry(0.155, 0.018, 6, 16, 0.95);
  const limeDrift: Vec3 = [0.36, 0.08, 0.1];
  clusters.push({
    id: "lime",
    geometry: bake([{ geo: wedge, pos: limePos, rot: limeRot }]),
    material: "limeFlesh",
    drift: limeDrift,
    spin: [0.14, 0.42, 0.1],
    delay: 0.3,
    phase: 4.4,
    castShadow: true,
  });
  clusters.push({
    id: "lime-rind",
    geometry: bake([
      { geo: rind, pos: limePos, rot: [limeRot[0], limeRot[1], limeRot[2] - 0.475] },
    ]),
    material: "limeRind",
    drift: limeDrift,
    spin: [0.14, 0.42, 0.1],
    delay: 0.3,
    phase: 4.4,
    castShadow: false,
  });
  wedge.dispose();
  rind.dispose();

  /* --- fish, barely breaking the surface --------------------------- */
  const flakeGeo = new THREE.SphereGeometry(0.085, 12, 8);
  {
    const pos = flakeGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i += 1) {
      const j = 1 + (random() - 0.5) * 0.22;
      pos.setXYZ(i, pos.getX(i) * 1.35 * j, pos.getY(i) * 0.4, pos.getZ(i) * 0.85 * j);
    }
    flakeGeo.computeVertexNormals();
  }
  clusters.push({
    id: "fish",
    geometry: bake([
      { geo: flakeGeo, pos: at(3.05, 0.3, SURFACE + 0.012), rot: [0.1, 1.1, -0.06] },
      { geo: flakeGeo, pos: at(0.95, 0.46, SURFACE + 0.008), rot: [-0.08, 0.2, 0.1], scale: 0.82 },
    ]),
    material: "fish",
    drift: [0, 0.04, 0],
    spin: [0, 0.12, 0],
    delay: 0.34,
    phase: 1.2,
    castShadow: false,
  });
  flakeGeo.dispose();

  /* --- fried garlic and shallot ------------------------------------ */
  const crispGeo = new THREE.TetrahedronGeometry(0.017);
  const crisps: Placed[] = [];
  for (let i = 0; i < (hi ? 18 : 9); i += 1) {
    crisps.push({
      geo: crispGeo,
      pos: at(random() * TAU, random() * 0.68, SURFACE + 0.014 + random() * 0.03),
      rot: [random() * TAU, random() * TAU, random() * TAU],
      scale: [1.4, 0.4, 1.2],
    });
  }
  clusters.push({
    id: "crisp",
    geometry: bake(crisps),
    material: "crisp",
    drift: [0.1, 0.24, -0.06],
    spin: [0.4, 0.8, 0.3],
    delay: 0.12,
    phase: 6.1,
    castShadow: false,
  });
  crispGeo.dispose();

  /* --- pools of rendered fat on the broth --------------------------- */
  const dropGeo = new THREE.SphereGeometry(1, 10, 6);
  const drops: Placed[] = [];
  for (let i = 0; i < (hi ? 16 : 8); i += 1) {
    const r = 0.016 + random() * 0.032;
    const a = random() * TAU;
    const rr = random() * 0.71;
    const k = rr / SURFACE_RADIUS;
    drops.push({
      // Sat on the dome, so they follow its curve instead of floating.
      geo: dropGeo,
      pos: [Math.cos(a) * rr, SURFACE - 0.01 + 0.02 * (1 - k * k) - 0.012, Math.sin(a) * rr],
      scale: [r, r * 0.3, r * (0.8 + random() * 0.5)],
      rot: [0, random() * TAU, 0],
    });
  }
  clusters.push({
    id: "fat",
    geometry: bake(drops),
    material: "fat",
    drift: [0, 0, 0],
    spin: [0, 0, 0],
    delay: 0,
    phase: 0,
    castShadow: false,
  });
  dropGeo.dispose();

  return {
    bowl,
    broth,
    clusters,
    dispose() {
      bowl.dispose();
      broth.dispose();
      clusters.forEach((c) => c.geometry.dispose());
    },
  };
}

/* ------------------------------------------------------------------ *
 * Materials
 * ------------------------------------------------------------------ */

export interface DishMaterials extends Record<MaterialKey, THREE.Material> {
  dispose(): void;
}

/**
 * Physically based throughout, and tuned by roughness rather than by colour:
 * the curry is the only glossy thing in the bowl, the ceramic is a half-stop
 * behind it, and every raw vegetable is matte. That spread is what sells the
 * difference between cooked and uncooked under one warm key.
 */
export function dishMaterials(aniso: number): DishMaterials {
  const broth = brothMaps(aniso);
  const bump = glazeBump(aniso);

  const mats = {
    ceramic: new THREE.MeshPhysicalMaterial({
      color: "#e9e1d2",
      roughness: 0.34,
      metalness: 0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      bumpMap: bump,
      bumpScale: 0.0035,
      envMapIntensity: 0.95,
    }),
    broth: new THREE.MeshPhysicalMaterial({
      map: broth.map,
      roughnessMap: broth.roughnessMap,
      bumpMap: broth.bumpMap,
      bumpScale: 0.012,
      color: "#ffffff",
      roughness: 1,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.07,
      envMapIntensity: 1.35,
      // The broth is deep, not a painted sheet: a little forward scattering
      // stops the shadowed side going flat black.
      sheen: 0.35,
      sheenColor: new THREE.Color("#c9741a"),
      sheenRoughness: 0.6,
    }),
    noodle: new THREE.MeshPhysicalMaterial({
      color: "#f1e6cf",
      roughness: 0.4,
      metalness: 0,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4,
      sheen: 0.5,
      sheenColor: new THREE.Color("#fff4de"),
      envMapIntensity: 0.7,
    }),
    bean: new THREE.MeshPhysicalMaterial({
      color: "#4f7d33",
      roughness: 0.42,
      clearcoat: 0.4,
      clearcoatRoughness: 0.3,
      envMapIntensity: 0.75,
    }),
    sprout: new THREE.MeshPhysicalMaterial({
      color: "#efe9d8",
      roughness: 0.44,
      clearcoat: 0.3,
      clearcoatRoughness: 0.35,
      envMapIntensity: 0.65,
    }),
    sproutHead: new THREE.MeshStandardMaterial({
      color: "#dfcb92",
      roughness: 0.55,
      envMapIntensity: 0.5,
    }),
    cucumber: new THREE.MeshPhysicalMaterial({
      color: "#d5e5ab",
      roughness: 0.5,
      clearcoat: 0.22,
      envMapIntensity: 0.6,
    }),
    cucumberSkin: new THREE.MeshPhysicalMaterial({
      color: "#3f7530",
      roughness: 0.36,
      clearcoat: 0.45,
      envMapIntensity: 0.7,
    }),
    herb: new THREE.MeshPhysicalMaterial({
      color: "#43843b",
      roughness: 0.48,
      clearcoat: 0.3,
      clearcoatRoughness: 0.35,
      side: THREE.DoubleSide,
      sheen: 0.4,
      sheenColor: new THREE.Color("#9fd07a"),
      envMapIntensity: 0.7,
    }),
    chilli: new THREE.MeshPhysicalMaterial({
      color: "#bf3319",
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.16,
      envMapIntensity: 0.9,
    }),
    chilliStem: new THREE.MeshStandardMaterial({
      color: "#4a7a2c",
      roughness: 0.6,
      envMapIntensity: 0.5,
    }),
    limeFlesh: new THREE.MeshPhysicalMaterial({
      color: "#d9e68b",
      roughness: 0.4,
      clearcoat: 0.5,
      clearcoatRoughness: 0.28,
      sheen: 0.3,
      sheenColor: new THREE.Color("#eaf5a8"),
      envMapIntensity: 0.75,
    }),
    limeRind: new THREE.MeshPhysicalMaterial({
      color: "#79ab35",
      roughness: 0.55,
      clearcoat: 0.2,
      envMapIntensity: 0.6,
    }),
    crisp: new THREE.MeshStandardMaterial({
      color: "#d9a03d",
      roughness: 0.5,
      envMapIntensity: 0.8,
    }),
    fish: new THREE.MeshPhysicalMaterial({
      color: "#efe4d0",
      roughness: 0.58,
      clearcoat: 0.3,
      envMapIntensity: 0.55,
    }),
    fat: new THREE.MeshPhysicalMaterial({
      color: "#f0b348",
      roughness: 0.05,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.8,
    }),
  };

  return {
    ...mats,
    dispose() {
      Object.values(mats).forEach((m) => m.dispose());
      broth.map.dispose();
      broth.roughnessMap.dispose();
      broth.bumpMap.dispose();
      bump.dispose();
    },
  };
}
