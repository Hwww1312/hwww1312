# Cambodian Food Stars — Build Plan

**For the implementing agent (Cursor).** Read this file top to bottom before
writing code. Work one phase at a time, in order. Each phase ends with a
verification step that must pass before you start the next one.

> Paste this into Cursor to begin:
> *"Read `docs/BUILD-PLAN.md`. Implement Phase 0 and Phase 1 only. Run
> `npm run typecheck && npm run lint && npm run build`. Then stop and show me
> the diff."*

---

## 0. What this is

A one-page immersive scroll story for a real Khmer restaurant in Springvale,
Victoria. One persistent WebGL canvas sits behind semantic HTML; scroll
position drives a single continuous camera move through one table.

**This is a redirection of an existing, working codebase — not a greenfield
build.** The architecture is sound and you are keeping it. What changes is the
art direction, the narrative spine, and the atmosphere.

### Keep (do not refactor these)

| File | Why it stays |
|---|---|
| `src/lib/story/state.ts` | Scroll state deliberately lives outside React. Pure `resolveStory(progress)`. Correct. |
| `src/components/story/StoryController.tsx` | Measures real section heights from the DOM instead of guessing fractions. Keep the measuring logic exactly. |
| `src/components/story/StoryCanvas.tsx` | Fixed (not pinned) canvas, WebGL detection, visibility-based frameloop pausing. Correct. |
| `src/components/three/CameraRig.tsx` | Camera owned in exactly one place. Keep. |
| `src/data/siteContent.ts` provenance system | `VERIFIED` / `OWNER` / `PLACEHOLDER` tagging. **Non-negotiable — see §9.** |
| Accessibility layer | Skip link, `aria-hidden` canvas, `prefers-reduced-motion` parking, no-WebGL fallback. Extend it, never weaken it. |

### Change

1. **Art direction** — dark ground, fire as the light source. Replaces the
   cream/jade editorial look.
2. **Narrative spine** — scroll becomes *time of day*, 8:00 am to 9:00 pm.
   Replaces the "plate → orbit → spread" object demo.
3. **Atmosphere** — volumetric haze, steam, ember light, post-processing.
4. **Chrome** — preloader, chapter clock, type reveals, page transitions.

---

## 1. Creative direction

### 1.1 Positioning

A **working Khmer kitchen**, not a restaurant brand. Every Google review says
the same two things: the food is authentic, and the owners make you feel at
home. The listing's most interesting verified fact is the trading window —
**8:00 am to 9:00 pm**. A place that has been cooking since eight in the
morning is a different proposition from a place that opens at six. That is the
whole idea, and the site is built on it.

Tone: *considered, not expensive.* Reported spend on the listing starts at $1.
Sharp typography and real restraint — never a tasting-menu photograph, never
the word "curated". The site should make the room feel worth finding, not
exclusive.

### 1.2 Palette

Dark ground. A 3D render reads as cinema on dark and as a product shot on
cream; food glows against dark and goes flat against cream.

Replace the `@theme` block in `src/app/globals.css`:

```css
@theme {
  /* Ground — charred wok, burnt palm sugar */
  --color-ground:    #100E0B;
  --color-ground-2:  #1A1612;
  --color-ground-3:  #26201A;

  /* Ink */
  --color-bone:      #F4EDE0;
  --color-bone-2:    #B5AA97;
  --color-bone-3:    #6E6457;

  /* Accents */
  --color-palm:      #D08A33;  /* palm sugar — primary accent */
  --color-palm-hi:   #F0B863;
  --color-herb:      #7C9A52;  /* raw coriander, not glazed jade */
  --color-chili:     #B23A2C;  /* once per screen, never twice */
  --color-ember:     #FF7A2F;  /* 3D light only, never UI */
}
```

**Delete `jade`, `celadon`, `cream`, and `paper` entirely.** Celadon/jade is a
Chinese-Japanese signal and works against the authenticity claim every review
makes. Grep for the old token names and fix every call site — do not leave
aliases behind.

### 1.3 Typography

Drop Fraunces. It is the house face of exactly the aesthetic we are leaving.

| Role | Face | Notes |
|---|---|---|
| Display | **Instrument Serif** (400, Regular + Italic) | High contrast, editorial, sharp. Free, self-hostable. |
| Body | **Inter Tight** (400 / 500) | Tighter than Inter; holds up small on dark. |
| Data | **JetBrains Mono** (400) | Chapter clocks (`08:00`), address, hours, the eyebrow line. |
| Khmer | **Noto Serif Khmer** (400) | Secondary lockup only — see below. |

Self-host all four as latin-subset `woff2` in `src/fonts/`, matching the
existing pattern in `src/app/layout.tsx` (`next/font/local`). Subset Noto Serif
Khmer to the Khmer range. Do not add a Google Fonts network request.

**Khmer lockup.** Set the restaurant name in Khmer script beneath the latin
wordmark in the header and footer, at ~0.7× the latin size in `--color-bone-3`.
Mark the Khmer string `PLACEHOLDER` in `siteContent.ts` with a comment saying
the owner must confirm the spelling before launch. Do not guess a transliteration
and ship it as fact.

Scale (replace the existing clamps):

```css
--text-hero:    clamp(3rem, 9vw, 8.5rem);
--text-chapter: clamp(2rem, 5vw, 4.25rem);
--text-section: clamp(1.5rem, 2.8vw, 2.25rem);
--text-clock:   clamp(0.75rem, 1vw, 0.875rem);
```

Display headings: `letter-spacing: -0.03em`, `line-height: 0.95`,
`text-wrap: balance`. Mono eyebrows: `letter-spacing: 0.18em`, uppercase.

### 1.4 Texture

The lever nobody is pulling: **Angkor sandstone relief and krama check.**

- **Krama as structure.** The Cambodian checked scarf is a grid, not a pattern.
  Use its proportions for the section rules and the menu layout — a 3:1 major/minor
  rhythm in `--color-ground-3` at 8–12% opacity. Never as a decorative overlay.
- **Sandstone relief on the wordmark.** A subtle inset `text-shadow` treatment
  (1px dark above, 1px light below) so the mark reads as carved rather than
  printed. Applied to the wordmark only, never to body copy.
- **Film grain.** A fixed, `pointer-events-none`, `mix-blend-mode: overlay`
  canvas-generated noise layer at 3–4% opacity across the whole page. This is
  what stops a dark site looking like flat CSS. Generate once to a data URI at
  build time or on mount; do not animate it per-frame on mobile.

---

## 2. The story spine — one day, 8am to 9pm

Scroll equals time of day. **The light is the narrator.** The camera never
cuts: it is one continuous move through a single table.

| # | `id` | Clock | Scene | Light |
|---|---|---|---|---|
| 01 | `dawn` | 08:00 | One bowl of broth. Steam. Empty room. | Cold window light from the left, near-dark |
| 02 | `prep` | 10:30 | Lemongrass, pepper, herbs land on the board | Warming, raking in from the side |
| 03 | `service` | 12:30 | Takeaway. Plates arrive and clear, fast | Flat, bright, hard overhead |
| 04 | `fire` | 18:00 | The burner ignites; the steamboat arrives | **Fire becomes the key light** |
| 05 | `table` | 20:00 | Full table, spread wide, shot top-down | Deep tungsten, warm |
| 06 | `close` | 21:00 | Everything dims but one plate | Single key, back to the start |

The arc is dark → bright → dark and cool → warm. Chapter 04 is the emotional
peak and lands on the busiest hour the listing actually names. Chapter 06
rhymes with chapter 01 on purpose.

Why this beats what is there now: the object transformation becomes *motivated*
(it is service, not a `spread` float animating), and it is a claim only this
restaurant can make.

### 2.1 `storyConfig.ts` — extend the types

Add three fields to `LightingState`:

```ts
export interface LightingState {
  ambient: number;
  keyIntensity: number;
  keyPosition: Vec3;
  rimIntensity: number;
  /** 0 = cold window daylight, 1 = tungsten lamp. */
  keyWarmth: number;

  /** NEW — the burner. 0 until chapter 04, then it becomes the key. */
  emberIntensity: number;
  /** NEW — volumetric haze density. High at dawn and close, low at midday. */
  fogDensity: number;
  /** NEW — steam emission rate, 0 to 1. */
  steam: number;
}
```

Add one field to `Chapter`:

```ts
  /** Which props are staged in this chapter. Drives per-piece visibility. */
  props: Array<"bowl" | "board" | "plate" | "container" | "pot" | "skewer" | "burner">;
  /** Mono clock label rendered in the chapter marker, e.g. "08:00". */
  clock: string;
```

### 2.2 Target values

Starting points. Tune by eye against the live page — these are a shape, not
gospel.

| # | ambient | keyIntensity | keyWarmth | keyPosition | ember | fog | steam |
|---|---|---|---|---|---|---|---|
| 01 `dawn` | 0.10 | 1.10 | 0.05 | `[-3.2, 3.4, 1.8]` | 0.0 | 0.085 | 1.0 |
| 02 `prep` | 0.24 | 1.50 | 0.28 | `[ 1.2, 4.2, 2.6]` | 0.0 | 0.055 | 0.2 |
| 03 `service` | 0.42 | 2.00 | 0.20 | `[ 0.2, 5.6, 0.8]` | 0.0 | 0.020 | 0.3 |
| 04 `fire` | 0.18 | 1.20 | 0.85 | `[ 0.6, 1.4, 1.6]` | 3.5 | 0.070 | 0.8 |
| 05 `table` | 0.22 | 1.60 | 0.78 | `[ 0.0, 5.2, 2.0]` | 1.8 | 0.050 | 0.6 |
| 06 `close` | 0.08 | 1.70 | 0.62 | `[ 1.8, 4.2, 2.8]` | 0.4 | 0.095 | 0.4 |

Camera: keep chapter 05 top-down (`position: [0, 5.2, 2.4]`, `fov: 42`,
`spread: 1`) — it is the payoff shot. Chapter 04 must be low and close
(`position: [0.3, 0.55, 2.2]`, `fov: 28`) so the flame is near camera and the
bloom has something to bite on.

`veil` stays as-is in concept but retune: on a dark ground the canvas no longer
needs to recede as hard behind type. Chapter 05's `veil: 0.96` should come down
to about `0.45` once the menu sits on `--color-ground`.

---

## 3. Phases

### Phase 0 — Setup

```bash
git checkout claude/awesome-archimedes-kx4003
npm install lenis @react-three/postprocessing postprocessing
```

Do not add a state library, an animation library beyond GSAP, or a UI kit.
Do not add `three-stdlib` — drei already re-exports what is needed.

**Verify:** `npm run build` still passes before you have changed anything.

---

### Phase 1 — Tokens and type

1. Rewrite the `@theme` block in `src/app/globals.css` per §1.2.
2. Swap `html`/`body` background to `--color-ground`, text to `--color-bone`.
3. Update `::selection` (palm on ground) and `:focus-visible` (2px `--color-palm`).
4. Add the four fonts to `src/fonts/` and wire them in `src/app/layout.tsx`.
5. Add the grain overlay component (`src/components/ui/Grain.tsx`), mounted once
   in the root layout.
6. Grep for `jade`, `cream`, `paper`, `turmeric`, `fraunces` and fix every hit.

**Verify:** `npm run typecheck && npm run lint && npm run build`. The page will
look wrong — that is expected, the 3D is still lit for cream. Nothing should
error and no old token name should remain.

---

### Phase 2 — Retarget the timeline

1. Extend `LightingState` and `Chapter` per §2.1.
2. Rewrite the `CHAPTERS` array with the six new chapters, ids, clocks, and the
   §2.2 values.
3. Extend the interpolation in `src/lib/story/state.ts` to lerp the three new
   lighting fields. `props` is **not** interpolated — resolve it from the
   current chapter only, and expose `nextProps` plus `local` so the scene can
   cross-fade prop visibility itself.
4. Update the `domId` values and `src/components/story/StoryContent.tsx` to match
   the new chapter list.

**Verify:** load `/?storydebug` and confirm `window.__story` reports the right
chapter id and clock at each scroll position, and that the six measured ranges
tile `[0, 1]` with no gap. Scrub up and down — the state must retrace exactly.

---

### Phase 3 — The lighting rig

Rewrite `src/components/three/Lighting.tsx`.

1. **Key light.** Keep the existing directional light and its shadow camera.
   Drive `keyWarmth` across a wider colour range than the current one: cold end
   `#9FC4E8` (window at 8am), warm end `#FFB870` (tungsten at 8pm). The current
   `#fff6e8 → #ffd9a3` range is far too narrow to read as a day passing.
2. **Ember light — new.** A `pointLight` at the burner position,
   `color: #FF7A2F`, `intensity: lighting.emberIntensity * Math.PI`,
   `distance: 6`, `decay: 2`, `castShadow` on desktop only. Add a small
   per-frame flicker: `intensity * (0.88 + 0.12 * noise(t))` using a cheap
   value-noise function, **not** `Math.random()` — random reads as a strobe,
   noise reads as fire.
3. **Fog.** `scene.fog = new THREE.FogExp2(groundColor, lighting.fogDensity)`,
   updated per frame. This is what sells 8am and 9pm.
4. **Environment.** Rework `StoryEnvironment.tsx`: the painted equirect map must
   also shift across the day. Regenerating the PMREM per frame is far too
   expensive — instead bake **three** maps at mount (cold / neutral / warm) and
   cross-fade `scene.environment` by swapping at chapter boundaries, with
   `scene.environmentIntensity` interpolating continuously between them.

**Verify:** scrub the full page. The light must travel cold → neutral → hard
overhead → firelit → tungsten → dark without a visible step at any chapter
boundary. Watch specifically for a pop at the environment swap.

---

### Phase 4 — Staging the object

Rework `src/components/three/HeroModel.tsx`. The existing lathed ceramics
(`src/lib/three/ceramics.ts`) and painted meat surfaces (`src/lib/three/meat.ts`)
are good work — keep both and build on them.

New geometry needed:

- **Burner + pot** (chapter 04). A low ring burner, lathed steel, plus the
  existing `POT_PROFILE`. The flame is **not** geometry: use an additive,
  depth-write-off billboard plane with a procedurally animated shader, always
  facing camera.
- **Steam.** A `Points` system, 60–120 particles, additive, soft radial sprite,
  rising with a slow curl. Emission rate driven by `lighting.steam`. Fade
  opacity with distance from camera so it never reads as confetti.
- **Board + aromatics** (chapter 02). Lemongrass stalks (tapered cylinders),
  peppercorns (low-poly icospheres), herb leaves (bent planes). Cheap, and they
  carry the whole "seasoning first" beat.
- **Takeaway containers** (chapter 03). Simple tapered boxes. They only need to
  read for one chapter.

Per-piece visibility: each prop group reads `props` / `nextProps` / `local` from
the resolved state and cross-fades its own `material.opacity` and scale. Never
toggle `visible` on a hard boundary — it pops.

Keep the four named pieces (`plate`, `bowl`, `pot`, `side`) and the `spread`
interpolation so a real GLB can be swapped in later, as the README already notes.

**Verify:** every chapter has exactly the props §2 lists, and no prop appears or
vanishes on a single frame. Check chapter 03→04 in particular.

---

### Phase 5 — Atmosphere

Add `<EffectComposer>` inside `StoryScene.tsx`:

| Effect | Setting | Why |
|---|---|---|
| `Bloom` | `intensity 0.55`, `luminanceThreshold 0.72`, `mipmapBlur` | The flame and the wet highlights on the glaze |
| `DepthOfField` | `focusDistance` from the resolved model position, `bokehScale 2.4` | Desktop only |
| `Vignette` | `darkness 0.45`, `offset 0.3` | Closes the frame at chapters 01 and 06 |
| `Noise` | `opacity 0.025`, `blendFunction: OVERLAY` | In-canvas grain, on top of the CSS grain |

**Skip the entire composer when `lowPower` is true** — `StoryCanvas.tsx` already
computes that flag. Also skip DOF under `prefers-reduced-motion`.

**Verify:** measure frame time with and without the composer on a throttled
profile. If desktop drops below 55fps, cut DOF first, then bloom resolution.

---

### Phase 6 — HTML and type

Rewrite the six chapter components in `src/components/story/chapters/` to match
the new spine. The HTML must still read correctly with no JS and no WebGL — that
is what makes the 3D layer safe to treat as decoration.

Per chapter: a mono clock (`08:00`), a mono eyebrow, a display headline, a body
paragraph at `max-width: 46ch`.

**Type reveal.** Headlines animate in per-line with a clip mask — the line
translates up from behind an `overflow: hidden` wrapper, 0.9s,
`cubic-bezier(0.16, 0.84, 0.36, 1)`, 60ms stagger per line. Triggered by
`IntersectionObserver`, fired once, never re-run on scroll back.

Do **not** apply a generic fade-up to every element on the page. One reveal
mechanism, used on headlines only; body copy is simply present. Restraint here
is the difference between "designed" and "template".

**Smooth scroll.** Initialise Lenis in `StoryExperience.tsx`, `lerp: 0.09`, and
drive `ScrollTrigger.update` from its `scroll` event. Call
`ScrollTrigger.refresh()` after Lenis mounts. **Disable Lenis entirely under
`prefers-reduced-motion`** — hijacked scroll is the single most common
accessibility failure on sites like this.

**Verify:** disable JavaScript in devtools. Every headline, paragraph, menu item,
the address, the phone number and the reservation link must be present and
readable.

---

### Phase 7 — Chrome

1. **Preloader.** Counts *real* progress from the drei `useProgress` hook — never
   a fake timer. Render the mono clock ticking 08:00 → 21:00 as it loads, then
   wipe up to reveal chapter 01. Hard cap: if loading exceeds 4s, reveal anyway.
2. **Chapter clock.** Replace `StoryProgress.tsx` with a fixed-position mono
   readout on the left edge: the current time, a hairline progress rule, and the
   six chapter labels. The active one in `--color-palm`, the rest in
   `--color-bone-3`. Clickable — each scrolls to its section.
3. **Header.** Wordmark with the Khmer lockup, a `Reserve` button in
   `--color-palm`, and the phone number as a tap-to-call link. Make it
   `position: fixed` with a background that only fades in after chapter 01.
4. **Sound toggle.** *Optional but it is what separates the top 10%.* A single
   ambient loop — room tone and a distant sizzle — behind a mono `SOUND ON/OFF`
   control in the footer corner. **Default off. Never autoplay.** Persist the
   choice in `localStorage`. Skip this phase entirely if you cannot source an
   appropriately licensed audio file; a missing sound toggle costs nothing, a
   stolen audio file costs everything.
5. **Page transitions.** `/about`, `/contact`, `/privacy` fade through
   `--color-ground` over 400ms. Keep them simple — the homepage is the show.

---

### Phase 8 — Supporting pages, performance, QA

1. Restyle `/about`, `/contact`, `/privacy` on the new tokens. The reservation
   form in `src/app/actions/reserve.ts` and its Zod schema are correct — do not
   touch the validation, only the styling.
2. Rebuild `src/app/opengraph-image.tsx` on the dark palette.
3. Update `README.md`'s **Look** and **The story** sections to describe what now
   exists. The current text describes the cream/jade direction and will be wrong.

**Performance budget:**

| Metric | Target |
|---|---|
| Desktop frame time | ≥ 55fps sustained through a full scroll |
| Mobile frame time | ≥ 30fps, composer off |
| LCP | < 2.5s on Fast 3G |
| Initial JS (excl. three) | < 180KB gzipped |
| Draw calls | < 120 at the busiest chapter (05) |
| Texture memory | < 48MB |

**Acceptance checklist — all must pass:**

- [ ] `npm run typecheck && npm run lint && npm run build` clean
- [ ] Full page readable with JS disabled
- [ ] Full page readable with WebGL disabled (`ModelFallback` path)
- [ ] `prefers-reduced-motion`: no Lenis, no DOF, scene parked on a composed frame
- [ ] Keyboard-only: skip link works, every control reachable, focus always visible
- [ ] No chapter boundary pops — light, props, or camera
- [ ] Scrubbing backwards retraces the exact forward states
- [ ] 360px viewport: no horizontal scroll, hero legible
- [ ] Canvas is `aria-hidden` and takes no pointer events
- [ ] Lighthouse a11y ≥ 95

---

## 4. What "award-winning" actually means here

Awwwards scores Design 40 / Usability 30 / Creativity 20 / Content 10.
**Usability is 30% and it is where 3D sites lose.** A beautiful site that
scroll-jacks, autoplays audio, or breaks the keyboard does not place.

The five things that carry this build:

1. **One idea, executed completely.** Scroll is time of day. Every decision —
   light, props, palette, the mono clocks — serves it. Sites lose by having
   three good ideas instead of one committed one.
2. **Light as narrative.** Most 3D sites move an object. This one moves the sun.
   That is the differentiator and it is worth the tuning time.
3. **Restraint in the HTML layer.** One reveal mechanism. One accent colour. The
   3D is the spectacle; the type must be still.
4. **The detail nobody asks for.** Ember flicker on noise, not random. Steam that
   fades with depth. Grain. The environment shifting with the hour. Judges cannot
   always name these, but they are what makes it feel expensive.
5. **It still works.** JS off, WebGL off, reduced motion, keyboard, 360px.

---

## 5. Guardrails — read before writing copy

`src/data/siteContent.ts` tracks provenance on every string, and this discipline
is not decorative:

- `VERIFIED` — from the Google Business listing. **Never edit these values.**
  Address, phone, hours, the 3.8 rating, the 41 review count, service options,
  the price range with its `Google, from 7 reports` attribution, the plus code,
  and the three reviews quoted verbatim *including the reviewers' own spelling
  and spacing*. Do not tidy the reviews.
- `OWNER` — voice developed from the client's brief. New narrative copy for the
  six chapters goes here.
- `PLACEHOLDER` — clearly marked, safe to edit, never presented as fact.

**Do not invent:** prices, awards, a founding year, chef biographies, staff
names beyond what the reviews already quote, dish counts, or provenance claims
about ingredients. If a chapter needs a fact the client has not supplied, write
around it or mark the string `PLACEHOLDER`.

Two items still need the owner's sign-off before launch: `SITE_ORIGIN` (no
canonical domain supplied) and the retention paragraph on `/privacy`. Leave both
flagged.

Keep generating the food in 3D rather than mapping the listing photographs onto
geometry — the repo moved away from those deliberately.

---

## 6. Order of work

Phases 0–2 are safe and mostly mechanical. Phase 3 is where the look either
appears or does not — **budget the most time there and tune by eye, not by the
numbers in this document.** Phases 4–5 build on a rig that must already look
right; do not start them while the lighting is still wrong.

If time runs short, ship Phases 0–4 and 6. Phase 5 (post-processing) and
Phase 7.4 (sound) are the two that can be cut without the concept collapsing.
