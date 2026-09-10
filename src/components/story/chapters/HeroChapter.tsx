import { STORY } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";

/**
 * Chapter 01.
 *
 * This section sits behind the canvas rather than in front of it, which is
 * the whole trick: the bowl genuinely overlaps the headline instead of
 * floating in a box beside it. The canvas takes no pointer events, so the
 * buttons underneath stay clickable and the type stays selectable.
 */
export function HeroChapter() {
  const { hero } = STORY;
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      // On a phone the bowl owns the upper half, so the copy starts below it.
      className="relative flex min-h-dvh flex-col justify-end pb-20 pt-[27rem] sm:pb-24 lg:justify-center lg:pb-0 lg:pt-24"
    >
      <div className="shell">
        <span className="rise-mask">
          <span
            className="rise block text-[0.7rem] font-medium uppercase tracking-[0.34em] text-turmeric"
            style={{ animationDelay: "1200ms" }}
          >
            {hero.eyebrow}
          </span>
        </span>

        <h1
          id="hero-heading"
          className="display mt-6 max-w-[11ch] text-[length:var(--text-hero)]"
        >
          {hero.headline.map((line, i) => (
            <span key={line} className="rise-mask">
              <span className="rise" style={{ animationDelay: `${1400 + i * 140}ms` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="fade-up mt-9 max-w-[42ch] text-base leading-relaxed text-ink-soft sm:text-lg"
          style={{ animationDelay: "1850ms" }}
        >
          {hero.body}
        </p>

        <div
          className="fade-up mt-11 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "2050ms" }}
        >
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button variant="outline" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </Button>
        </div>

        <p
          aria-hidden="true"
          className="fade-up mt-16 flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-ink-faint"
          style={{ animationDelay: "2400ms" }}
        >
          <span className="h-10 w-px bg-gradient-to-b from-turmeric/70 to-transparent" />
          {hero.scrollCue}
        </p>
      </div>
    </section>
  );
}
