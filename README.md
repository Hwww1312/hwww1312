# Cambodian Food Stars

An immersive one-page 3D story for a Khmer restaurant at 14 Buckingham Ave,
Springvale VIC 3171, plus the supporting pages.

Next.js 16 (App Router) · React 19 · React Three Fiber · GSAP ScrollTrigger ·
Tailwind v4.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
npm run lint
```

## The story

The homepage is one persistent WebGL canvas fixed behind semantic HTML. Scroll
position drives the scene; the HTML is complete on its own.

| Chapter | Section id | What the object does |
|---|---|---|
| 01 The reveal | `reveal` | A single plate, lit out of the dark, right of the headline |
| 02 Discover | `story` | Camera orbits; the plate turns to show the food |
| 03 The detail | `detail` | Camera closes in across three seasoning and service beats |
| 04 One becomes many | `transformation` | The plate resolves into a full table setting |
| 05 The room | `menu` | The object withdraws and the canvas dims for the gallery |
| 06 The invitation | `final` | The plate settles beneath the closing call to action |

`src/data/storyConfig.ts` is the single source of truth: camera, model,
lighting and `spread` per chapter, with phone overrides. Tune the experience
there rather than in components.

Chapter ranges are **measured from the live DOM** at runtime, because the
sections are not equally tall. `id` is the narrative name and `domId` is the
section it anchors to; they differ where the nav needs a friendlier anchor.

Add `?storydebug` to the homepage URL to expose the resolved scene state on
`window.__story`.

## The hero object

There is no scanned model of a plate of lok lak, so the tableware is generated:
lathed ceramic profiles in `src/lib/three/ceramics.ts`, glazed with clearcoat,
with the restaurant's own photographs mapped onto shallow domes so the food
reads with volume. Reflections come from `Lightformer` shapes, not a downloaded
HDRI, so nothing is fetched from a third party at runtime.

To swap in a real GLB later, replace the meshes in
`src/components/three/HeroModel.tsx`. Keep the four named pieces (`plate`,
`bowl`, `pot`, `side`) and the `spread` interpolation and the story timeline
keeps working unchanged.

## Table requests

`src/app/actions/reserve.ts` validates with the schema in
`src/lib/forms/reservation.ts` and emails the restaurant through Resend.

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `RESERVATION_EMAIL_TO` | Inbox the restaurant reads |
| `RESERVATION_EMAIL_FROM` | Verified sender on your Resend domain |

**If these are unset the form does not pretend to send.** It returns a message
telling the visitor to phone the restaurant. Tap-to-call works with no
configuration and no JavaScript.

## Content and facts

`src/data/siteContent.ts` holds every string, tagged by provenance:

- `VERIFIED` from the Google Business listing (address, phone, hours, rating,
  review count, service options, price range, plus code, and the three reviews,
  quoted verbatim including the reviewers' own spelling)
- `OWNER` voice developed from the client's description of the restaurant
- `PLACEHOLDER`, clearly marked and safe to edit

No prices, awards, history or staff claims are asserted beyond what the listing
publishes. Two items need the owner's sign-off before launch: `SITE_ORIGIN`
(no canonical domain supplied) and the retention paragraph on `/privacy`.

The listing spells the name "Cambodian Food Stars"; the brief wrote
"Cambodian Foodstar". Change `BUSINESS.name` if the client prefers theirs.

## Accessibility

Skip link, semantic headings, labels above inputs with errors below, visible
focus rings, and a live region on the form. The canvas is `aria-hidden` and
never takes pointer events. `prefers-reduced-motion` parks the scene on a
composed frame instead of driving it. With WebGL unavailable no canvas mounts
and a static composition is shown; all content stays reachable.

## Layout

```
src/app/          routes, server action, sitemap and robots
src/components/   layout, story chapters, three/, forms, ui
src/data/         siteContent.ts (copy + facts), storyConfig.ts (timeline)
src/lib/          story state and interpolation, ceramics, form schema
legacy/           the earlier TanStack one-pager, not built
```
