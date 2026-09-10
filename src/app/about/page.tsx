import type { Metadata } from "next";
import { BUSINESS, DISHES, STORY } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description: `${BUSINESS.name} is a Khmer kitchen at ${BUSINESS.addressFull}, cooking to order.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-[22vh] sm:px-8">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-jade">
        About
      </p>
      <h1 className="mt-5 max-w-[16ch] text-[length:var(--text-chapter)] leading-[0.98]">
        {STORY.introduction.headline}
      </h1>

      <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-6 text-base leading-relaxed text-ink-soft lg:col-span-6">
          <p>{STORY.introduction.body}</p>
          <p>{STORY.transformation.body}</p>
          <p>
            The room is on Buckingham Avenue in Springvale. You can eat in or take
            away, and the kitchen is busiest through the evening.
          </p>
          <div className="pt-4">
            <Button href="/contact">Reserve a table</Button>
          </div>
        </div>

        {/* Every figure below is from the Google Business listing. */}
        <dl className="lg:col-span-5 lg:col-start-8">
          <h2 className="sr-only">Restaurant details</h2>
          <div className="divide-y divide-ink/15 border-y border-ink/15">
            {[
              ["Cuisine", BUSINESS.category],
              ["Address", BUSINESS.addressFull],
              ["Phone", BUSINESS.phoneDisplay],
              ["Hours", `${BUSINESS.openingTime} to ${BUSINESS.closingTime}`],
              ["Service", BUSINESS.serviceOptions.join(" / ")],
              ["Rating", `${BUSINESS.rating} from ${BUSINESS.reviewCount} Google reviews`],
              ["Typical spend", `${BUSINESS.priceRange} (${BUSINESS.priceRangeSource})`],
              ["Plus code", BUSINESS.plusCode],
            ].map(([term, value]) => (
              <div key={term} className="grid grid-cols-3 gap-4 py-4">
                <dt className="text-sm uppercase tracking-[0.14em] text-ink-soft">{term}</dt>
                <dd className="col-span-2 text-base">{value}</dd>
              </div>
            ))}
          </div>
        </dl>
      </div>

      <h2 className="mt-24 text-[length:var(--text-section)] leading-[1.02]">
        From the kitchen
      </h2>
      <ul className="mt-10 border-t border-ink/15">
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
        A sample of what the kitchen cooks, not a full menu. What is running
        changes through the day.
      </p>
    </div>
  );
}
