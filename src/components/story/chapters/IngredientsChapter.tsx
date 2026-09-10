import { INGREDIENTS, STORY } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Chapter 02.
 *
 * The camera climbs towards a top-down read and the seven call-outs are drawn
 * around the dish. Those call-outs are decoration, so the same seven names
 * are set here as real text — and on a phone, where the labels are dropped
 * rather than crammed around a small bowl, this list is the whole feature.
 */
export function IngredientsChapter() {
  const { ingredients } = STORY;
  return (
    <section
      id="ingredients"
      aria-labelledby="ingredients-heading"
      data-tall
      className="relative flex min-h-[190vh] items-start pb-32 pt-[42vh] lg:items-center lg:py-40"
    >
      <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={ingredients.eyebrow}>
            <span id="ingredients-heading">{ingredients.headline}</span>
          </SectionHeading>
          <p className="mt-8 max-w-[26ch] text-base leading-relaxed text-ink-soft">
            {ingredients.body}
          </p>

          {/* On a wide screen the projected call-outs carry all of this, so the
              printed list steps back to assistive technology rather than
              competing with them. On a phone it is the whole feature. */}
          <ol className="mt-12 border-t border-ink/15 lg:sr-only">
            {INGREDIENTS.map((item, i) => (
              <li
                key={item.id}
                className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b border-ink/15 py-4"
              >
                <span className="font-[family-name:var(--font-display)] text-xs tracking-[0.1em] text-turmeric">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-sm font-medium uppercase tracking-[0.14em]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                    {item.note}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
