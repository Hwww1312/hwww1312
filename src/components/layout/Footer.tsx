import Link from "next/link";
import { BUSINESS, NAV_LINKS } from "@/data/siteContent";
import { Mark } from "@/components/ui/Mark";

export function Footer() {
  return (
    // Sits above the story canvas, which is fixed and would otherwise keep
    // painting the bowl over the footer for the length of the page.
    <footer className="relative z-30 border-t border-ink/15 bg-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">Call the restaurant</p>
        <a
          href={BUSINESS.phoneHref}
          className="mt-6 block font-[family-name:var(--font-display)] text-[13vw] font-extrabold leading-[0.86] tracking-tighter transition-colors duration-300 hover:text-turmeric sm:text-[11vw] lg:text-[8.5vw]"
        >
          {BUSINESS.phoneDisplay}
        </a>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-ink/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2.5">
              <Mark className="h-5 w-5 text-turmeric" />
              <span className="font-[family-name:var(--font-display)] text-[15px] font-extrabold tracking-tight">
                {BUSINESS.name}
              </span>
            </p>
            <p className="mt-3 text-sm text-ink-soft">{BUSINESS.category}</p>
          </div>

          <address className="text-sm not-italic text-ink-soft">
            <p className="text-ink">{BUSINESS.street}</p>
            <p>{BUSINESS.locality}</p>
            <a
              href={BUSINESS.mapsDirections}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-ink underline decoration-turmeric/45 underline-offset-4 hover:decoration-turmeric"
            >
              Get directions
            </a>
          </address>

          <div className="text-sm text-ink-soft">
            <p className="text-ink">
              {BUSINESS.openingTime} to {BUSINESS.closingTime}
            </p>
            <p className="mt-1">Busiest {BUSINESS.busiest}</p>
            <p className="mt-1">{BUSINESS.serviceOptions.join(" / ")}</p>
            <p className="mt-3">Opening times can change, so call before you travel.</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2 text-sm text-ink-soft">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ink">
                {link.label}
              </Link>
            ))}
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
          </nav>
        </div>

        <p className="mt-12 border-t border-ink/10 pt-8 text-xs text-ink-faint">
          Listing details and reviews from the restaurant&rsquo;s Google Business
          profile. All imagery on this site is generated, not photographic.
        </p>
      </div>
    </footer>
  );
}
