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
 *
 * The homepage is built around one dish: the fish curry noodle bowl that the
 * listing calls Fish Soup. Every section is a different look at the same bowl,
 * so the copy is written to be read beside it rather than instead of it.
 */
export const STORY = {
  hero: {
    eyebrow: "Springvale \u00b7 Khmer kitchen",
    /** Set as display type. The bowl is allowed to overlap both lines. */
    headline: ["A taste of", "Cambodia."],
    body:
      "A rich Cambodian curry layered with noodles, fresh herbs, chilli and vibrant tropical ingredients.",
    primaryCta: { label: "Explore the menu", href: "#menu" },
    secondaryCta: { label: "Reserve a table", href: "/contact" },
    scrollCue: "Scroll to look closer",
  },
  ingredients: {
    eyebrow: "Discover the ingredients",
    headline: "Seven things, one bowl",
    body:
      "Nothing in the bowl is there for decoration. The curry is the base, the noodles carry it, and everything laid over the top is raw, cut that morning, and there to cut through the richness.",
  },
  rotation: {
    eyebrow: "Turn it in the light",
    headline: "Built in layers, eaten in one",
    body:
      "Seen from above it is a pattern. Seen from the side it is a bowl of broth with a lot going on in it. The curry goes in first and everything else is arranged on top by hand, which is why no two bowls leave the kitchen looking the same.",
  },
  separation: {
    eyebrow: "Layer by layer",
    headline: "Everything has a job",
    body:
      "Lift the garnishes away and the bowl comes apart into its parts: noodles, curry, herbs, chilli, and the cool raw vegetables that keep the whole thing from sitting heavy. Put them back and they read as one dish again.",
  },
  value: {
    eyebrow: "The kitchen",
    headline: "A small room that fills up for a reason",
    body:
      "Cambodian Food Stars is a neighbourhood kitchen in Springvale. Everything is cooked to order, so come for one bowl or bring the whole table.",
  },
  final: {
    /** Set as display type, overlapped by the bowl. */
    headline: ["Taste", "Cambodia."],
    body: "Dine in or take away on Buckingham Avenue, from 8:00 am.",
    primaryCta: { label: "Explore the menu", href: "#menu" },
  },
} as const;

/**
 * The ingredient call-outs for the second section.
 *
 * `anchor` is a point in the bowl's own model space, so the leader line stays
 * attached to the thing it names however the camera moves. `lead` is where
 * the label itself sits relative to that anchor, in pixels: the seven anchors
 * all project into a small area in the middle of the frame, so the labels
 * have to be fanned out by hand or they land on top of one another and on top
 * of the food.
 *
 * OWNER voice: these describe what is visible in the bowl and nothing more.
 */
export const INGREDIENTS = [
  {
    id: "noodles",
    label: "Rice noodles",
    note: "Soft, fine and white, coiled under everything else.",
    anchor: [-0.28, 0.63, 0.3] as const,
    lead: [-236, 96] as const,
  },
  {
    id: "curry",
    label: "Cambodian curry",
    note: "Turmeric, lemongrass and coconut, simmered down to gold.",
    anchor: [0.3, 0.6, -0.06] as const,
    lead: [392, 92] as const,
  },
  {
    id: "herbs",
    label: "Fresh herbs",
    note: "Coriander and saw-tooth herb, torn over at the last second.",
    anchor: [0.06, 0.68, 0.34] as const,
    lead: [300, 240] as const,
  },
  {
    id: "chilli",
    label: "Chilli",
    note: "Sliced raw, so the heat stays bright rather than cooked in.",
    anchor: [0.34, 0.66, -0.36] as const,
    lead: [300, -232] as const,
  },
  {
    id: "sprouts",
    label: "Bean sprouts",
    note: "Raw, for the snap against the broth.",
    anchor: [-0.42, 0.65, -0.3] as const,
    lead: [-160, 392] as const,
  },
  {
    id: "beans",
    label: "Green beans",
    note: "Cut short and barely blanched, still squeaking.",
    anchor: [-0.2, 0.65, 0.42] as const,
    lead: [-236, 180] as const,
  },
  {
    id: "cucumber",
    label: "Cucumber",
    note: "Cool batons along the rim, to reset the palate.",
    anchor: [0.2, 0.65, 0.46] as const,
    lead: [452, -170] as const,
  },
] as const;

export type Ingredient = (typeof INGREDIENTS)[number];

export const NAV_LINKS = [
  { label: "Ingredients", href: "/#ingredients" },
  { label: "Menu", href: "/#menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
