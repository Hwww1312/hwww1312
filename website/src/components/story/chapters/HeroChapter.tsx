"use client";

import { BUSINESS, STORY_COPY } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HeroChapter() {
  const c = STORY_COPY.hero;
  return (
    <section
      data-chapter="reveal"
      className="story-chapter absolute inset-0 transition-opacity duration-500"
      aria-label="Chapter 1 — Reveal"
    >
      <div className="page-shell w-full pb-8">
        <p className="eyebrow mb-4">{c.eyebrow}</p>
        <p className="mb-3 font-display text-xl font-extrabold tracking-tight text-lemongrass sm:text-2xl">
          {c.title}
        </p>
        <SectionHeading as="h1" title={c.headline} body={c.body} />
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href="/contact">{c.primaryCta}</Button>
          <Button href={BUSINESS.phoneHref} variant="frame">
            {c.secondaryCta}
          </Button>
        </div>
        <p className="scroll-cue mt-12">{c.scrollCue}</p>
      </div>
    </section>
  );
}
