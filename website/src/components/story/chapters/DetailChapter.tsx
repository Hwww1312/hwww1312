"use client";

import { STORY_COPY } from "@/data/siteContent";

export function DetailChapter() {
  return (
    <section
      data-chapter="details"
      className="story-chapter absolute inset-0 opacity-0 transition-opacity duration-500"
      aria-label="Chapter 3 — Details"
      aria-hidden="true"
    >
      <div className="page-shell w-full">
        <p className="eyebrow mb-8">03 — Details</p>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {STORY_COPY.details.map((detail, i) => (
            <article
              key={detail.id}
              className="max-w-[28ch] rounded-none bg-lacquer/55 p-4 backdrop-blur-[2px] md:bg-transparent md:p-0 md:backdrop-blur-0"
            >
              <p className="eyebrow mb-3">0{i + 1}</p>
              <h2 className="text-3xl text-paper sm:text-4xl">{detail.title}</h2>
              <p className="mt-4 leading-relaxed text-sage">{detail.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
