"use client";

import { STORY_COPY } from "@/data/siteContent";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TransformationChapter() {
  const c = STORY_COPY.transformation;
  return (
    <section
      data-chapter="transformation"
      className="story-chapter absolute inset-0 opacity-0 transition-opacity duration-500"
      aria-label="Chapter 4 — Transformation"
      aria-hidden="true"
    >
      <div className="page-shell w-full">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} body={c.body} />
      </div>
    </section>
  );
}
