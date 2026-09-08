import { STORY } from "@/data/siteContent";
import { Button } from "@/components/ui/Button";

export function HeroChapter() {
  const { hero } = STORY;
  return (
    <section
      id="reveal"
      aria-labelledby="hero-heading"
      className="relative flex min-h-dvh flex-col justify-end pb-20 pt-28 sm:pb-28"
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8">
        <span className="rise-mask">
          <span className="rise text-xs font-medium uppercase tracking-[0.28em] text-lemongrass">
            {hero.eyebrow}
          </span>
        </span>

        <h1
          id="hero-heading"
          className="mt-5 max-w-[14ch] text-[length:var(--text-hero)] font-extrabold leading-[0.9]"
        >
          {hero.headline.map((line, i) => (
            <span key={line} className="rise-mask">
              <span className="rise" style={{ animationDelay: `${60 + i * 90}ms` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="mt-7 max-w-[46ch] text-base leading-relaxed text-sage sm:text-lg">
          {hero.body}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button variant="outline" href={hero.secondaryCta.href}>
            {hero.secondaryCta.label}
          </Button>
        </div>

        <p
          aria-hidden="true"
          className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-sage-dim"
        >
          <span className="h-8 w-px bg-gradient-to-b from-lemongrass to-transparent" />
          {hero.scrollCue}
        </p>
      </div>
    </section>
  );
}
