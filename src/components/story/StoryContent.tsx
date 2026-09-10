import { HeroChapter } from "./chapters/HeroChapter";
import { IngredientsChapter } from "./chapters/IngredientsChapter";
import { RotationChapter } from "./chapters/RotationChapter";
import { SeparationChapter } from "./chapters/SeparationChapter";
import { MenuChapter } from "./chapters/MenuChapter";
import { FinalChapter } from "./chapters/FinalChapter";

/**
 * The semantic spine of the homepage. This is the whole story in HTML: it
 * reads correctly with no JavaScript, no WebGL and no animation, which is
 * what makes the 3D layer safe to treat as decoration.
 *
 * The z-order is the composition. The opening and closing statements sit
 * *behind* the canvas so the bowl overlaps them; everything between sits in
 * front of it, where the canvas dims itself out of the way instead. The
 * canvas takes no pointer events, so the layers below it stay live.
 */
export function StoryContent() {
  return (
    <>
      <div className="relative z-0">
        <HeroChapter />
      </div>

      <div className="relative z-20">
        <IngredientsChapter />
        <RotationChapter />
        <SeparationChapter />
        <MenuChapter />
      </div>

      <div className="relative z-0">
        <FinalChapter />
      </div>
    </>
  );
}
