/**
 * Single source of truth for every word on the site.
 *
 * Provenance is tracked deliberately:
 *   VERIFIED    - taken from the restaurant's Google Business listing.
 *   OWNER       - supplied by the client in the project brief.
 *   PLACEHOLDER - not supplied and not verifiable. Clearly marked, safe to
 *                 edit, and never presented as a factual claim on the page.
 *
 * Do not add achievements, awards, history, prices, chef biographies or
 * technical claims here unless the client supplies them.
 */

/** VERIFIED - Google Business listing. */
export const BUSINESS = {
  /**
   * The brief spells this "Cambodian Foodstar" / "Cambodia Foodstar".
   * The registered listing reads "Cambodian Food Stars", so that is used.
   * Change this one value if the client prefers their spelling.
   */
  name: "Cambodian Food Stars",
  shortName: "Food Stars",
  category: "Cambodian restaurant",
  suburb: "Springvale",
  street: "14 Buckingham Ave",
  locality: "Springvale VIC 3171",
  addressFull: "14 Buckingham Ave, Springvale VIC 3171",
  phoneDisplay: "(03) 9558 5555",
  phoneHref: "tel:+61395585555",
  openingTime: "8:00 am",
  closingTime: "9:00 pm",
  busiest: "6 pm to 8 pm",
  /** Google lists dine in and takeaway as the available service options. */
  serviceOptions: ["Dine in", "Takeaway"] as const,
  /**
   * Google's own per-person range, from 7 reported visits. Shown with that
   * attribution because it is a visitor-reported spread, not a menu price.
   */
  priceRange: "$1 to $120 per person",
  priceRangeSource: "Google, from 7 reports",
  plusCode: "3522+GF Springvale, Victoria",
  rating: 3.8,
  reviewCount: 41,
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent(
      "Cambodian Food Stars, 14 Buckingham Ave, Springvale VIC 3171",
    ),
} as const;

/** PLACEHOLDER - no canonical domain supplied. Update before launch. */
export const SITE_ORIGIN = "https://cambodianfoodstars.com.au";

/**
 * VERIFIED - quoted exactly as written by each reviewer on Google, including
 * their own spelling and spacing. Nothing is tidied up or paraphrased.
 */
export const REVIEWS = [
  {
    quote:
      "What a fantastic restaurant. The food is absolutely amazing, authentic and made with love. We ordered 6 dishes and each was delicious. If you have never tried Cambodian food or love Cambodian food I highly recommend this restaurant. The owners are so lovely and made us feel very at home as well.",
    author: "Julie D",
    context: "Google review",
    rating: 5,
    featured: true,
  },
  {
    quote:
      "World class Lok Lak (fried tender beef cubes) and excellent service, Anna provided excellent food and service, I strongly recommend anyone wanting Cambodian food to come here",
    author: "Mark D",
    context: "Google review",
    rating: 5,
    featured: false,
  },
  {
    quote:
      "Authentic cambodian food. Friendly service. I like the lady boss , very friendly and offer me her own food to try. Multiple dishes from noodles to rice. Look forward to trying other dishes",
    author: "k J",
    context: "Google Local Guide",
    rating: 5,
    featured: false,
  },
] as const;

/**
 * VERIFIED - dishes named on the restaurant's own Google listing.
 * Descriptions report only what the listing itself shows.
 * No prices: none are published.
 */
export const DISHES = [
  { slug: "lok-lak", name: "Lok Lak Pepper Beef", note: "Seared beef with pepper and onion, piled onto fresh lettuce." },
  { slug: "skewers", name: "Beef and Pork Skewers", note: "Marinated in lemongrass and charred over the coals." },
  { slug: "beef-noodle", name: "Beef Noodle Soup", note: "Sliced beef and beef balls in a dark, long simmered broth." },
  { slug: "hotpot", name: "Steamboat", note: "A pot over the burner with egg noodles, greens and fish balls to cook at the table." },
  { slug: "fish-soup", name: "Fish Soup", note: "Fish in a golden broth under coriander and a crisp fried topping." },
  { slug: "seafood-crisp", name: "Seafood and Greens", note: "Prawns, squid and greens over crisp fried egg noodles." },
  { slug: "beef-greens", name: "Beef with Greens", note: "Beef tossed through snake beans, herbs and red onion." },
  { slug: "noodle-balls", name: "Noodles and Fish Balls", note: "Herbs, fried garlic and fish balls in a bowl of broth." },
] as const;

export type Dish = (typeof DISHES)[number];

/**
 * Homepage story copy. Headlines and body are OWNER voice, developed from the
 * client's own description of the restaurant. Nothing here asserts a fact the
 * client did not provide.
 */
export const STORY = {
  hero: {
    eyebrow: "Springvale",
    headline: ["One plate,", "set down with care"],
    body: "A Khmer kitchen on Buckingham Avenue. Dine in or take away, open from 8:00 am.",
    primaryCta: { label: "Reserve a table", href: "/contact" },
    secondaryCta: { label: "See the menu", href: "#menu" },
    scrollCue: "Scroll",
  },
  introduction: {
    eyebrow: "The kitchen",
    headline: "Authentic seasoning, cooked to order",
    body: "Every dish is built on Khmer seasoning: lemongrass, black pepper and a lot of fresh herbs. Nothing sits under a lamp waiting. Our chefs cook each plate when you order it, and send it out the moment it is right.",
  },
  details: {
    eyebrow: "Detail",
    headline: "What arrives at your table",
    beats: [
      {
        id: "seasoning",
        title: "Seasoning first",
        body: "Lemongrass, pepper and herbs are the backbone. The marinade goes on before the heat, not after.",
      },
      {
        id: "heat",
        title: "Cooked to order",
        body: "Plates leave the pass when they are ready, which is why the evening rush is the busiest stretch of the day.",
      },
      {
        id: "table",
        title: "Made for sharing",
        body: "Most of the menu is built for the middle of the table rather than for one person alone.",
      },
    ],
  },
  transformation: {
    eyebrow: "The table",
    headline: "One dish becomes a table",
    body: "Khmer eating is shared. A single plate is never the whole meal, so it opens out: grilled beef, a bowl of long simmered broth, skewers, and a steamboat set over the burner for everyone to cook from.",
  },
  value: {
    eyebrow: "The room",
    headline: "A small room that fills up for a reason",
    body: "Cambodian Food Stars is a neighbourhood kitchen in Springvale. Come for one plate or bring the table.",
  },
  final: {
    headline: ["Book the table.", "We will cook."],
    body: "Reserve online, or call the restaurant directly.",
    primaryCta: { label: "Reserve a table", href: "/contact" },
  },
} as const;

export const NAV_LINKS = [
  { label: "Story", href: "/#story" },
  { label: "Menu", href: "/#menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
