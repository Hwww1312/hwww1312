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
  /** Warmth of the key light, 0 = neutral daylight, 1 = warm lamp. */
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
  /**
   * How far the canvas recedes behind the content, 0 to 1. Dense editorial
   * sections push this up so the type stays readable instead of competing
   * with a 3D object behind it.
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
    camera: { position: [0, 0.78, 3.25], target: [0.62, -0.16, 0], fov: 32 },
    model: { position: [1.92, -0.26, 0], rotation: [0.16, -0.42, 0], scale: 1.06, spread: 0 },
    lighting: { ambient: 0.51, keyIntensity: 1.82, keyPosition: [2.8, 4.0, 2.4], rimIntensity: 0.4, keyWarmth: 0.5 },
    veil: 0,
    mobile: {
      camera: { position: [0, 2.05, 3.5], target: [0, -0.38, 0], fov: 36 },
      model: { position: [0, 0.1, 0], scale: 0.42 },
    },
  },
  {
    id: "introduction",
    domId: "story",
    label: "02 / Discover",
    range: [0.091, 0.182],
    camera: { position: [1.15, 0.9, 3.35], target: [0.62, -0.12, 0], fov: 32 },
    model: { position: [1.88, -0.22, 0], rotation: [0.13, 0.55, 0.03], scale: 1.0, spread: 0 },
    lighting: { ambient: 0.58, keyIntensity: 1.68, keyPosition: [3.6, 3.5, 1.6], rimIntensity: 0.45, keyWarmth: 0.38 },
    veil: 0.05,
    mobile: {
      camera: { position: [0, 2.05, 3.5], target: [0, -0.38, 0], fov: 36 },
      model: { position: [0, 0.08, 0], scale: 0.4 },
    },
  },
  {
    id: "detail",
    domId: "detail",
    label: "03 / The detail",
    range: [0.182, 0.455],
    camera: { position: [-0.15, 0.7, 3.0], target: [0.62, -0.18, 0], fov: 30 },
    model: { position: [1.86, -0.28, 0], rotation: [0.1, 1.62, 0], scale: 1.14, spread: 0 },
    lighting: { ambient: 0.47,  keyIntensity: 2.1, keyPosition: [-1.6, 3.2, 2.8], rimIntensity: 0.4, keyWarmth: 0.55 },
    veil: 0.28,
    mobile: {
      camera: { position: [0, 2.05, 3.5], target: [0, -0.38, 0], fov: 36 },
      model: { position: [0, 0.1, 0], scale: 0.44 },
    },
  },
  {
    id: "transformation",
    domId: "transformation",
    label: "04 / One becomes many",
    range: [0.455, 0.545],
    camera: { position: [0, 4.3, 4.6], target: [0, -0.3, 0], fov: 40 },
    model: { position: [0, -0.28, 0], rotation: [0, 2.6, 0], scale: 0.96, spread: 1 },
    lighting: { ambient: 0.62,  keyIntensity: 1.75, keyPosition: [0.8, 5.4, 1.8], rimIntensity: 0.4, keyWarmth: 0.32 },
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
    // The menu list owns this stretch, so the object withdraws to the edge
    // of frame and the canvas dims rather than fighting the type.
    range: [0.545, 0.909],
    camera: { position: [3.2, 2.0, 4.6], target: [2.2, -0.2, 0], fov: 36 },
    model: { position: [2.9, -0.35, -0.5], rotation: [0.15, 3.6, 0], scale: 0.62, spread: 0.7 },
    lighting: { ambient: 0.55,  keyIntensity: 1.47, keyPosition: [3.0, 4.0, 2.6], rimIntensity: 0.35, keyWarmth: 0.38 },
    veil: 0.96,
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
    camera: { position: [0, 0.7, 3.4], target: [0, -0.9, 0], fov: 32 },
    model: { position: [0, -2.05, 0], rotation: [0.14, 6.0, 0], scale: 1.15, spread: 0 },
    lighting: { ambient: 0.51, keyIntensity: 1.89, keyPosition: [1.8, 4.2, 2.8], rimIntensity: 0.4, keyWarmth: 0.5 },
    veil: 0.12,
    mobile: {
      camera: { position: [0, 2.05, 3.5], target: [0, -0.38, 0], fov: 36 },
      model: { position: [0, 0.1, 0], scale: 0.42 },
    },
  },
];

/**
 * How much scroll the pinned story consumes, as a multiple of viewport
 * height. Kept modest so the page never feels like scroll-jacking.
 */
export const STORY_SCROLL_VH = { desktop: 6.2, mobile: 4.6 } as const;

export const CHAPTER_IDS = CHAPTERS.map((c) => c.id);
