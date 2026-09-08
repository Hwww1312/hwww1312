# Cambodian Food Stars, Springvale

## Design read
For someone in Melbourne's south east deciding where to eat tonight. It should
feel like a warm, unpretentious Khmer dining room after dark, not a chain.

## Concept spine
**Stage and spotlight.** Every plate arrives out of the dark under one light.
The hero film literally does this (a dish lit against lacquer green), and each
section repeats it: photographs float as lit plates on a dark ground, framed by
a hairline, never sitting flat on the page.

## Delivery tier
`cinema`, executed as a one page site: full bleed hero film, layered scroll
depth, chaptered sections.

## Animation mode
`non-animated` (in the scroll scrub sense) because the brief explicitly asked
for a hero video that "must autoplay muted, loop seamlessly, and include a
poster frame" plus "smooth, transform-based scroll parallax with 2 to 3 layered
depths". That rules out handing scroll control to a scrubbed film.

Tier 1 mechanic: **layered depth parallax**. Three depths run on the compositor
(`translate3d` only): the hero film at +0.22, section photography at +0.08 to
+0.16, and counter moving type and data blocks at -0.06 to -0.10. The hero film
carries its own internal parallax too: a blurred, graded bed pans one way while
the sharp plate drifts and pushes in the other, so the depth on the page and
the depth in the film are the same idea.

## Locked palette
- Lacquer ground `#071C18`, raised `#0B2620`, hairline `#123A31`
- Paper `#F1EDE1`, secondary text sage `#9DB2A9`
- Single accent, lemongrass `#C8DC4B`

Defence: lacquer green is the colour of a Springvale shopfront at night and of
the herbs that dominate this cooking; lemongrass chartreuse is the one thing on
a Khmer plate that actually glows. One accent, page wide. Deliberately avoids
the banned graphite plus amber, near black plus neon, beige plus brass, and
violet families.

## Locked type
- Display: **Bricolage Grotesque** (variable, 700 to 800). Expressive grotesk
  with real character in the joins, so the headlines carry personality without
  reaching for a serif. Not Inter, not a "premium" serif.
- Body: **Inter Tight** 400 to 600.
- Both self hosted as latin subset woff2, display face preloaded.

## Section plan
One layout family each, no repeats.
1. Hero, full bleed film, text anchored bottom left
2. About, editorial offset, text left and a macro crop plus data rail right
3. Menu, off grid gallery cascade (7 tiles, varying spans and offsets)
4. Reviews, quote wall, two verbatim Google reviews
5. Visit, colour blocked diptych, details left and photography right
6. Footer, banner, the phone number as the largest thing on the page

Eyebrow budget: 2 of a possible 2 ("Springvale", "Visit").

## Asset plan
The restaurant's own photographs from its Google Business listing are the image
system: eight dishes, cropped clean of watermarks, collage banners and burned in
labels, then graded to the palette. Bespoke on top of that: the star and bowl
brand mark (favicon, ico, apple touch, 192, 512, maskable), the 1200x630 OG
card, the 18.3s 1080p hero film and its poster frame.

**Not generated:** the reference boards and an AI hero film. The Higgsfield
workspace has zero credits, so every `generate_*` call is refused. Rather than
ship stock or a placeholder, the hero film was composed frame by frame from the
restaurant's real photography. Swapping in a model generated hero is a drop in
replacement once credits exist.

## CTA inventory
Bespoke chrome, no shared button class anywhere.
- `NavCall`, quiet text link, rule fills from the left
- `CallPrimary`, solid lemongrass slab, arrow steps out
- `MenuAnchor`, hairline frame, fill wipes up from the bottom edge
- `DirectionsInline`, inline link with a lemongrass rule that brightens
- `PhoneMonolith`, the number itself at 8.5vw, tap to call

One label per intent: "Call" for the phone, "Get directions" for the map.

## Facts
Everything factual comes from the Google listing: name, category, address,
phone, closing time, popular times, rating and review count, and the dish names
the restaurant printed on its own photographs. No prices, awards, history or
opening times are stated, because none are published.
