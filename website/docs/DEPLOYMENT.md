# Deployment

## Stack

- Next.js App Router (TypeScript)
- React Three Fiber + Three.js + drei
- GSAP ScrollTrigger
- Tailwind CSS v4
- Zod-validated `/api/contact` and `/api/reserve`

## Local development

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
cd website
npm run lint
npx tsc --noEmit
npm run build
npm start
```

## Environment

Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key for outbound email |
| `CONTACT_TO_EMAIL` | Restaurant inbox |
| `CONTACT_FROM_EMAIL` | Verified sender in Resend |

Without email env vars, forms still validate and respond successfully while logging payloads — the UI asks guests to call `(03) 9558 5555` to confirm.

## Hosting notes

- Deploy the `website/` directory as the Next.js app root (Vercel, Node host, or Docker).
- Ensure `/public/assets` dish images and `/public/fonts` are included.
- No GLB is required for launch; see `docs/ASSET_REPLACEMENT.md`.

## Outstanding / editable items

- `[EDITABLE]` email address in `siteContent.ts`
- `[EDITABLE]` owner story paragraph on About
- `[EDITABLE]` privacy counsel review note
- Production GLB hero still pending
- Hero film from the legacy one-pager is not part of this Next.js build
