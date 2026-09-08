"use client";

import { HeroChapter } from "@/components/story/chapters/HeroChapter";
import { IntroductionChapter } from "@/components/story/chapters/IntroductionChapter";
import { DetailChapter } from "@/components/story/chapters/DetailChapter";
import { TransformationChapter } from "@/components/story/chapters/TransformationChapter";
import { FeaturesChapter } from "@/components/story/chapters/FeaturesChapter";
import { FinalChapter } from "@/components/story/chapters/FinalChapter";

/**
 * HTML layer for the six story chapters. Visibility is toggled by
 * StoryController from the shared scroll progress.
 */
export function StoryContent() {
  return (
    <div className="relative z-10 min-h-dvh">
      <HeroChapter />
      <IntroductionChapter />
      <DetailChapter />
      <TransformationChapter />
      <FeaturesChapter />
      <FinalChapter />
    </div>
  );
}
