"use client";

import { BUSINESS, DISHES, REVIEWS, STORY_COPY } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Image from "next/image";

/** Accessible, non-pinned story when prefers-reduced-motion is set. */
export function ReducedMotionStory() {
  return (
    <div id="story" className="relative z-10">
      <section className="page-shell flex min-h-dvh flex-col justify-end pb-20 pt-28">
        <p className="eyebrow mb-4">{STORY_COPY.hero.eyebrow}</p>
        <h1 className="max-w-[12ch] font-display text-[clamp(2.8rem,7vw,5.8rem)] font-extrabold tracking-tighter text-paper">
          {STORY_COPY.hero.title}
        </h1>
        <p className="mt-5 max-w-[18ch] font-display text-[clamp(1.4rem,3vw,2.4rem)] font-extrabold leading-tight tracking-tight text-lemongrass">
          {STORY_COPY.hero.headline}
        </p>
        <p className="lead mt-6">{STORY_COPY.hero.body}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/contact">{STORY_COPY.hero.primaryCta}</Button>
          <Button href={BUSINESS.phoneHref} variant="frame">
            {STORY_COPY.hero.secondaryCta}
          </Button>
        </div>
      </section>

      <section className="page-shell py-24">
        <SectionHeading
          eyebrow={STORY_COPY.introduction.eyebrow}
          title={STORY_COPY.introduction.title}
          body={STORY_COPY.introduction.body}
        />
      </section>

      <section className="page-shell grid gap-10 py-24 md:grid-cols-3">
        {STORY_COPY.details.map((d, i) => (
          <article key={d.id}>
            <p className="eyebrow mb-3">0{i + 1}</p>
            <h2 className="text-3xl">{d.title}</h2>
            <p className="mt-4 text-sage">{d.body}</p>
          </article>
        ))}
      </section>

      <section className="page-shell py-24">
        <SectionHeading
          eyebrow={STORY_COPY.transformation.eyebrow}
          title={STORY_COPY.transformation.title}
          body={STORY_COPY.transformation.body}
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {DISHES.slice(0, 3).map((dish) => (
            <figure key={dish.slug} className="plate-frame">
              <Image
                src={`/assets/${dish.slug}.jpg`}
                alt={dish.name}
                width={480}
                height={600}
                className="h-full w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="page-shell py-24">
        <SectionHeading
          eyebrow={STORY_COPY.value.eyebrow}
          title={STORY_COPY.value.title}
          body={STORY_COPY.value.body}
        />
        <div className="mt-10 space-y-8">
          {REVIEWS.map((r) => (
            <blockquote key={r.author} className="max-w-[42ch]">
              <p className="text-lg text-paper">“{r.quote}”</p>
              <footer className="mt-3 text-sm text-sage">
                {r.author} · {r.context}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="page-shell py-24 pb-32">
        <SectionHeading
          eyebrow={STORY_COPY.final.eyebrow}
          title={STORY_COPY.final.title}
          body={STORY_COPY.final.body}
        />
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/contact">{STORY_COPY.final.primaryCta}</Button>
          <Button href={BUSINESS.mapsDirections} variant="frame">
            {STORY_COPY.final.secondaryCta}
          </Button>
        </div>
      </section>
    </div>
  );
}
