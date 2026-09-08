import Image from "next/image";
import { BUSINESS, DISHES, REVIEWS, STORY } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";

export function FeaturesChapter() {
  const { value } = STORY;
  return (
    <section id="menu" aria-labelledby="menu-heading" className="relative py-28">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <SectionHeading eyebrow={value.eyebrow} className="lg:col-span-6">
            <span id="menu-heading">{value.headline}</span>
          </SectionHeading>
          <p className="max-w-[52ch] self-end text-base leading-relaxed text-sage lg:col-span-5 lg:col-start-8">
            {value.body}
          </p>
        </div>

        {/* Dish gallery. A multi-column cascade rather than a grid: columns
            flow independently, so the staggered offsets can never collide the
            way absolutely placed grid items do. */}
        <ul className="mt-20 gap-x-8 sm:columns-2 lg:columns-3 lg:gap-x-10">
          {DISHES.map((dish, i) => (
            <li
              key={dish.slug}
              className="mb-14 break-inside-avoid"
              style={{ marginTop: i % 3 === 1 ? "3.5rem" : undefined }}
            >
              <figure>
                <div className="relative overflow-hidden border border-ivory/12 bg-lacquer-2">
                  <Image
                    src={`/images/dishes/${dish.slug}.jpg`}
                    alt={`${dish.name} at ${BUSINESS.name}`}
                    width={dish.w}
                    height={dish.h}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                    priority={i < 2}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <figcaption className="mt-4 border-t border-ivory/12 pt-4">
                  <h3 className="text-xl font-bold tracking-tight">{dish.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-sage">{dish.note}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/* Reviews, quoted verbatim from Google. */}
        <div className="mt-28 border-t border-ivory/15 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h3 className="text-[length:var(--text-section)] leading-[1.02]">What guests say</h3>
            <div className="flex items-center gap-4">
              <span className="font-[family-name:var(--font-display)] text-5xl font-extrabold leading-none tracking-tighter text-lemongrass">
                {BUSINESS.rating}
              </span>
              <div>
                <Stars value={BUSINESS.rating} className="h-4 w-[93px] text-lemongrass" />
                <p className="mt-1.5 text-sm text-sage">{BUSINESS.reviewCount} Google reviews</p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-px bg-ivory/15 md:grid-cols-2">
            {REVIEWS.map((review) => (
              <blockquote key={review.author} className="bg-lacquer p-8 sm:p-10">
                <Stars value={review.rating} className="h-3.5 w-[81px] text-lemongrass" />
                <p className="mt-6 font-[family-name:var(--font-display)] text-2xl leading-snug tracking-tight sm:text-[1.7rem]">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <footer className="mt-7 text-sm text-sage">
                  {review.author}
                  <span className="px-2 text-ivory/25">/</span>
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
