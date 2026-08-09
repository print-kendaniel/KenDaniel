# Content TODO

Placeholders and real-content gaps to fill in before this goes live. Nothing here was
fabricated — these are gaps because the resume didn't have the information.

## Projects (`scripts/seed.ts` → Firestore `projects` collection)

All four projects were seeded from the resume bullets. For each one, the following are
currently `null` and should be filled in via `/admin/projects/[id]` once you have them:

- **TrustMeBro AI** — `repoUrl`, `liveUrl`, `coverImage`. Description has a `TODO: expand
  with architecture details, screenshots, and outcomes.` line.
- **SwineWatch** — `repoUrl`, `liveUrl`, `coverImage`. Description has a `TODO: expand with
  detection model details, hardware setup, and results.` line.
- **Digital Ears** — `repoUrl`, `liveUrl`, `coverImage`. Description has a `TODO: expand
  with signal processing pipeline details and accuracy results.` line.
- **Recruitment Workflow Automation** — `repoUrl`, `liveUrl`, `coverImage`. Description has
  a `TODO: expand with workflow design details and impact metrics.` line.

## Blog

No blog content exists in the resume, so `posts` seeds empty. Write your first post(s) in
`/admin/blog/new` whenever you're ready.

## Profile / links (`lib/content/profile.ts`)

- ~~GitHub URL~~ — filled in: `https://github.com/print-kendaniel`
- ~~LinkedIn URL~~ — filled in: `https://www.linkedin.com/in/kd-llamanzares`
- Phone number and the listed reference (Engr. Mark Angelo Mercado) were **intentionally
  omitted** from the public site per your call on privacy — not a placeholder, just
  flagging the decision in case you want to add a private "references available on
  request" line later.

## Admin account

Done — Firebase project connected, admin user created, `ADMIN_UIDS` set in `.env.local`.

## Hero images (`components/home/hero.tsx` → `LiquidReveal`)

The homepage hero's cursor-reveal effect currently uses placeholder gradient SVGs at
`public/hero/before.svg` (the image painted under the cursor) and `public/hero/after.svg`
(the always-visible base image) — solid gradients, not real photos. Send over two real
images whenever you have them (any subject works — the effect just needs two images of
the same dimensions/framing to reveal one under the other) and I'll swap them in; JPG/PNG
is fine, the component just needs the file paths updated in `hero.tsx`.

## Hero character (`components/home/hero-character.tsx`)

The hero now includes a small interactive illustrated portrait (`public/hero/character.png`,
tilts on hover, floats gently, "Hi, I'm Ken 👋" greeting bubble) — separate from the
LiquidReveal background above. Swap the file if you get an updated illustration; same
usage (`Image` component, no other wiring needed).

## Site metadata

- `NEXT_PUBLIC_SITE_URL` is a placeholder (`http://localhost:3000` in `.env.example`).
  Update it to your real domain once deployed — it feeds `metadataBase`, the sitemap, and
  the CORS allow-list.
- OG images (`app/**/opengraph-image.tsx`) currently render plain text on a white
  background — functional, not final (see `DESIGN_TODO.md`).
- No custom favicon has been added; the scaffold's default `app/favicon.ico` is still in
  place.
