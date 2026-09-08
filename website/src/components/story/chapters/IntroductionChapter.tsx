"use client";

import { STORY_COPY } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function IntroductionChapter() {
  const c = STORY_COPY.introduction;
  return (
    <section
      data-chapter="introduction"
      className="story-chapter absolute inset-0 opacity-0 transition-opacity duration-500"
      data-align="center"
      aria-label="Chapter 2 — Discover"
      aria-hidden="true"
    >
      <div className="page-shell w-full max-w-[720px]">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} body={c.body} />
      </div>
    </section>
  );
}
