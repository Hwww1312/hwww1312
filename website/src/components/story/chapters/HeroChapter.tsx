"use client";

import { BUSINESS, STORY_COPY } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";

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
        <h1 className="max-w-[12ch] font-display text-[clamp(2.8rem,7vw,5.8rem)] font-extrabold tracking-tighter text-paper">
          {c.title}
        </h1>
        <p className="mt-5 max-w-[18ch] font-display text-[clamp(1.4rem,3vw,2.4rem)] font-extrabold leading-tight tracking-tight text-lemongrass">
          {c.headline}
        </p>
        <p className="lead mt-6">{c.body}</p>
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
