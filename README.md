# Cambodian Food Stars

A cinematic one-page 3D story for a Khmer restaurant at 14 Buckingham Ave,
Springvale VIC 3171, plus the supporting pages.

The whole homepage is built around one dish — a Cambodian fish curry noodle
bowl — modelled from scratch and travelling through the page as the visitor
scrolls.

Next.js 16 (App Router) · React 19 · React Three Fiber · GSAP ScrollTrigger ·
Tailwind v4.

## Look

Dark charcoal-brown ground, creamy off-white type, golden-orange for every
action, and a herb green kept strictly as an accent. Fraunces carries the
headlines — set oversized, uppercase and tight through `.display` — and Inter
carries the body, both self-hosted as latin-subset woff2. The measure is a wide
1320px (`.shell`) with a lot of negative space around it.

The dish is the only saturated thing on the page and everything else gets out
of its way. Tokens live in `src/app/globals.css`.

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

| Chapter | Section id | What the dish does |
|---|---|---|
| 01 A taste of Cambodia | `hero` | The bowl floats right of the headline, which it overlaps |
| 02 Discover the ingredients | `ingredients` | Camera climbs towards a top-down read; seven call-outs fan out |
| 03 Turn it in the light | `rotation` | The camera swings around the dish over three viewports |
| 04 Layer by layer | `separation` | The garnishes drift apart and settle back |
| 05 The kitchen | `menu` | The dish withdraws and the canvas dims for the menu |
| 06 Taste Cambodia | `final` | The bowl comes to rest between the two closing words |

`src/data/storyConfig.ts` is the single source of truth: camera, model,
lighting, `spread` and the opening `INTRO` timings, with phone overrides. Tune
the experience there rather than in components.

Two details in the resolver are worth knowing before editing it. Values are
interpolated from one chapter to the **next**, so a number authored on a
chapter is what the visitor sees as they *arrive* at that section. And because
of that, a there-and-back move cannot be authored as a plain value — chapter 04
uses `swell`, which rides on a sine that is zero at both boundaries, so the
dish comes apart in the middle of its own section without breaking continuity
anywhere.

Chapter ranges are **measured from the live DOM** at runtime, because the
sections are not equally tall. `id` is the narrative name and `domId` is the
section it anchors to; they differ where the nav needs a friendlier anchor.

Add `?storydebug` to the homepage URL to expose the resolved scene state on
`window.__story` (written on scroll) and the live opening sequence and pointer
state on `window.__live` (written every frame).

### The opening

The page starts almost completely dark. A narrow warm spotlight comes up over
1.5s, the bowl rises from below the frame at three-quarter scale and settles by
3s, the camera keeps pushing forward until 3.6s, and the typography arrives
after the food is lit. It is skipped when the page loads anywhere but the top,
because playing a reveal into an empty frame reads as broken rather than
cinematic.

## The dish

There is no scanned model of a Cambodian curry noodle bowl, so the whole dish
is generated at runtime in `src/lib/three/curry.ts`: a lathed ceramic bowl, a
shallow parabolic dome of curry, and every garnish built from a small set of
primitives — a swept tapered tube for the noodles, sprouts, beans and chillies,
a cupped three-lobed shape for the coriander, an extruded sector for the lime.
The bowl has an outer radius of 1 and a rim at y = 0.86, so one unit is roughly
eleven centimetres and every size in that file is readable against the dish.

Textures are drawn into a 2D canvas at load (`src/lib/three/textures.ts`) —
mottled turmeric, pools of rendered fat that read brighter and much smoother
than the broth around them, glaze tooth, steam puffs, and the studio
environment used for image-based lighting. Nothing photographic and nothing
from a third-party CDN is used anywhere, which is most of the reason the page
reaches first paint as fast as it does.

Pieces are baked into one merged geometry per **cluster** — noodles, herbs,
chilli, lime and so on — so the whole dish is about a dozen draw calls. A
cluster also carries the small move it makes when the dish separates in chapter
04, staggered by `delay`.

### The rig and the grade

Four sources: a warm golden key spot from above and slightly in front (the only
one that casts), a warm gold rim from behind that separates the ceramic from
the dark, a very soft neutral fill opposite, and a whisper of tropical green
raking across the herbs. Behind the dish sits an additive card of warm light
that always stays on the camera axis, so the rim light has somewhere to come
from.

`src/components/three/PostFX.tsx` is a small hand-rolled grade: the scene
renders into a half-float target with tone mapping **off**, the bright pass and
two widening blurs run on real HDR values, and tone mapping, the sRGB
transfer, a lens vignette and a whisper of grain all happen once at the end. It
is written out rather than pulled from a library because the canvas is
transparent — so the page's own typography can sit behind the bowl — and an
off-the-shelf bloom throws that alpha away. Here the composite carries the glow
into the alpha channel, so light spilling off the broth genuinely lights the
page behind it. Hardware that cannot render to a half-float target falls back
to the renderer's own ACES tone mapping at the same exposure.

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

## Performance

One persistent canvas, adaptive DPR (capped at 1.5 on phones), rendering
suspended when the tab is hidden or the story has scrolled away, and geometry
that halves its noodle count and drops every radial segment on a coarse
pointer. Particles are instanced and the dish is merged per cluster. There are
no model or texture downloads at all — the whole scene is generated on the
main thread at load.

## Accessibility

Skip link, semantic headings, labels above inputs with errors below, visible
focus rings, and a live region on the form. The canvas is `aria-hidden` and
never takes pointer events, which is also what lets the hero and the closing
statement sit *behind* it and be overlapped by the bowl while staying readable
and clickable.

`prefers-reduced-motion` parks the scene on the composed hero frame and never
moves it again, draws frames on demand rather than sixty times a second, and
collapses the tall sections — they exist only to give the camera room to
travel, and with the camera parked they would just be empty screens to scroll
past. The canvas still cross-fades out past the hero, because a fixed canvas
sitting over the menu is unreadable and a fade is not motion.

The seven ingredient call-outs are decoration: the same seven are set as real
text in the section beside them, and on a phone the call-outs are dropped
entirely rather than crammed around a small bowl, which makes that list the
whole feature there.

With WebGL unavailable no canvas mounts and a static vector composition of the
same dish is shown; all content stays reachable.

## Layout

```
src/app/          routes, server action, sitemap and robots
src/components/   layout, story chapters, three/, forms, ui
src/data/         siteContent.ts (copy + facts), storyConfig.ts (timeline)
src/lib/          story state and interpolation, the dish, textures, form schema
```
