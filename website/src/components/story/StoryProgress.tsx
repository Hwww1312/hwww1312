"use client";

import { useSyncExternalStore } from "react";
import { CHAPTERS } from "@/data/storyConfig";
import { storyRuntime, subscribeStory } from "@/lib/animation/storyRuntime";

function getSnapshot() {
  return storyRuntime.activeChapter;
}

function getServerSnapshot() {
  return CHAPTERS[0].id;
}

export function StoryProgress() {
  const active = useSyncExternalStore(
    subscribeStory,
    getSnapshot,
    getServerSnapshot,
  );

  return (
    <div
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex"
      aria-hidden="true"
    >
      {CHAPTERS.map((chapter) => {
        const on = chapter.id === active;
        return (
          <div key={chapter.id} className="flex items-center gap-3">
            <span
              className={`h-px transition-all duration-300 ${
                on ? "w-8 bg-lemongrass" : "w-4 bg-paper/25"
              }`}
            />
            <span
              className={`text-[10px] uppercase tracking-[0.2em] ${
                on ? "text-lemongrass" : "text-paper/30"
              }`}
            >
              {chapter.label.split(" ")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
