# Cambodian Food Stars — Implementation Plan

## Phase 1 discovery

### Existing repository

| Asset | Status |
| --- | --- |
| Brand facts (`business.ts`) | Keep — Google listing only, no invented claims |
| Dish photography (8 plates) | Keep — use as textures + editorial imagery |
| Fonts (Bricolage Grotesque, Inter Tight) | Keep |
| Palette (lacquer + lemongrass) | Keep — matches brief (green + accent) |
| Hero film / parallax one-pager | Superseded by 3D scroll story |
| GLB / glTF product model | **Missing** |
| Table booking / contact API | **Missing** |

Brand name on the site remains **Cambodian Food Stars** (Google listing). The brief’s “Cambodia Foodstar” is treated as the same business.

### Proposed experience

One persistent WebGL canvas follows a **hero plate**: a lit ceramic dish whose food surface cycles through real restaurant photographs. Scroll drives camera, plate transform, lighting, and dish texture — one continuous meal narrative across six chapters.

| Chapter | Narrative | 3D behavior |
| --- | --- | --- |
| 01 Reveal | Brand + promise | Large plate emerging from lacquer dark |
| 02 Discover | What we serve | Orbit + pull back; introduce kitchen |
| 03 Details | Seasoning, fire, share | Close-ups + lighting focus on food surface |
| 04 Transformation | From plate to table | Plate lifts, lid/steam reveal, dish crossfade (wow) |
| 05 Value | Visit & reviews | Plate aside; editorial content focus |
| 06 Invitation | Reserve / call | Final heroic plate composition + CTAs |

### Missing assets & decisions

1. **No production GLB** — ship a clearly labeled procedural plate placeholder (`HeroPlate`) textured with real dish photos. Document Blender swap path in `docs/ASSET_REPLACEMENT.md`.
2. **Reservation / contact** — Next.js route handlers validate with Zod and log payloads. Wire `RESEND_API_KEY` / `CONTACT_TO_EMAIL` when available (documented in `.env.example`).
3. **Opening hours** — only closing time `9:00 pm` and busiest `6–8 pm` are published; do not invent full hours.
4. Stack lives in `/website` (Next.js App Router). Legacy Higgsfield source remains under `/app` for reference.

### Phases

1. Discovery (this doc) → 2. Design foundation → 3. 3D foundation → 4. Scroll story → 5. Transformation polish → 6. Supporting pages → 7. QA → 8. Production docs.
