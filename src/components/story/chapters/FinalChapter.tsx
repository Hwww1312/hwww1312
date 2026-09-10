import { BUSINESS, STORY } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";

/**
 * Chapter 06.
 *
 * Like the hero, this sits behind the canvas: the closing statement is split
 * around the bowl so the dish lands between the two words rather than beside
 * them. The gap in the middle is where the bowl comes to rest.
 */
export function FinalChapter() {
  const { final } = STORY;
  const [first, second] = final.headline;

  return (
    <section
      id="final"
      aria-labelledby="final-heading"
      data-tall
      // The stack is anchored to the top of the section rather than centred:
      // the canvas is fixed, so the composed frame — the two words either side
      // of the bowl — has to land when the section reaches the top of the
      // viewport. The height beyond that is the run in which the dish fades
      // back into the dark as the call to action takes the frame.
      className="relative flex min-h-[125vh] flex-col justify-start pb-24 pt-[6vh] lg:min-h-[128vh] lg:pt-[8vh] lg:pb-32"
    >
      <div className="shell text-center">
        <h2 id="final-heading" className="display text-[length:var(--text-hero)]">
          <span className="block">{first}</span>
          {/* The bowl rests in this gap. It collapses on a phone, where the
              dish sits above the type instead of between the two words. */}
          <span data-gap aria-hidden="true" className="block h-[34vh] lg:h-[46vh]" />
          <span className="block">{second}</span>
        </h2>

        <p className="mx-auto mt-12 max-w-[56ch] text-base leading-relaxed text-ink-soft">
          {final.body}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={final.primaryCta.href}>
            {final.primaryCta.label}
            <span aria-hidden="true">&rarr;</span>
          </Button>
          <Button variant="outline" href={BUSINESS.phoneHref}>
            Call {BUSINESS.phoneDisplay}
          </Button>
        </div>
      </div>
    </section>
  );
}
