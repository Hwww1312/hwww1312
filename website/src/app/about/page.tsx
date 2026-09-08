import type { Metadata } from "next";
import Image from "next/image";
import { ABOUT_COPY, BUSINESS, DISHES } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description: `About ${BUSINESS.name}, a Cambodian restaurant in Springvale.`,
};

export default function AboutPage() {
  return (
    <div className="pb-24 pt-28">
      <div className="page-shell">
        <SectionHeading
          eyebrow="About"
          title={ABOUT_COPY.title}
          body={ABOUT_COPY.lead}
        />
        <div className="mt-12 max-w-[62ch] space-y-6 text-lg leading-relaxed text-sage">
          {ABOUT_COPY.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/contact">Reserve a table</Button>
          <Button href={BUSINESS.phoneHref} variant="frame">
            Call {BUSINESS.phoneDisplay}
          </Button>
        </div>
      </div>

      <section className="page-shell mt-24">
        <h2 className="mb-10 text-4xl sm:text-5xl">Dishes from our kitchen</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DISHES.map((dish) => (
            <figure key={dish.slug} className="group">
              <div className="plate-frame">
                <Image
                  src={`/assets/${dish.slug}.jpg`}
                  alt={dish.name}
                  width={640}
                  height={800}
                  className="transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-4">
                <h3 className="text-xl text-paper">{dish.name}</h3>
                <p className="mt-2 text-sm text-sage">{dish.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-sm text-sage">
          Descriptions report what is visible in the restaurant&apos;s own
          photographs. Prices are not listed because none are published.
        </p>
      </section>
    </div>
  );
}
