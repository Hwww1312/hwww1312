import { createFileRoute } from "@tanstack/react-router";
import { BUSINESS, DISHES, REVIEWS } from "../lib/business";
import { useParallax } from "../lib/parallax";
import {
  CallPrimary,
  DirectionsInline,
  Mark,
  MenuAnchor,
  NavCall,
  PhoneMonolith,
  Stars,
} from "../components/site/chrome";

export const Route = createFileRoute("/")({ component: Index });

const LD_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: BUSINESS.name,
  servesCuisine: "Cambodian",
  telephone: "+61 3 9558 5555",
  url: BUSINESS.origin,
  image: `${BUSINESS.origin}/assets/hero-poster.jpg`,
  hasMap: BUSINESS.mapsDirections,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.street,
    addressLocality: BUSINESS.suburb,
    addressRegion: "VIC",
    postalCode: "3171",
    addressCountry: "AU",
  },
});

/* Photograph in a hairline frame. The image itself is the parallax layer, so
   it is oversized and the frame clips it. */
function DishFrame({
  slug,
  alt,
  ratio,
  speed,
}: {
  slug: string;
  alt: string;
  ratio: string;
  speed: number;
}) {
  return (
    <div
      className="relative w-full overflow-hidden border border-paper/12 bg-lacquer-2"
      style={{ aspectRatio: ratio }}
    >
      <img
        src={`/assets/${slug}.jpg`}
        alt={alt}
        loading="lazy"
        decoding="async"
        data-parallax={speed}
        data-parallax-clamp="60"
        className="absolute left-0 top-[-7%] h-[114%] w-full object-cover"
      />
    </div>
  );
}

function Index() {
  useParallax();

  return (
    <div className="bg-lacquer text-paper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: LD_JSON }} />

      {/* ---------------- nav: single line, 68px tall ---------------- */}
      <header className="fixed inset-x-0 top-0 z-50 h-[68px] bg-gradient-to-b from-lacquer/95 to-lacquer/0 backdrop-blur-[2px]">
        <nav className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <Mark className="h-6 w-6 text-lemongrass" />
            <span className="font-display text-[15px] font-extrabold tracking-tight">
              Cambodian Food Stars
            </span>
          </a>
          {/* Section links are desktop only; the phone stays reachable on mobile. */}
          <div className="flex items-center gap-7">
            <div className="hidden items-center gap-7 text-sm text-sage md:flex">
              <a href="#menu" className="transition-colors hover:text-paper">Menu</a>
              <a href="#reviews" className="transition-colors hover:text-paper">Reviews</a>
              <a href="#visit" className="transition-colors hover:text-paper">Visit</a>
            </div>
            <NavCall />
          </div>
        </nav>
      </header>

      {/* ---------------- hero: full bleed film ---------------- */}
      <section id="top" className="relative flex min-h-dvh flex-col justify-end overflow-hidden">
        <div
          data-parallax="0.22"
          data-parallax-clamp="130"
          className="absolute inset-x-0 top-[-9%] -z-20 h-[124%]"
        >
          <video
            className="h-full w-full object-cover"
            poster="/assets/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Dishes from the Cambodian Food Stars kitchen"
          >
            <source src="/assets/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,28,24,0.72)_0%,rgba(7,28,24,0.18)_38%,rgba(7,28,24,0.86)_82%,rgba(7,28,24,1)_100%)]" />

        <div
          data-parallax="-0.06"
          data-parallax-clamp="70"
          className="mx-auto w-full max-w-[1400px] px-5 pb-20 pt-24 sm:px-8 sm:pb-28"
        >
          <span className="cfs-mask">
            <span className="cfs-rise text-xs font-medium uppercase tracking-[0.28em] text-lemongrass">
              Springvale
            </span>
          </span>
          <h1 className="mt-5 max-w-[15ch] font-display text-5xl font-extrabold leading-[0.95] tracking-tighter sm:text-7xl lg:text-[5.6rem]">
            <span className="cfs-mask">
              <span className="cfs-rise" style={{ animationDelay: "60ms" }}>
                A Cambodian kitchen
              </span>
            </span>
            <span className="cfs-mask">
              <span className="cfs-rise" style={{ animationDelay: "150ms" }}>
                in Springvale
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-sage sm:text-lg">
            Lok lak, beef noodle soup and steamboat, served on Buckingham Avenue
            until {BUSINESS.closingTime}.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <CallPrimary />
            <MenuAnchor />
          </div>
        </div>
      </section>

      {/* ---------------- about: editorial offset ---------------- */}
      <section className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 lg:col-start-1">
            <h2 className="max-w-[16ch] font-display text-4xl font-extrabold leading-[1.02] tracking-tighter sm:text-5xl">
              Khmer food, cooked to order
            </h2>
            <div className="mt-8 max-w-[60ch] space-y-5 text-base leading-relaxed text-sage">
              <p>
                {BUSINESS.name} is a Khmer kitchen on Buckingham Avenue in
                Springvale. The cooking leans on lemongrass, black pepper and a
                lot of fresh herbs, and much of the menu is built for sharing:
                plates of grilled beef, bowls of long simmered broth, and a
                steamboat set down in the middle of the table for everyone to
                cook from.
              </p>
              <p>
                Google visitors highlight the authentic Cambodian cuisine. The
                kitchen cooks to order, and the evening rush between{" "}
                {BUSINESS.busiest} is the busiest stretch of the day.
              </p>
            </div>
            <p className="mt-8 text-base">
              <DirectionsInline />
            </p>
          </div>

          {/* Macro crop carrying the brand colour: the page's second read. */}
          <div className="lg:col-span-5 lg:col-start-8">
            <DishFrame
              slug="noodle-balls"
              alt="Herbs, fried garlic and fish balls in a bowl of broth"
              ratio="431 / 405"
              speed={0.14}
            />
            <dl
              data-parallax="-0.1"
              data-parallax-clamp="46"
              className="cfs-rules mt-6 grid grid-cols-3 border-t border-paper/15 pt-6"
            >
              <div className="px-1">
                <dt className="text-xs uppercase tracking-[0.16em] text-sage">Rated</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold tracking-tight">
                  {BUSINESS.rating}
                </dd>
              </div>
              <div className="px-1">
                <dt className="text-xs uppercase tracking-[0.16em] text-sage">Reviews</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold tracking-tight">
                  {BUSINESS.reviewCount}
                </dd>
              </div>
              <div className="px-1">
                <dt className="text-xs uppercase tracking-[0.16em] text-sage">Closes</dt>
                <dd className="mt-1 font-display text-2xl font-extrabold tracking-tight">9pm</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ---------------- menu: off grid gallery ---------------- */}
      <section id="menu" className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="border-t border-paper/15 pt-10">
          <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tighter sm:text-5xl">
            From the kitchen
          </h2>
          <p className="mt-4 max-w-[56ch] text-base leading-relaxed text-sage">
            Photographed at the restaurant. The kitchen cooks to order, so call
            ahead to check what is running today.
          </p>
        </div>

        {/* One column on phones, two on tablets, an offset cascade on desktop. */}
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-y-6">
          {DISHES.map((dish, i) => {
            const place = [
              "lg:col-span-4 lg:col-start-1",
              "lg:col-span-5 lg:col-start-7 lg:mt-28",
              "lg:col-span-4 lg:col-start-2 lg:-mt-4",
              "lg:col-span-6 lg:col-start-7 lg:-mt-10",
              "lg:col-span-5 lg:col-start-1 lg:mt-8",
              "lg:col-span-4 lg:col-start-8 lg:mt-16",
              "lg:col-span-7 lg:col-start-2 lg:mt-4",
            ][i];
            const speed = [0.1, -0.08, 0.13, -0.06, 0.11, -0.1, 0.08][i];
            return (
              <figure key={dish.slug} className={place}>
                <DishFrame
                  slug={dish.slug}
                  alt={`${dish.name} at ${BUSINESS.name}`}
                  ratio={`${dish.w} / ${dish.h}`}
                  speed={speed}
                />
                <figcaption className="mt-4 border-t border-paper/12 pt-4">
                  <h3 className="font-display text-xl font-bold tracking-tight">{dish.name}</h3>
                  <p className="mt-1.5 max-w-[42ch] text-sm leading-relaxed text-sage">
                    {dish.note}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* ---------------- reviews: quote wall ---------------- */}
      <section id="reviews" className="border-y border-paper/15 bg-lacquer-2">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tighter sm:text-5xl">
              What guests say
            </h2>
            <div className="flex items-center gap-4">
              <span className="font-display text-5xl font-extrabold leading-none tracking-tighter text-lemongrass">
                {BUSINESS.rating}
              </span>
              <div>
                <Stars value={BUSINESS.rating} className="h-4 w-[93px] text-lemongrass" />
                <p className="mt-1.5 text-sm text-sage">
                  {BUSINESS.reviewCount} Google reviews
                </p>
              </div>
            </div>
          </div>

          {/* Stacked on phones, side by side from tablet up. */}
          <div className="mt-14 grid grid-cols-1 gap-px bg-paper/15 md:grid-cols-2">
            {REVIEWS.map((review) => (
              <blockquote key={review.author} className="bg-lacquer-2 p-8 sm:p-10">
                <Stars value={review.rating} className="h-3.5 w-[81px] text-lemongrass" />
                <p className="mt-6 font-display text-2xl leading-snug tracking-tight sm:text-[1.7rem]">
                  &#8220;{review.quote}&#8221;
                </p>
                <footer className="mt-7 text-sm text-sage">
                  {review.author}
                  <span className="px-2 text-paper/25">/</span>
                  {review.context}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- visit: colour blocked diptych ---------------- */}
      <section id="visit" className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-2">
        <div className="order-2 px-5 py-20 sm:px-8 sm:py-24 lg:order-1 lg:pr-16">
          <span className="text-xs font-medium uppercase tracking-[0.28em] text-lemongrass">
            Visit
          </span>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tighter sm:text-5xl">
            Find us
          </h2>

          <dl className="mt-12 divide-y divide-paper/15 border-y border-paper/15">
            <div className="grid grid-cols-3 gap-4 py-5">
              <dt className="text-sm uppercase tracking-[0.14em] text-sage">Address</dt>
              <dd className="col-span-2 text-base">
                {BUSINESS.street}
                <br />
                {BUSINESS.locality}
                <span className="mt-3 block text-[15px]">
                  <DirectionsInline />
                </span>
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-5">
              <dt className="text-sm uppercase tracking-[0.14em] text-sage">Phone</dt>
              <dd className="col-span-2 text-base">
                <a
                  href={BUSINESS.phoneHref}
                  className="underline decoration-lemongrass/45 underline-offset-4 transition-colors hover:text-lemongrass"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-5">
              <dt className="text-sm uppercase tracking-[0.14em] text-sage">Hours</dt>
              <dd className="col-span-2 text-base">
                Closes {BUSINESS.closingTime}
                <span className="mt-2 block text-[15px] text-sage">
                  Busiest {BUSINESS.busiest}
                </span>
                <span className="mt-3 block text-[15px] text-sage">
                  Opening times can change, so call before you travel.
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative order-1 min-h-[52vh] overflow-hidden border-paper/15 lg:order-2 lg:min-h-full lg:border-l">
          <img
            src="/assets/skewers.jpg"
            alt="Lemongrass chicken skewers with cucumber and dipping broth"
            loading="lazy"
            decoding="async"
            data-parallax="0.16"
            data-parallax-clamp="90"
            className="absolute left-0 top-[-8%] h-[116%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,28,24,0.35),rgba(7,28,24,0.05))]" />
        </div>
      </section>

      {/* ---------------- footer: banner ---------------- */}
      <footer className="border-t border-paper/15 bg-lacquer">
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24">
          <p className="text-sm uppercase tracking-[0.2em] text-sage">Call the restaurant</p>
          <div className="mt-6">
            <PhoneMonolith />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 border-t border-paper/15 pt-10 sm:grid-cols-3">
            <div>
              <p className="flex items-center gap-2.5">
                <Mark className="h-5 w-5 text-lemongrass" />
                <span className="font-display text-[15px] font-extrabold tracking-tight">
                  {BUSINESS.name}
                </span>
              </p>
              <p className="mt-3 text-sm text-sage">{BUSINESS.category}</p>
            </div>
            <div className="text-sm text-sage">
              <p className="text-paper">{BUSINESS.street}</p>
              <p>{BUSINESS.locality}</p>
              <p className="mt-3">
                <DirectionsInline />
              </p>
            </div>
            <div className="text-sm text-sage">
              <p className="text-paper">Closes {BUSINESS.closingTime}</p>
              <p className="mt-3">
                Listing details and photographs from the restaurant&#8217;s Google
                Business profile.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
