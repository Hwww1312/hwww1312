import { HeroChapter } from "./chapters/HeroChapter";
import { IntroductionChapter } from "./chapters/IntroductionChapter";
import { DetailChapter } from "./chapters/DetailChapter";
import { TransformationChapter } from "./chapters/TransformationChapter";
import { FeaturesChapter } from "./chapters/FeaturesChapter";
import { FinalChapter } from "./chapters/FinalChapter";

/**
 * The semantic spine of the homepage. This is the whole story in HTML: it
 * reads correctly with no JavaScript, no WebGL and no animation, which is
 * what makes the 3D layer safe to treat as decoration.
 */
export function StoryContent() {
  return (
    <div className="relative z-10">
      <HeroChapter />
      <IntroductionChapter />
      <DetailChapter />
      <TransformationChapter />
      <FeaturesChapter />
      <FinalChapter />
    </div>
  );
}
