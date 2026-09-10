import { BUSINESS, DISHES, REVIEWS, STORY } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";

export function FeaturesChapter() {
  const { value } = STORY;
  return (
    <section id="menu" aria-labelledby="menu-heading" className="relative py-28">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <SectionHeading eyebrow={value.eyebrow} className="lg:col-span-6">
            <span id="menu-heading">{value.headline}</span>
          </SectionHeading>
          <p className="max-w-[52ch] self-end text-base leading-relaxed text-ink-soft lg:col-span-5 lg:col-start-8">
            {value.body}
          </p>
        </div>

        {/* The menu is set as type rather than photographs: the dish itself is
            modelled in the canvas behind, so pictures here would only compete
            with it. Rows, not cards, so the list reads like a printed menu. */}
        <ul className="mt-16 border-t border-ink/15">
          {DISHES.map((dish) => (
            <li
              key={dish.slug}
              className="grid items-baseline gap-x-8 gap-y-1 border-b border-ink/15 py-6 sm:grid-cols-[16rem_1fr]"
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl tracking-tight sm:text-2xl">
                {dish.name}
              </h3>
              <p className="max-w-[52ch] text-sm leading-relaxed text-ink-soft">{dish.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-[62ch] text-sm leading-relaxed text-ink-faint">
          A sample of what the kitchen cooks, not a full menu, and what is running
          changes through the day. Call ahead if you are after something in particular.
        </p>

        {/* Reviews, quoted verbatim from Google. */}
        <div className="mt-28 border-t border-ink/15 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h3 className="text-[length:var(--text-section)] leading-[1.02]">What guests say</h3>
            <div className="flex items-center gap-4">
              <span className="font-[family-name:var(--font-display)] text-5xl font-extrabold leading-none tracking-tight text-jade">
                {BUSINESS.rating}
              </span>
              <div>
                <Stars value={BUSINESS.rating} className="h-4 w-[93px] text-turmeric" />
                <p className="mt-1.5 text-sm text-ink-soft">{BUSINESS.reviewCount} Google reviews</p>
              </div>
            </div>
          </div>

          {/* Three verbatim Google reviews. Cells stretch to a common row
              height so the differing lengths read as one wall, not cards. */}
          <div className="mt-12 grid grid-cols-1 gap-px bg-ink/12 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((review) => (
              <blockquote key={review.author} className="flex flex-col bg-paper p-8 sm:p-10">
                <Stars value={review.rating} className="h-3.5 w-[81px] shrink-0 text-turmeric" />
                <p
                  className={`mt-6 flex-1 font-[family-name:var(--font-display)] leading-snug tracking-tight ${
                    review.featured ? "text-2xl sm:text-[1.6rem]" : "text-xl sm:text-2xl"
                  }`}
                >
                  &ldquo;{review.quote}&rdquo;
                </p>
                <footer className="mt-7 shrink-0 text-sm text-ink-soft">
                  {review.author}
                  <span className="px-2 text-ink/25">/</span>
                  {review.context}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
