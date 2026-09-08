/**
 * Every fact on this page comes from the restaurant's own Google Business
 * listing. Nothing here is invented: no prices, no awards, no history.
 */
export const BUSINESS = {
  name: "Cambodian Food Stars",
  category: "Cambodian restaurant",
  suburb: "Springvale",
  street: "14 Buckingham Ave",
  locality: "Springvale VIC 3171",
  addressFull: "14 Buckingham Ave, Springvale VIC 3171",
  phoneDisplay: "(03) 9558 5555",
  phoneHref: "tel:+61395585555",
  closingTime: "9:00 pm",
  busiest: "6 pm to 8 pm",
  rating: 3.8,
  reviewCount: 41,
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=" +
    encodeURIComponent("Cambodian Food Stars, 14 Buckingham Ave, Springvale VIC 3171"),
  origin: "https://cambodian-food-stars.higgsfield.app",
} as const;

/** Verbatim Google reviews. Quoted exactly as written by the reviewer. */
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

/**
 * Dishes the restaurant photographed for its own listing. Descriptions
 * report what is visible in those photographs. No prices are listed
 * because none are published.
 */
export const DISHES = [
  { slug: "lok-lak", name: "Lok Lak Pepper Beef", note: "Seared beef with pepper and onion, piled onto fresh lettuce.", w: 426, h: 520 },
  { slug: "beef-noodle", name: "Beef Noodle Soup", note: "Sliced beef and beef balls in a dark, long simmered broth.", w: 602, h: 455 },
  { slug: "skewers", name: "Lemongrass Chicken Skewers", note: "Charred skewers with cucumber and a bowl of dipping broth.", w: 466, h: 540 },
  { slug: "hotpot", name: "Steamboat", note: "A pot over the burner with egg noodles, greens and fish balls to cook at the table.", w: 740, h: 680 },
  { slug: "fish-soup", name: "Fish Soup", note: "Fish in a golden broth under coriander and a crisp fried topping.", w: 602, h: 370 },
  { slug: "seafood-crisp", name: "Seafood and Greens", note: "Prawns, squid and greens over crisp fried egg noodles.", w: 431, h: 475 },
  { slug: "beef-greens", name: "Beef with Greens", note: "Beef tossed through snake beans, herbs and red onion.", w: 1158, h: 702 },
] as const;
