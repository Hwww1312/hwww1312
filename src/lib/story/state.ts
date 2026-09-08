import { CHAPTERS, type Chapter, type CameraState, type ModelState, type LightingState } from "@/data/storyConfig";

/**
 * Scroll state lives outside React on purpose.
 *
 * The controller writes `progress` on every scroll tick and the 3D scene
 * reads it inside `useFrame`. Routing it through React state would re-render
 * the whole tree sixty times a second for no benefit.
 */
export const storyState = {
  /** 0 at the top of chapter 01, 1 at the end of chapter 06. */
  progress: 0,
  isMobile: false,
  reducedMotion: false,
  /** Set once the canvas has drawn a frame, so the poster can fade out. */
  ready: false,
};

/**
 * Chapter ranges measured from the live DOM.
 *
 * The ranges in `storyConfig` are a sensible default, but the real sections
 * are not evenly tall: the menu gallery is several viewports and the hero is
 * one. Guessing fractions puts the transformation in the middle of the menu.
 * The controller measures the actual sections on mount and after every resize
 * and publishes them here, so the scene always tracks the copy beside it.
 */
let measuredRanges: [number, number][] | null = null;

export function setMeasuredRanges(ranges: [number, number][] | null) {
  measuredRanges = ranges;
}

function rangeFor(index: number): [number, number] {
  return measuredRanges?.[index] ?? CHAPTERS[index].range;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: readonly number[], b: readonly number[], t: number): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

/** Smoothstep keeps chapter-to-chapter handovers from reading as a hinge. */
const ease = (t: number) => t * t * (3 - 2 * t);

export interface ResolvedState {
  camera: CameraState;
  model: ModelState;
  lighting: LightingState;
  chapterIndex: number;
  /** 0 to 1 within the current chapter. */
  local: number;
  /** How far the canvas should recede behind dense editorial content. */
  veil: number;
}

function applyMobile(
  chapter: Chapter,
  isMobile: boolean,
): { camera: CameraState; model: ModelState } {
  if (!isMobile || !chapter.mobile) {
    return { camera: chapter.camera, model: chapter.model };
  }
  return {
    camera: { ...chapter.camera, ...(chapter.mobile.camera ?? {}) },
    model: { ...chapter.model, ...(chapter.mobile.model ?? {}) },
  };
}

/**
 * Resolve the scene for a given scroll progress by interpolating between the
 * chapter the visitor is in and the one they are heading towards. Because it
 * is a pure function of progress, scrolling backwards produces exactly the
 * states scrolling forwards did.
 */
export function resolveStory(progress: number, isMobile: boolean): ResolvedState {
  const p = clamp01(progress);
  let index = -1;
  for (let i = 0; i < CHAPTERS.length; i += 1) {
    const [start, end] = rangeFor(i);
    if (p >= start && p <= end) {
      index = i;
      break;
    }
  }
  if (index === -1) index = p <= 0 ? 0 : CHAPTERS.length - 1;

  const chapter = CHAPTERS[index];
  const next = CHAPTERS[Math.min(index + 1, CHAPTERS.length - 1)];
  const [start, end] = rangeFor(index);
  const span = end - start;
  const local = span > 0 ? clamp01((p - start) / span) : 0;
  const t = ease(local);

  const a = applyMobile(chapter, isMobile);
  const b = applyMobile(next, isMobile);

  return {
    chapterIndex: index,
    local,
    camera: {
      position: lerp3(a.camera.position, b.camera.position, t),
      target: lerp3(a.camera.target, b.camera.target, t),
      fov: lerp(a.camera.fov, b.camera.fov, t),
    },
    model: {
      position: lerp3(a.model.position, b.model.position, t),
      rotation: lerp3(a.model.rotation, b.model.rotation, t),
      scale: lerp(a.model.scale, b.model.scale, t),
      spread: lerp(a.model.spread, b.model.spread, t),
    },
    veil: lerp(chapter.veil, next.veil, t),
    lighting: {
      ambient: lerp(chapter.lighting.ambient, next.lighting.ambient, t),
      keyIntensity: lerp(chapter.lighting.keyIntensity, next.lighting.keyIntensity, t),
      keyPosition: lerp3(chapter.lighting.keyPosition, next.lighting.keyPosition, t),
      rimIntensity: lerp(chapter.lighting.rimIntensity, next.lighting.rimIntensity, t),
      keyWarmth: lerp(chapter.lighting.keyWarmth, next.lighting.keyWarmth, t),
    },
  };
}
