/**
 * The story timeline: one source of truth for the scroll-driven experience.
 *
 * Every chapter declares where the camera sits, where the bowl sits, how the
 * scene is lit and how far the garnishes have lifted away from the dish. The
 * controller interpolates between consecutive chapters using scroll progress,
 * so tuning the experience means editing this file, not the components.
 *
 * `progress` is normalised across the whole story: 0 at the top of chapter 01,
 * 1 at the end of chapter 06.
 *
 * A note on the numbers. The bowl is modelled with an outer radius of 1 and a
 * rim at y = 0.67, standing on its own base at y = 0, so every position below
 * is readable against the dish itself rather than against an arbitrary scale.
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
   * 0 = the dish is plated as it leaves the kitchen.
   * 1 = the garnishes have drifted apart — chilli forward, herbs up, lime
   * sideways, noodles lifted. This is the Chapter 04 transition, and it is
   * deliberately small: the dish separates, it never explodes.
   *
   * This is the value at the chapter's own boundary. Because the resolver
   * always interpolates from one chapter to the next, a value authored here
   * is what the visitor sees as they *arrive* at the section.
   */
  spread: number;
  /**
   * Extra separation added across the middle of this chapter, on a sine that
   * is zero at both ends.
   *
   * Without it a there-and-back move is impossible: the dish would have to
   * reach full separation exactly on a section boundary and then close again
   * over the next one, which puts the whole transition in the wrong section.
   * The sine keeps the handovers continuous by construction.
   */
  swell?: number;
}

export interface LightingState {
  ambient: number;
  /** The strongest source: warm, above and slightly to the front-left. */
  keyIntensity: number;
  keyPosition: Vec3;
  /** Warmth of the key, 0 = neutral studio, 1 = golden lamp. */
  keyWarmth: number;
  /** Warm gold from behind, which is what lifts the bowl off the dark. */
  rimIntensity: number;
  /** Very soft neutral bounce from the opposite side. */
  fillIntensity: number;
  /** A whisper of tropical green, enough to sit in the herbs and no more. */
  accentIntensity: number;
  /** The radial pool of warm light behind the dish. */
  glow: number;
}

export interface Chapter {
  id: string;
  /**
   * The id of the section element this chapter is anchored to. It is separate
   * from `id` because the nav uses human-facing anchors ("#menu") while the
   * chapters are named after their narrative role.
   */
  domId: string;
  label: string;
  /** Normalised [start, end] of this chapter within the story. */
  range: [number, number];
  camera: CameraState;
  model: ModelState;
  lighting: LightingState;
  /**
   * How far the canvas recedes behind the content, 0 to 1. The one dense
   * editorial stretch pushes this up so the type stays readable instead of
   * competing with the dish behind it.
   */
  veil: number;
  /** How strongly the ingredient call-outs are showing, 0 to 1. */
  labels: number;
  /** Narrow-viewport overrides. Merged over the desktop state. */
  mobile?: {
    camera?: Partial<CameraState>;
    model?: Partial<ModelState>;
    /**
     * A phone stacks the copy under the dish instead of beside it, so the
     * two share the frame far more than they do on a wide screen. A little
     * extra veil is what keeps the body copy readable where it does.
     */
    veil?: number;
  };
}

/**
 * Phones get the same film, shot on a longer lens: the bowl stays centred, the
 * camera travels a fraction of the distance, and nothing swings far enough off
 * axis to leave the frame on a 390px screen.
 */
const MOBILE_CAMERA: Vec3 = [0, 2.1, 5.1];
/** Aimed below the bowl, which lifts the dish into the upper third of a
 *  tall screen and leaves the lower two thirds to the type. */
const MOBILE_TARGET: Vec3 = [0, -0.24, 0];

export const CHAPTERS: Chapter[] = [
  {
    id: "hero",
    domId: "hero",
    label: "01 / A taste of Cambodia",
    // Fallback ranges only. The controller measures the real sections and
    // overrides these, because the menu is several viewports tall.
    range: [0, 0.16],
    // Front, slightly above: a three-quarter hero angle that shows the
    // surface of the curry without tipping into a flat lay.
    camera: { position: [0.42, 1.62, 4.35], target: [1.12, 0.46, 0], fov: 34 },
    // Right of centre, so the headline has the left half to itself.
    model: { position: [1.52, -0.06, 0], rotation: [0.087, -0.14, 0], scale: 0.98, spread: 0 },
    lighting: {
      ambient: 0.3, keyIntensity: 1.85, keyPosition: [-2.1, 4.2, 2.6], keyWarmth: 0.62,
      rimIntensity: 1.5, fillIntensity: 0.22, accentIntensity: 0.16, glow: 1,
    },
    veil: 0,
    labels: 0,
    mobile: {
      camera: { position: MOBILE_CAMERA, target: MOBILE_TARGET, fov: 40 },
      model: { position: [0, -0.02, 0], scale: 0.72 },
    },
  },
  {
    id: "ingredients",
    domId: "ingredients",
    label: "02 / Discover the ingredients",
    range: [0.16, 0.36],
    // Camera climbs and pushes in: the dish turns towards a top-down read
    // without ever becoming a flat lay.
    camera: { position: [0.3, 3.15, 3.5], target: [0.48, 0.5, 0], fov: 32 },
    model: { position: [0.55, -0.04, 0], rotation: [-0.035, 0.14, 0], scale: 1.12, spread: 0 },
    lighting: {
      ambient: 0.36, keyIntensity: 2.05, keyPosition: [-1.5, 4.6, 1.9], keyWarmth: 0.5,
      rimIntensity: 1.15, fillIntensity: 0.3, accentIntensity: 0.24, glow: 0.85,
    },
    veil: 0.12,
    labels: 1,
    mobile: {
      camera: { position: [0, 3.3, 4.4], target: MOBILE_TARGET, fov: 40 },
      model: { position: [0, -0.02, 0], scale: 0.74 },
      veil: 0.55,
    },
  },
  {
    id: "rotation",
    domId: "rotation",
    label: "03 / Turn it in the light",
    range: [0.36, 0.56],
    // The camera swings around the dish rather than the dish spinning on the
    // spot: the parallax between bowl, garnish and type comes from here.
    camera: { position: [-2.35, 2.05, 3.3], target: [0.62, 0.48, 0], fov: 33 },
    model: { position: [0.55, -0.05, 0], rotation: [0.06, 0.85, -0.02], scale: 1.12, spread: 0.05 },
    lighting: {
      ambient: 0.26, keyIntensity: 1.7, keyPosition: [-3.2, 3.6, 1.2], keyWarmth: 0.72,
      rimIntensity: 1.9, fillIntensity: 0.18, accentIntensity: 0.3, glow: 1.1,
    },
    veil: 0.24,
    labels: 0,
    mobile: {
      camera: { position: [-1.2, 2.5, 4.7], target: MOBILE_TARGET, fov: 42 },
      model: { position: [0, -0.02, 0], scale: 0.72 },
      veil: 0.5,
    },
  },
  {
    id: "separation",
    domId: "separation",
    label: "04 / Layer by layer",
    range: [0.56, 0.72],
    camera: { position: [1.3, 1.9, 3.7], target: [-1.25, 0.54, 0], fov: 35 },
    model: { position: [-1.35, -0.02, 0], rotation: [0.04, 1.62, 0.02], scale: 1.06, spread: 0.12, swell: 0.88 },
    lighting: {
      ambient: 0.38, keyIntensity: 2.25, keyPosition: [1.1, 4.2, 2.8], keyWarmth: 0.55,
      rimIntensity: 1.6, fillIntensity: 0.3, accentIntensity: 0.34, glow: 1.05,
    },
    veil: 0.05,
    labels: 0,
    mobile: {
      camera: { position: [0.9, 2.3, 4.8], target: MOBILE_TARGET, fov: 42 },
      model: { position: [0, -0.02, 0], scale: 0.7 },
      veil: 0.46,
    },
  },
  {
    id: "kitchen",
    domId: "menu",
    label: "05 / The kitchen",
    // The menu owns this stretch, so the dish withdraws to the edge of frame
    // and the canvas dims rather than fighting the type.
    range: [0.72, 0.9],
    camera: { position: [3.1, 2.3, 4.5], target: [1.9, 0.3, 0], fov: 36 },
    model: { position: [2.5, -0.3, -0.6], rotation: [0.14, 2.6, 0], scale: 0.72, spread: 0.22 },
    lighting: {
      ambient: 0.42, keyIntensity: 1.35, keyPosition: [2.6, 4.0, 2.6], keyWarmth: 0.45,
      rimIntensity: 0.9, fillIntensity: 0.3, accentIntensity: 0.16, glow: 0.45,
    },
    veil: 0.92,
    labels: 0,
    mobile: {
      camera: { position: [0, 3.1, 5.8], target: MOBILE_TARGET, fov: 44 },
      model: { position: [0, -0.1, 0], scale: 0.6 },
    },
  },
  {
    id: "final",
    domId: "final",
    label: "06 / Taste Cambodia",
    range: [0.9, 1],
    // Back to a composed three-quarter hero angle, the bowl set to one side
    // so the closing statement reads through and behind it.
    camera: { position: [-0.34, 1.58, 4.2], target: [0.3, 0.48, 0], fov: 34 },
    model: { position: [0.72, -0.05, 0], rotation: [0.08, 3.55, 0], scale: 1.06, spread: 0 },
    lighting: {
      ambient: 0.28, keyIntensity: 1.9, keyPosition: [-1.9, 4.1, 2.7], keyWarmth: 0.66,
      rimIntensity: 1.7, fillIntensity: 0.22, accentIntensity: 0.18, glow: 1.15,
    },
    veil: 0.14,
    labels: 0,
    mobile: {
      // Aimed lower again, so the dish lands in the gap between the two
      // closing words rather than on top of the second one.
      camera: { position: MOBILE_CAMERA, target: [0, -0.46, 0], fov: 40 },
      model: { position: [0, -0.02, 0], scale: 0.68 },
      veil: 0.2,
    },
  },
];

/**
 * The opening sequence, in seconds from the first drawn frame.
 *
 * It is authored here rather than in the component so the whole film — load
 * and scroll alike — is tunable from one file. Everything is slow on purpose.
 */
export const INTRO = {
  /** The spotlight comes up from nothing. */
  lightIn: [0, 1.5] as const,
  /** The bowl rises from below the frame and settles. */
  rise: [0.35, 3] as const,
  /** The camera keeps pushing forward after the bowl has landed. */
  push: [0.15, 3.6] as const,
  /** How far below its resting place the bowl starts. */
  riseFrom: -1.6,
  /** Scale at the start of the rise. */
  scaleFrom: 0.75,
  /** Extra yaw at the start of the rise, in radians. */
  yawFrom: 0.42,
  /** How much further back the camera starts. */
  pushFrom: 1.15,
} as const;

export const CHAPTER_IDS = CHAPTERS.map((c) => c.id);
