/**
 * The story timeline: one source of truth for the scroll-driven experience.
 *
 * Every chapter declares where the camera sits, where the hero object sits,
 * how the scene is lit, and how far the service piece has opened out. The
 * controller interpolates between consecutive chapters using scroll progress,
 * so tuning the experience means editing this file, not the components.
 *
 * `progress` is normalised across the whole story: 0 at the top of chapter 01,
 * 1 at the end of chapter 06.
 */

export type Vec3 = [number, number, number];

export interface CameraState {
  position: Vec3;
  /** Point the camera is aimed at. */
  target: Vec3;
  fov: number;
}

export interface ModelState {
  position: Vec3;
  /** Euler rotation in radians. */
  rotation: Vec3;
  scale: number;
  /**
   * 0 = the service pieces are stacked as a single object.
   * 1 = they are laid out as a full table setting.
   * This is the Chapter 04 transformation.
   */
  spread: number;
}

export interface LightingState {
  ambient: number;
  keyIntensity: number;
  keyPosition: Vec3;
  rimIntensity: number;
  /** Warmth of the key light, 0 = neutral ivory, 1 = warm lamp. */
  keyWarmth: number;
}

export interface Chapter {
  id: string;
  label: string;
  /** Normalised [start, end] of this chapter within the story. */
  range: [number, number];
  camera: CameraState;
  model: ModelState;
  lighting: LightingState;
  /** Dish photograph mapped onto the hero plate during this chapter. */
  dish: string;
  /** Narrow-viewport overrides. Merged over the desktop state. */
  mobile?: {
    camera?: Partial<CameraState>;
    model?: Partial<ModelState>;
  };
}

export const CHAPTERS: Chapter[] = [
  {
    id: "reveal",
    label: "01 / The reveal",
    range: [0, 0.16],
    camera: { position: [0, 1.15, 5.1], target: [0, 0.05, 0], fov: 34 },
    model: { position: [0, -0.12, 0], rotation: [0.62, -0.35, 0], scale: 1, spread: 0 },
    lighting: { ambient: 0.06, keyIntensity: 2.5, keyPosition: [2.4, 4.2, 2.2], rimIntensity: 1.5, keyWarmth: 0.75 },
    dish: "lok-lak",
    mobile: {
      camera: { position: [0, 1.35, 6.4], fov: 42 },
      model: { position: [0, 0.1, 0], scale: 0.92 },
    },
  },
  {
    id: "introduction",
    label: "02 / Discover",
    range: [0.16, 0.34],
    camera: { position: [2.75, 1.5, 3.7], target: [0, 0, 0], fov: 34 },
    model: { position: [-0.55, -0.05, 0], rotation: [0.42, 0.55, 0.05], scale: 1.05, spread: 0 },
    lighting: { ambient: 0.09, keyIntensity: 3.0, keyPosition: [3.4, 3.6, 1.4], rimIntensity: 1.9, keyWarmth: 0.6 },
    dish: "lok-lak",
    mobile: {
      camera: { position: [1.5, 1.9, 5.4], fov: 44 },
      model: { position: [0, 0.35, 0], scale: 0.86 },
    },
  },
  {
    id: "detail",
    label: "03 / The detail",
    range: [0.34, 0.54],
    camera: { position: [-1.5, 0.72, 2.5], target: [-0.15, -0.05, 0], fov: 28 },
    model: { position: [0, -0.05, 0], rotation: [0.3, 1.5, -0.04], scale: 1.16, spread: 0 },
    lighting: { ambient: 0.05, keyIntensity: 3.6, keyPosition: [-2.2, 3.0, 2.6], rimIntensity: 2.6, keyWarmth: 0.85 },
    dish: "beef-greens",
    mobile: {
      camera: { position: [-0.9, 1.15, 3.9], fov: 42 },
      model: { position: [0, 0.3, 0], scale: 0.95 },
    },
  },
  {
    id: "transformation",
    label: "04 / One becomes many",
    range: [0.54, 0.72],
    camera: { position: [0, 4.4, 4.5], target: [0, -0.35, 0], fov: 40 },
    model: { position: [0, -0.3, 0], rotation: [0, 2.5, 0], scale: 0.98, spread: 1 },
    lighting: { ambient: 0.14, keyIntensity: 3.1, keyPosition: [0, 5.2, 1.6], rimIntensity: 1.5, keyWarmth: 0.5 },
    dish: "hotpot",
    mobile: {
      camera: { position: [0, 5.6, 4.6], fov: 52 },
      model: { position: [0, -0.1, 0], scale: 0.8 },
    },
  },
  {
    id: "value",
    label: "05 / The room",
    range: [0.72, 0.9],
    camera: { position: [3.5, 2.1, 4.2], target: [1.5, -0.25, 0], fov: 36 },
    model: { position: [1.75, -0.3, -0.4], rotation: [0.16, 3.5, 0], scale: 0.8, spread: 0.72 },
    lighting: { ambient: 0.11, keyIntensity: 2.4, keyPosition: [2.6, 4.0, 2.6], rimIntensity: 1.2, keyWarmth: 0.62 },
    dish: "beef-noodle",
    mobile: {
      camera: { position: [0, 3.4, 5.6], target: [0, -0.3, 0], fov: 50 },
      model: { position: [0, -0.25, 0], scale: 0.66 },
    },
  },
  {
    id: "final",
    label: "06 / The invitation",
    range: [0.9, 1],
    camera: { position: [0, 1.05, 4.4], target: [0, -0.02, 0], fov: 32 },
    model: { position: [0, -0.1, 0], rotation: [0.55, 5.9, 0], scale: 1.06, spread: 0 },
    lighting: { ambient: 0.07, keyIntensity: 2.8, keyPosition: [1.6, 4.0, 2.6], rimIntensity: 2.1, keyWarmth: 0.8 },
    dish: "lok-lak",
    mobile: {
      camera: { position: [0, 1.3, 5.8], fov: 42 },
      model: { position: [0, 0.05, 0], scale: 0.9 },
    },
  },
];

/**
 * How much scroll the pinned story consumes, as a multiple of viewport
 * height. Kept modest so the page never feels like scroll-jacking.
 */
export const STORY_SCROLL_VH = { desktop: 6.2, mobile: 4.6 } as const;

export const CHAPTER_IDS = CHAPTERS.map((c) => c.id);
