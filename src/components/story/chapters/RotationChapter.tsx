import { STORY } from "@/data/siteContent";
import { Parallax } from "../Parallax";

/**
 * Chapter 03.
 *
 * The camera swings around the dish over three viewports. The oversized ghost
 * word and the ruled arcs behind it move at their own rate, so the bowl, the
 * type and the background separate into three distinct planes of depth
 * instead of sliding as one flat sheet.
 */
export function RotationChapter() {
  const { rotation } = STORY;
  return (
    <section
      id="rotation"
      aria-labelledby="rotation-heading"
      data-tall
      className="relative flex min-h-[230vh] items-end overflow-hidden pb-32 pt-[40vh] lg:pb-40"
    >
      {/* Background plane: furthest back, slowest. */}
      <Parallax
        speed={0.055}
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex justify-center"
      >
        <span
          aria-hidden="true"
          className="display select-none text-[26vw] leading-none text-ink/[0.045]"
        >
          Khmer
        </span>
      </Parallax>

      <Parallax
        speed={-0.09}
        className="pointer-events-none absolute -right-[18vw] top-[16vh] -z-10"
      >
        <span
          aria-hidden="true"
          className="block h-[46vw] w-[46vw] rounded-full border border-turmeric/12"
        />
      </Parallax>

      <div className="shell">
        <Parallax speed={0.035} className="lg:max-w-[46rem]">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.34em] text-turmeric">
            {rotation.eyebrow}
          </p>
          <h2
            id="rotation-heading"
            className="display mt-6 max-w-[11ch] text-[length:var(--text-chapter)]"
          >
            {rotation.headline}
          </h2>
          <p className="mt-8 max-w-[34ch] text-base leading-relaxed text-ink-soft">
            {rotation.body}
          </p>
        </Parallax>
      </div>
    </section>
  );
}
