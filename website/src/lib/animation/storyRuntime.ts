/**
 * Shared mutable story state. Written by StoryController (GSAP scrub),
 * read by the 3D scene each frame. Keeps a single source of truth so
 * animation systems do not fight over transforms.
 */
import type { SceneState } from "@/data/storyConfig";
import { CHAPTERS } from "@/data/storyConfig";

export type StoryRuntime = {
  progress: number;
  activeChapter: string;
  reducedMotion: boolean;
  mobile: boolean;
  webglReady: boolean;
  state: SceneState;
};

const listeners = new Set<() => void>();

export const storyRuntime: StoryRuntime = {
  progress: 0,
  activeChapter: CHAPTERS[0].id,
  reducedMotion: false,
  mobile: false,
  webglReady: false,
  state: { ...CHAPTERS[0].state },
};

export function setStoryRuntime(partial: Partial<StoryRuntime>) {
  Object.assign(storyRuntime, partial);
  listeners.forEach((fn) => fn());
}

export function subscribeStory(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
