"use client";

import Image from "next/image";
import { BUSINESS, DISHES, REVIEWS, STORY_COPY } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturesChapter() {
  const c = STORY_COPY.value;
  const featured = DISHES.slice(0, 3);

  return (
    <section
      data-chapter="value"
      className="story-chapter absolute inset-0 opacity-0 transition-opacity duration-500"
      data-align="start"
      aria-label="Chapter 5 — Visit"
      aria-hidden="true"
    >
      <div className="page-shell grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading eyebrow={c.eyebrow} title={c.title} body={c.body} />
          <div className="mt-10 space-y-8">
            {REVIEWS.map((review) => (
              <blockquote key={review.author} className="max-w-[42ch]">
                <p className="text-lg leading-relaxed text-paper">
                  “{review.quote}”
                </p>
                <footer className="mt-3 text-sm text-sage">
                  {review.author} · {review.context}
                </footer>
              </blockquote>
            ))}
          </div>
          <p className="mt-8 text-sm text-sage">
            Rated {BUSINESS.rating} / 5 from {BUSINESS.reviewCount} Google
            reviews.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {featured.map((dish) => (
            <figure key={dish.slug} className="plate-frame max-h-[280px]">
              <Image
                src={`/assets/${dish.slug}.jpg`}
                alt={dish.name}
                width={640}
                height={800}
                className="h-full w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-lacquer/90 to-transparent p-4 text-sm">
                {dish.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
