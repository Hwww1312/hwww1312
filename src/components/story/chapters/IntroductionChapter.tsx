import { STORY } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function IntroductionChapter() {
  const { introduction } = STORY;
  return (
    <section
      id="story"
      aria-labelledby="introduction-heading"
      className="relative flex min-h-dvh items-start pb-24 pt-[46vh] lg:items-center lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-5 sm:px-8 lg:grid-cols-12">
        {/* Text holds the left third so the hero object keeps the right. */}
        <div className="lg:col-span-5 lg:col-start-1">
          <SectionHeading eyebrow={introduction.eyebrow}>
            <span id="introduction-heading">{introduction.headline}</span>
          </SectionHeading>
          <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-sage">
            {introduction.body}
          </p>
        </div>
      </div>
    </section>
  );
}
