/**
 * Single source of truth for the scroll-driven story.
 * Progress is 0–1 across the pinned story timeline.
 * Tune chapter ranges and transforms here without rewriting components.
 */

export type Vec3 = [number, number, number];

export type SceneState = {
  cameraPosition: Vec3;
  cameraLookAt: Vec3;
  modelPosition: Vec3;
  modelRotation: Vec3;
  modelScale: number;
  lightIntensity: number;
  accentIntensity: number;
  dishIndex: number;
  lidOpen: number;
  steam: number;
  envIntensity: number;
};

export type ChapterConfig = {
  id: string;
  label: string;
  /** Inclusive start / exclusive end of global story progress */
  range: [number, number];
  state: SceneState;
};

/** Desktop framing (mobile overrides applied in StoryController). */
export const CHAPTERS: ChapterConfig[] = [
  {
    id: "reveal",
    label: "01 Reveal",
    range: [0, 0.14],
    state: {
      cameraPosition: [0.4, 2.4, 2.8],
      cameraLookAt: [0.2, 0.05, 0],
      modelPosition: [0.55, 0, 0],
      modelRotation: [-0.55, 0.2, 0.08],
      modelScale: 1.2,
      lightIntensity: 1.4,
      accentIntensity: 0.6,
      dishIndex: 0,
      lidOpen: 0,
      steam: 0.04,
      envIntensity: 0.35,
    },
  },
  {
    id: "introduction",
    label: "02 Discover",
    range: [0.14, 0.3],
    state: {
      cameraPosition: [-0.3, 2.1, 3.0],
      cameraLookAt: [0.35, 0.05, 0],
      modelPosition: [0.7, 0, 0],
      modelRotation: [-0.45, 0.85, 0.05],
      modelScale: 1.0,
      lightIntensity: 1.2,
      accentIntensity: 0.7,
      dishIndex: 1,
      lidOpen: 0,
      steam: 0.06,
      envIntensity: 0.4,
    },
  },
  {
    id: "details",
    label: "03 Details",
    range: [0.3, 0.5],
    state: {
      cameraPosition: [0.15, 1.55, 1.85],
      cameraLookAt: [0, 0.05, 0],
      modelPosition: [0, -0.05, 0],
      modelRotation: [-0.85, 0.15, 0],
      modelScale: 1.35,
      lightIntensity: 1.65,
      accentIntensity: 1.0,
      dishIndex: 2,
      lidOpen: 0,
      steam: 0.1,
      envIntensity: 0.45,
    },
  },
  {
    id: "transformation",
    label: "04 Transformation",
    range: [0.5, 0.68],
    state: {
      cameraPosition: [0.2, 2.6, 2.5],
      cameraLookAt: [0, 0.2, 0],
      modelPosition: [0.35, 0.05, 0],
      modelRotation: [-0.35, 0.4, 0],
      modelScale: 1.1,
      lightIntensity: 1.85,
      accentIntensity: 1.15,
      dishIndex: 3,
      lidOpen: 1,
      steam: 0.85,
      envIntensity: 0.55,
    },
  },
  {
    id: "value",
    label: "05 Value",
    range: [0.68, 0.86],
    state: {
      cameraPosition: [1.8, 2.2, 2.8],
      cameraLookAt: [-0.4, 0.05, 0],
      modelPosition: [-1.0, 0, 0],
      modelRotation: [-0.5, -0.7, 0.05],
      modelScale: 0.78,
      lightIntensity: 1.1,
      accentIntensity: 0.45,
      dishIndex: 4,
      lidOpen: 0,
      steam: 0.08,
      envIntensity: 0.3,
    },
  },
  {
    id: "final",
    label: "06 Invitation",
    range: [0.86, 1],
    state: {
      cameraPosition: [0.25, 2.35, 2.7],
      cameraLookAt: [0, 0.05, 0],
      modelPosition: [0.15, 0, 0],
      modelRotation: [-0.5, 0.15, 0],
      modelScale: 1.25,
      lightIntensity: 1.5,
      accentIntensity: 0.85,
      dishIndex: 0,
      lidOpen: 0,
      steam: 0.08,
      envIntensity: 0.4,
    },
  },
];

/** Detail sub-beats within chapter 03 (local 0–1 of that chapter). */
export const DETAIL_BEATS = [
  { local: 0.15, dishIndex: 0, lookBoost: 0.05 },
  { local: 0.5, dishIndex: 2, lookBoost: 0.12 },
  { local: 0.85, dishIndex: 5, lookBoost: 0.08 },
] as const;

export const MOBILE_OFFSETS = {
  cameraZ: 0.55,
  modelX: 0,
  modelScale: 0.88,
} as const;

export const STORY_SCROLL = {
  /** Viewport heights for the pinned story scrub distance */
  desktopVh: 620,
  mobileVh: 420,
} as const;

export function chapterProgress(global: number, range: [number, number]) {
  const [a, b] = range;
  if (global <= a) return 0;
  if (global >= b) return 1;
  return (global - a) / (b - a);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpVec3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Interpolate scene state between neighbouring chapter keyframes. */
export function sampleSceneState(progress: number): SceneState {
  const p = Math.min(1, Math.max(0, progress));
  let i = 0;
  for (; i < CHAPTERS.length - 1; i += 1) {
    if (p < CHAPTERS[i + 1].range[0]) break;
  }
  const current = CHAPTERS[i];
  const next = CHAPTERS[Math.min(i + 1, CHAPTERS.length - 1)];
  if (current === next) return { ...current.state };

  const start = current.range[0];
  const end = next.range[0];
  const raw = end === start ? 1 : (p - start) / (end - start);
  const t = easeInOutCubic(Math.min(1, Math.max(0, raw)));
  const A = current.state;
  const B = next.state;

  return {
    cameraPosition: lerpVec3(A.cameraPosition, B.cameraPosition, t),
    cameraLookAt: lerpVec3(A.cameraLookAt, B.cameraLookAt, t),
    modelPosition: lerpVec3(A.modelPosition, B.modelPosition, t),
    modelRotation: lerpVec3(A.modelRotation, B.modelRotation, t),
    modelScale: lerp(A.modelScale, B.modelScale, t),
    lightIntensity: lerp(A.lightIntensity, B.lightIntensity, t),
    accentIntensity: lerp(A.accentIntensity, B.accentIntensity, t),
    dishIndex: t < 0.5 ? A.dishIndex : B.dishIndex,
    lidOpen: lerp(A.lidOpen, B.lidOpen, t),
    steam: lerp(A.steam, B.steam, t),
    envIntensity: lerp(A.envIntensity, B.envIntensity, t),
  };
}
