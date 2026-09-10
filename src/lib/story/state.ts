import {
  CHAPTERS,
  INTRO,
  type Chapter,
  type CameraState,
  type ModelState,
  type LightingState,
} from "@/data/storyConfig";

/**
 * Scroll and pointer state live outside React on purpose.
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
  /** True when the hardware supports the HDR grade, for diagnostics. */
  grading: false,
  /** ?storydebug in the URL. Publishes live scene state onto `window`. */
  debug: false,
  /**
   * Pointer, in -1..1 clip space. `x`/`y` are where the pointer actually is
   * and `dx`/`dy` are the damped values the scene reads, so the bowl always
   * eases towards the cursor and drifts back to rest when it leaves.
   */
  pointer: { x: 0, y: 0, dx: 0, dy: 0, movedAt: -10 },
  /** Seconds on the scene clock, published once per frame by the sequencer. */
  elapsed: 0,
  /** Seconds since the canvas drew its first frame. -1 until it has. */
  startedAt: -1,
  /**
   * True when the page was loaded somewhere other than the top — a restored
   * scroll position or a deep link. The opening sequence is skipped then,
   * because playing a reveal for a bowl that is already off screen looks
   * broken rather than cinematic.
   */
  skipIntro: false,
};

/**
 * Chapter ranges measured from the live DOM.
 *
 * The ranges in `storyConfig` are a sensible default, but the real sections
 * are not evenly tall: the menu is several viewports and the hero is one.
 * Guessing fractions puts the ingredient call-outs in the middle of the menu.
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

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: readonly number[], b: readonly number[], t: number): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

/** Smoothstep keeps chapter-to-chapter handovers from reading as a hinge. */
export const ease = (t: number) => t * t * (3 - 2 * t);

/** Slow out, no overshoot. Expensive-feeling rather than bouncy. */
export const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

/** Normalise a value into a window and smoothstep it. */
export const window01 = (v: number, from: number, to: number) =>
  ease(clamp01((v - from) / (to - from)));

/**
 * Framerate-independent damping. `smoothing` is the fraction of the gap that
 * survives one second, so the same call behaves identically at 30 and 144fps.
 */
export function damp(current: number, target: number, smoothing: number, dt: number) {
  return lerp(target, current, Math.exp(Math.log(smoothing) * dt));
}

export interface ResolvedState {
  camera: CameraState;
  model: ModelState;
  lighting: LightingState;
  chapterIndex: number;
  /** 0 to 1 within the current chapter. */
  local: number;
  /** How far the canvas should recede behind dense editorial content. */
  veil: number;
  /** How strongly the ingredient call-outs are showing. */
  labels: number;
}

function applyMobile(
  chapter: Chapter,
  isMobile: boolean,
): { camera: CameraState; model: ModelState; veil: number } {
  if (!isMobile || !chapter.mobile) {
    return { camera: chapter.camera, model: chapter.model, veil: chapter.veil };
  }
  return {
    camera: { ...chapter.camera, ...(chapter.mobile.camera ?? {}) },
    model: { ...chapter.model, ...(chapter.mobile.model ?? {}) },
    veil: chapter.mobile.veil ?? chapter.veil,
  };
}

/**
 * Resolve the scene for a given scroll progress by interpolating between the
 * chapter the visitor is in and the one they are heading towards. Because it
 * is a pure function of progress, scrolling backwards produces exactly the
 * states scrolling forwards did, and stopping mid-transition holds the frame.
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
  const la = chapter.lighting;
  const lb = next.lighting;

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
      // The swell rides on top of the boundary-to-boundary interpolation and
              // is zero at both ends, so the separation happens in the middle
              // of its own section without breaking continuity anywhere.
      spread:
        lerp(a.model.spread, b.model.spread, t) +
        (chapter.model.swell ?? 0) * Math.sin(Math.PI * local),
    },
    // The closing section is the one place the dish has to get out of its own
    // way. The canvas is fixed, so as the section scrolls past its composed
    // frame the statement and the call to action ride up through the bowl —
    // the dish dissolves back into the dark instead, which is also the right
    // way to end the film.
    veil: Math.max(
      lerp(a.veil, b.veil, t),
      index === CHAPTERS.length - 1 ? window01(local, 0.68, 0.96) : 0,
    ),
    // The call-outs hold for the length of their chapter and only cross-fade
    // over its last fifth. Interpolating them like everything else would peak
    // them on the chapter boundary and have them half gone by the time the
    // section they belong to is actually on screen.
    labels: lerp(chapter.labels, next.labels, window01(local, 0.8, 1)),
    lighting: {
      ambient: lerp(la.ambient, lb.ambient, t),
      keyIntensity: lerp(la.keyIntensity, lb.keyIntensity, t),
      keyPosition: lerp3(la.keyPosition, lb.keyPosition, t),
      keyWarmth: lerp(la.keyWarmth, lb.keyWarmth, t),
      rimIntensity: lerp(la.rimIntensity, lb.rimIntensity, t),
      fillIntensity: lerp(la.fillIntensity, lb.fillIntensity, t),
      accentIntensity: lerp(la.accentIntensity, lb.accentIntensity, t),
      glow: lerp(la.glow, lb.glow, t),
    },
  };
}

export interface IntroState {
  /** 0 = pitch dark, 1 = the rig is at full chapter intensity. */
  light: number;
  /** 0 = below the frame at three-quarter scale, 1 = settled. */
  rise: number;
  /** 0 = camera held back, 1 = camera has finished its push. */
  push: number;
  /** True once nothing is left to animate, so the scene can stop blending. */
  done: boolean;
}

const SETTLED: IntroState = { light: 1, rise: 1, push: 1, done: true };

/**
 * The opening sequence, as a pure function of elapsed time.
 *
 * It is resolved once per frame and handed to the camera, the rig and the
 * bowl together, so the three can never drift out of step with each other.
 */
export function resolveIntro(elapsed: number): IntroState {
  if (storyState.reducedMotion || storyState.skipIntro || elapsed < 0) return SETTLED;

  const light = window01(elapsed, INTRO.lightIn[0], INTRO.lightIn[1]);
  const rise = easeOutQuint(
    clamp01((elapsed - INTRO.rise[0]) / (INTRO.rise[1] - INTRO.rise[0])),
  );
  const push = easeOutQuint(
    clamp01((elapsed - INTRO.push[0]) / (INTRO.push[1] - INTRO.push[0])),
  );

  return { light, rise, push, done: light >= 1 && rise >= 1 && push >= 1 };
}
