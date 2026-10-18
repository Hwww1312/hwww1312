# Homiz — The Next Gen

A scroll-driven 3D story site for Homiz, a Melbourne streetwear label. It's a
static site with no build step: open `index.html` through any static server.

```bash
cd homiz && python3 -m http.server 8000   # http://localhost:8000
```

Three.js, GSAP ScrollTrigger and Lenis load from CDNs (pinned versions, see
`index.html`).

## The story

One fixed WebGL canvas sits between each chapter's scenery (under it) and its
copy (above it). Sticky elements are stacking contexts, so each chapter has two
sticky stages: `.stage-bg` and `.stage-fg`.

| # | Chapter | What happens |
|---|---------|--------------|
| 00 | Home | The roofed "o" from the logo is extruded into glossy 3D. A light follows the cursor and lights up the outlined HOMIZ word. Click the house: shockwave, flash, spin, then the camera flies through the window. Scrolling does the same fly-through. |
| 01 | Origin | Melbourne laneway backdrop with parallax, and the headline reveals line by line. |
| 02 | Drop 001 | The four pieces on a 3D ring with a cloth-wave shader. Scroll or drag to turn it, click a piece to open its detail view. |
| 03 | Two Faces | The zip hoodie on a turntable. Scroll flips it from Feel Blessed (front) to Fear Less (back), and the swatches swap colourways. |
| 04 | Details | Puffy 3D stars drift past the spec list. |
| 05 | Melbourne | Skyline parallax. The manifesto lights up word by word. |
| 06 | Join | Email capture (front-end only for now), plus a marquee. |

## Assets

- `assets/cut-*.webp`: the product shots with the background cut out.
- `assets/logo-white.png`: the logo turned white on transparent for the dark UI.
- The laneway, skyline and fabric backdrops were generated with Higgsfield and
  are hotlinked from Higgsfield's CDN in `index.html` / `style.css`. Download
  them into `assets/` and swap the URLs before launch.

## Before launch

- Connect `#dropForm` (in `main.js`) to a real mailing list. It only shows a
  thank-you message right now.
- Add real prices and product links to `PRODUCTS` in `main.js`, and the real
  Instagram URL in the footer.
