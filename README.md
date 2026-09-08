# Cambodian Food Stars

A one page website for Cambodian Food Stars, a Khmer restaurant at
14 Buckingham Ave, Springvale VIC 3171.

**Live:** https://cambodian-food-stars.higgsfield.app

## What is here

This branch mirrors the hand written source of the site. It is built on the
Higgsfield website stack (React 19 + TanStack Start, server rendered from a
single Cloudflare Worker), so the scaffold that surrounds these files lives in
the deploy repository. The files below are the ones that were authored for this
project.

```
app/design-brief.md              the design contract: spine, palette, type, sections
app/src/brand.css                brand layer (tokens, base type, motion, reduced motion)
app/src/app-meta.json            page title, description, OG image, favicon
app/src/lib/business.ts          every fact on the page, sourced from the Google listing
app/src/lib/parallax.ts          transform only scroll parallax controller
app/src/components/site/chrome.tsx  brand mark, rating stars, the five CTA garments
app/src/routes/index.tsx         the page
app/public/                      generated brand assets (icons, fonts, dish photography, OG)
source-photos/                   the restaurant's own photographs, cropped, ungraded
tools/render-hero-film.py        renders the 1080p seamless hero loop
tools/render-og-card.py          renders the 1200x630 OG card
```

## Development setup

The authored files here are rendered with two Python tools (`tools/`). To
prepare a machine to run them:

```bash
scripts/cloud-agent-install.sh   # installs ffmpeg (if missing) + Python deps
```

This installs the packages in `requirements.txt` (numpy, Pillow, fonttools,
Brotli) and ensures `ffmpeg` is available for encoding the hero film. The script
is idempotent, so it is safe to re-run. It is also the `install` step used by the
Cloud Agent environment.

## Regenerating the hero film

`app/public/assets/hero.mp4` and `hero-poster.jpg` are not committed because
they are generated. To rebuild them:

```bash
python3 tools/render-hero-film.py            # writes 440 frames to ./fr
ffmpeg -y -framerate 24 -i fr/f_%04d.jpg \
  -vf "hqdn3d=2.0:1.5:8:7" -c:v libx264 -profile:v high -crf 31 -preset slow \
  -g 48 -pix_fmt yuv420p -x264-params "aq-mode=3" -movflags +faststart -an \
  app/public/assets/hero.mp4
cp fr/f_0000.jpg app/public/assets/hero-poster.jpg
```

The film is periodic by construction: four shots of 110 frames each, with 29
frame dip transitions that wrap modulo the 440 frame period, so frame 439 hands
back to frame 0 with no seam.

## Facts policy

Nothing on the page is invented. Name, category, address, phone, closing time,
busiest hours, rating and review count all come from the restaurant's Google
Business listing, and the two review quotes are verbatim. No prices, awards,
history or full opening hours appear, because none are published.
