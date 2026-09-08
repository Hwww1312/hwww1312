"use client";

import { CHAPTERS } from "@/data/storyConfig";

/**
 * A quiet chapter indicator on the right edge. Decorative: the same structure
 * is already in the headings, so it is hidden from assistive technology.
 */
export function StoryProgress({ active }: { active: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {CHAPTERS.map((c, i) => (
        <span
          key={c.id}
          className={`block h-px transition-all duration-500 ease-out ${
            i === active ? "w-9 bg-jade" : "w-4 bg-ink/20"
          }`}
        />
      ))}
    </div>
  );
}
