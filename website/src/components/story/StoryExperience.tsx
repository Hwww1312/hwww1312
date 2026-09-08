"use client";

import dynamic from "next/dynamic";
import { StoryController } from "@/components/story/StoryController";
import { StoryContent } from "@/components/story/StoryContent";
import { StoryProgress } from "@/components/story/StoryProgress";
import { ReducedMotionStory } from "@/components/story/ReducedMotionStory";
import { ModelFallback } from "@/components/three/ModelFallback";
import { usePrefersReducedMotion } from "@/lib/accessibility/hooks";

const StoryCanvas = dynamic(
  () =>
    import("@/components/story/StoryCanvas").then((m) => m.StoryCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="canvas-host" aria-hidden="true">
        <ModelFallback reason="Lighting the plate…" />
      </div>
    ),
  },
);

export function StoryExperience() {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <>
        <div className="canvas-host" aria-hidden="true">
          <ModelFallback reason="Motion reduced — static plate composition." />
        </div>
        <ReducedMotionStory />
      </>
    );
  }

  return (
    <>
      <StoryCanvas />
      <StoryProgress />
      <StoryController>
        <StoryContent />
      </StoryController>
    </>
  );
}
