# Homiz — The Next Gen

The storefront and brand story for Homiz, a Melbourne streetwear label. It's a
static site with no build step: open `index.html` through any static server.

```bash
cd homiz && python3 -m http.server 8000   # http://localhost:8000
```

GSAP ScrollTrigger and Lenis load from CDNs (pinned versions, see `index.html`).

## Page order

1. **Announcement bar** with rotating messages, then a sticky header (centred
   logo) that hides as you scroll down and comes back when you scroll up.
2. **Hero:** a campaign slideshow (front view, then back view) with a slow
   zoom and parallax. Phones get portrait shots instead.
3. **Intro line:** lights up word by word as you scroll.
4. **New Arrivals:** four product cards. Hovering a card swaps front and back,
   with a soft light that follows the cursor. Cards have a wishlist toggle
   (remembered in the browser) and a quick view drawer with a size picker.
5. **Our Story:** four chapters that pan sideways as you scroll down.
6. **Two Faces:** the hoodie turns from Feel Blessed to Fear Less as you
   scroll. You can drag it, tilt it with the cursor and switch colourways.
7. **Lookbook:** editorial photos with parallax. Click one to open it full size.
8. **Manifesto:** text that lights up word by word over the Melbourne skyline.
9. **Homiz Club** sign-up, then the footer.

## Assets

- `assets/products/`: the hoodie product photos.
- `assets/cut-*.webp`: the same hoodies cut out, used by the Two Faces section.
- `assets/logo-black.png` / `logo-white.png`: the logo on a transparent background.
- The campaign, lookbook, story and trackpant images were generated with
  Higgsfield from the product photos and are hosted on Higgsfield's CDN
  (`d2ol7oe51mr4n9.cloudfront.net`). The trackpant shots are renders of the set
  in the lookbook photo. Swap in real photography when you have it.

## Before launch

- Add real prices: the cards currently say "Price at drop".
- Connect the Homiz Club form (`#clubForm`) and "Notify me" (`#qvNotify`) in
  `main.js` to a real mailing list. Right now they only confirm on the page.
- Wire up the bag and the help links (shipping, returns, size guide, contact),
  or move the site onto Shopify and keep this as the theme direction.
- Put in the real Instagram and TikTok links in the footer.
