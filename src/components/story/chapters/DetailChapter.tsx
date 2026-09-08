import { STORY } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function DetailChapter() {
  const { details } = STORY;
  return (
    <section
      id="detail"
      aria-labelledby="detail-heading"
      className="relative pb-28 pt-[46vh] lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <SectionHeading eyebrow={details.eyebrow}>
          <span id="detail-heading">{details.headline}</span>
        </SectionHeading>

        {/* Each beat occupies its own viewport step so the camera has room
            to travel between them. Stacked on phones, offset on desktop. */}
        <ol className="mt-20 space-y-28 lg:space-y-40">
          {details.beats.map((beat, i) => (
            <li
              key={beat.id}
              id={`detail-${beat.id}`}
              className={
                i % 2 === 0
                  ? "lg:ml-0 lg:max-w-[34rem]"
                  : "lg:ml-auto lg:max-w-[34rem] lg:text-right"
              }
            >
              <p className="font-[family-name:var(--font-display)] text-sm font-bold tracking-tight text-lemongrass">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-[length:var(--text-section)] leading-[1.02]">
                {beat.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-sage">{beat.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
