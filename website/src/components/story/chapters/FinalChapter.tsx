"use client";

import { BUSINESS, STORY_COPY } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FinalChapter() {
  const c = STORY_COPY.final;
  return (
    <section
      data-chapter="final"
      className="story-chapter absolute inset-0 opacity-0 transition-opacity duration-500"
      aria-label="Chapter 6 — Invitation"
      aria-hidden="true"
    >
      <div className="page-shell w-full">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} body={c.body} />
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href="/contact">{c.primaryCta}</Button>
          <Button href={BUSINESS.mapsDirections} variant="frame">
            {c.secondaryCta}
          </Button>
        </div>
        <p className="mt-8 text-sage">
          {BUSINESS.addressFull}
          <br />
          <a href={BUSINESS.phoneHref} className="text-lemongrass hover:text-paper">
            {BUSINESS.phoneDisplay}
          </a>
        </p>
      </div>
    </section>
  );
}
