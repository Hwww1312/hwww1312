/**
 * Every fact comes from the restaurant's Google Business listing or from
 * what is visibly shown in the restaurant's own photographs.
 * [EDITABLE] placeholders are marked where no published fact exists.
 */

export const BUSINESS = {
  name: "Cambodian Food Stars",
  shortName: "Food Stars",
  category: "Cambodian restaurant",
  suburb: "Springvale",
  street: "14 Buckingham Ave",
  locality: "Springvale VIC 3171",
  addressFull: "14 Buckingham Ave, Springvale VIC 3171",
  phoneDisplay: "(03) 9558 5555",
  phoneHref: "tel:+61395585555",
  emailDisplay: "[EDITABLE: reservations@example.com]",
  emailHref: "mailto:reservations@example.com",
  closingTime: "9:00 pm",
  busiest: "6 pm to 8 pm",
  rating: 3.8,
  reviewCount: 41,
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(
      "Cambodian Food Stars, 14 Buckingham Ave, Springvale VIC 3171",
    ),
  mapsPlace:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Cambodian Food Stars, 14 Buckingham Ave, Springvale VIC 3171",
    ),
  origin: "https://cambodian-food-stars.higgsfield.app",
} as const;

export const REVIEWS = [
  {
    quote:
      "What a fantastic restaurant. The food is absolutely amazing, authentic and made with love.",
    author: "Julie D",
    context: "Google review",
    rating: 5,
  },
  {
    quote:
      "Authentic cambodian food. Friendly service. I like the lady boss , very friendly and offer me her own food to try.",
    author: "k J",
    context: "Google Local Guide",
    rating: 5,
  },
] as const;

export const DISHES = [
  {
    slug: "lok-lak",
    name: "Lok Lak Pepper Beef",
    note: "Seared beef with pepper and onion, piled onto fresh lettuce.",
  },
  {
    slug: "beef-noodle",
    name: "Beef Noodle Soup",
    note: "Sliced beef and beef balls in a dark, long simmered broth.",
  },
  {
    slug: "skewers",
    name: "Lemongrass Chicken Skewers",
    note: "Charred skewers with cucumber and a bowl of dipping broth.",
  },
  {
    slug: "hotpot",
    name: "Steamboat",
    note: "A pot over the burner with egg noodles, greens and fish balls to cook at the table.",
  },
  {
    slug: "fish-soup",
    name: "Fish Soup",
    note: "Fish in a golden broth under coriander and a crisp fried topping.",
  },
  {
    slug: "seafood-crisp",
    name: "Seafood and Greens",
    note: "Prawns, squid and greens over crisp fried egg noodles.",
  },
  {
    slug: "beef-greens",
    name: "Beef with Greens",
    note: "Beef tossed through snake beans, herbs and red onion.",
  },
] as const;

export const NAV_LINKS = [
  { href: "/#story", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Reserve" },
] as const;

export const STORY_COPY = {
  hero: {
    eyebrow: "Springvale",
    title: "Cambodian Food Stars",
    headline: "A plate lit for the table",
    body: "Authentic Khmer seasoning, cooked with care — lok lak, noodle soups, and steamboat on Buckingham Avenue.",
    primaryCta: "Reserve a table",
    secondaryCta: "Call the kitchen",
    scrollCue: "Scroll the story",
  },
  introduction: {
    eyebrow: "02 — Discover",
    title: "Khmer cooking, close to home",
    body: "We serve many yummy and delicious Cambodian dishes with authentic seasoning — prepared by chefs who finish every plate with care.",
  },
  details: [
    {
      id: "seasoning",
      title: "Authentic seasoning",
      body: "Pepper, lemongrass, and long-simmered broths — flavours that define a Khmer plate.",
    },
    {
      id: "fire",
      title: "Cooked with care",
      body: "From seared lok lak to a pot over the burner — heat, timing, and a finished meal.",
    },
    {
      id: "share",
      title: "Made for sharing",
      body: "Steamboat, skewers, and greens for the table — dishes meant to be passed around.",
    },
  ],
  transformation: {
    eyebrow: "04 — The table",
    title: "From kitchen heat to shared meal",
    body: "Watch the plate become the evening: a steamboat moment where the table cooks together.",
  },
  value: {
    eyebrow: "05 — Visit",
    title: "On Buckingham Avenue",
    body: `Open until ${BUSINESS.closingTime}. Busiest between ${BUSINESS.busiest}. Rated ${BUSINESS.rating} from ${BUSINESS.reviewCount} Google reviews.`,
  },
  final: {
    eyebrow: "06 — Join us",
    title: "Book your table",
    body: "Reserve online or call the kitchen. We will confirm your booking by phone or email.",
    primaryCta: "Reserve a table",
    secondaryCta: "Get directions",
  },
} as const;

export const ABOUT_COPY = {
  title: "About the kitchen",
  lead: "Cambodian Food Stars is a Cambodian restaurant in Springvale, Melbourne — a neighbourhood kitchen for authentic Khmer dishes.",
  paragraphs: [
    "We sell many yummy and delicious Cambodian dishes with authentic seasoning. Our chefs aim for a well-done meal for every guest who sits down.",
    "The photographs on this site are the restaurant’s own plates: lok lak pepper beef, beef noodle soup, lemongrass chicken skewers, steamboat, fish soup, seafood with greens, and beef with greens.",
    "[EDITABLE: Add a short owner or family story here when you are ready. Do not invent history.]",
  ],
} as const;
