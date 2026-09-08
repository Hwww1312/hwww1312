import { BUSINESS, STORY } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";

export function FinalChapter() {
  const { final } = STORY;
  return (
    <section
      id="final"
      aria-labelledby="final-heading"
      className="relative flex min-h-dvh items-start pb-28 pt-[48vh] lg:pt-[22vh]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 text-center sm:px-8">
        <h2
          id="final-heading"
          className="mx-auto max-w-[16ch] text-[length:var(--text-chapter)] leading-[0.96]"
        >
          {final.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mx-auto mt-7 max-w-[44ch] text-base leading-relaxed text-ink-soft">
          {final.body}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={final.primaryCta.href}>{final.primaryCta.label}</Button>
          <Button variant="outline" href={BUSINESS.phoneHref}>
            Call {BUSINESS.phoneDisplay}
          </Button>
        </div>
      </div>
    </section>
  );
}
