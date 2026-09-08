"use client";

import { STORY_COPY } from "@/data/siteContent";

export function DetailChapter() {
  return (
    <section
      data-chapter="details"
      className="story-chapter absolute inset-0 opacity-0 transition-opacity duration-500"
      data-align="center"
      aria-label="Chapter 3 — Details"
      aria-hidden="true"
    >
      <div className="page-shell grid w-full gap-10 md:grid-cols-3">
        {STORY_COPY.details.map((detail, i) => (
          <article key={detail.id} className="max-w-[28ch]">
            <p className="eyebrow mb-3">0{i + 1}</p>
            <h2 className="text-3xl text-paper sm:text-4xl">{detail.title}</h2>
            <p className="mt-4 text-sage leading-relaxed">{detail.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
