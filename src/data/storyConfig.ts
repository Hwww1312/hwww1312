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
  /**
   * The id of the section element this chapter is anchored to. It is separate
   * from `id` because the nav uses human-facing anchors ("#menu", "#story")
   * while the chapters are named after their narrative role.
   */
  domId: string;
  label: string;
  /** Normalised [start, end] of this chapter within the story. */
  range: [number, number];
  camera: CameraState;
  model: ModelState;
  lighting: LightingState;
  /** Dish photograph mapped onto the hero plate during this chapter. */
  dish: string;
  /**
   * How far the canvas recedes behind the content, 0 to 1. Dense editorial
   * sections push this up so photography and type stay readable instead of
   * competing with a 3D object behind them.
   */
  veil: number;
  /** Narrow-viewport overrides. Merged over the desktop state. */
  mobile?: {
    camera?: Partial<CameraState>;
    model?: Partial<ModelState>;
  };
}

export const CHAPTERS: Chapter[] = [
  {
    id: "reveal",
    domId: "reveal",
    label: "01 / The reveal",
    // Fallback ranges only. The controller measures the real sections and
    // overrides these, because the menu gallery is several viewports tall.
    range: [0, 0.091],
    camera: { position: [0, 1.0, 5.6], target: [0.3, -0.2, 0], fov: 34 },
    model: { position: [1.9, -0.5, 0], rotation: [0.62, -0.35, 0], scale: 0.78, spread: 0 },
    lighting: { ambient: 0.04, keyIntensity: 2.1, keyPosition: [2.8, 4.0, 2.4], rimIntensity: 1.7, keyWarmth: 0.8 },
    dish: "lok-lak",
    veil: 0,
    mobile: {
      camera: { position: [0, 1.7, 5.4], target: [0, -0.75, 0], fov: 42 },
      model: { position: [0, 0.7, 0], scale: 0.75 },
    },
  },
  {
    id: "introduction",
    domId: "story",
    label: "02 / Discover",
    range: [0.091, 0.182],
    camera: { position: [2.1, 1.3, 5.2], target: [0.35, -0.15, 0], fov: 34 },
    model: { position: [1.75, -0.35, 0], rotation: [0.4, 0.6, 0.04], scale: 0.68, spread: 0 },
    lighting: { ambient: 0.06, keyIntensity: 2.5, keyPosition: [3.6, 3.5, 1.6], rimIntensity: 2.0, keyWarmth: 0.62 },
    dish: "lok-lak",
    veil: 0.05,
    mobile: {
      camera: { position: [0, 1.7, 5.4], target: [0, -0.75, 0], fov: 42 },
      model: { position: [0, 0.65, 0], scale: 0.7 },
    },
  },
  {
    id: "detail",
    domId: "detail",
    label: "03 / The detail",
    range: [0.182, 0.455],
    camera: { position: [-0.2, 0.85, 4.6], target: [0.35, -0.25, 0], fov: 30 },
    model: { position: [1.7, -0.5, 0], rotation: [0.28, 1.6, -0.04], scale: 0.78, spread: 0 },
    lighting: { ambient: 0.035, keyIntensity: 3.0, keyPosition: [-1.6, 3.2, 2.8], rimIntensity: 2.6, keyWarmth: 0.88 },
    dish: "beef-greens",
    veil: 0.28,
    mobile: {
      camera: { position: [0, 1.7, 5.4], target: [0, -0.75, 0], fov: 42 },
      model: { position: [0, 0.7, 0], scale: 0.78 },
    },
  },
  {
    id: "transformation",
    domId: "transformation",
    label: "04 / One becomes many",
    range: [0.455, 0.545],
    camera: { position: [0, 4.3, 4.6], target: [0, -0.3, 0], fov: 40 },
    model: { position: [0, -0.28, 0], rotation: [0, 2.6, 0], scale: 0.96, spread: 1 },
    lighting: { ambient: 0.1, keyIntensity: 2.7, keyPosition: [0, 5.4, 1.8], rimIntensity: 1.4, keyWarmth: 0.5 },
    dish: "hotpot",
    veil: 0,
    mobile: {
      camera: { position: [0, 5.4, 4.4], target: [0, -0.2, 0], fov: 54 },
      model: { position: [0, -0.15, 0], scale: 0.72 },
    },
  },
  {
    id: "value",
    domId: "menu",
    label: "05 / The room",
    // The menu gallery owns this stretch, so the object withdraws to the
    // edge of frame and the canvas dims rather than fighting the photography.
    range: [0.545, 0.909],
    camera: { position: [3.2, 2.0, 4.6], target: [2.2, -0.2, 0], fov: 36 },
    model: { position: [2.9, -0.35, -0.5], rotation: [0.15, 3.6, 0], scale: 0.62, spread: 0.7 },
    lighting: { ambient: 0.06, keyIntensity: 1.8, keyPosition: [3.0, 4.0, 2.6], rimIntensity: 1.0, keyWarmth: 0.6 },
    dish: "beef-noodle",
    veil: 0.93,
    mobile: {
      camera: { position: [0, 3.6, 6.0], target: [0, -0.2, 0], fov: 52 },
      model: { position: [0, -0.2, 0], scale: 0.5 },
    },
  },
  {
    id: "final",
    domId: "final",
    label: "06 / The invitation",
    range: [0.909, 1],
    camera: { position: [0, 0.7, 5.2], target: [0, -1.0, 0], fov: 32 },
    model: { position: [0, -2.3, 0], rotation: [0.52, 6.0, 0], scale: 0.72, spread: 0 },
    lighting: { ambient: 0.05, keyIntensity: 2.4, keyPosition: [1.8, 4.2, 2.8], rimIntensity: 2.2, keyWarmth: 0.82 },
    dish: "lok-lak",
    veil: 0.12,
    mobile: {
      camera: { position: [0, 1.7, 5.4], target: [0, -0.75, 0], fov: 42 },
      model: { position: [0, 0.7, 0], scale: 0.72 },
    },
  },
];

/**
 * How much scroll the pinned story consumes, as a multiple of viewport
 * height. Kept modest so the page never feels like scroll-jacking.
 */
export const STORY_SCROLL_VH = { desktop: 6.2, mobile: 4.6 } as const;

export const CHAPTER_IDS = CHAPTERS.map((c) => c.id);
