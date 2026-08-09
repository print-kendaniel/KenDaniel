# Portfolio 2026

Ken Daniel Llamanzares's personal portfolio: a Next.js 15 (App Router) site with a
Firebase-backed CMS for projects and blog posts, single-admin auth, and a contact form —
built as a real system first, design pass to come later.

## Architecture overview

- **Framework**: Next.js 15 App Router, TypeScript, Tailwind (layout utilities only — no
  design system yet, see `DESIGN_TODO.md`).
- **Data**: Firestore (`projects`, `posts`, `messages` collections), accessed only from
  the server via the Firebase Admin SDK (`lib/firebase/admin.ts`,
  `lib/firebase/firestore.ts`). The client Firebase SDK (`lib/firebase/client.ts`) is used
  only for signing the admin in (email/password).
- **Auth**: Single-admin. The admin signs in client-side with Firebase Auth, trades the
  ID token for an httpOnly session cookie (`/api/auth/session`, verified server-side with
  the Admin SDK), and the UID must be in `ADMIN_UIDS`. `middleware.ts` does a cheap
  cookie-presence check on `/admin/*` (Edge runtime can't run the Admin SDK); the
  authoritative check is `requireAdmin()` in `lib/auth/guard.ts`, which runs in the
  `/admin` server layout.
- **Validation**: All Firestore documents and API payloads are validated with Zod
  (`lib/validation/*.schema.ts`). Env vars are validated at import time and fail fast
  (`lib/config/public.ts`, `lib/config/server.ts`).
- **Content**: Static profile content (bio, timeline, certifications, skills) lives in
  `lib/content/profile.ts`, sourced from the resume. Projects/posts are Firestore
  documents, seeded from the resume via `scripts/seed.ts`.

## Folder structure

```
app/            Routes (public pages, /admin/*, /api/*), each segment has
                loading.tsx/error.tsx where data is fetched
components/     layout/ projects/ blog/ contact/ admin/ ui/ — grouped by feature
lib/
  config/       Zod-validated env (public.ts for NEXT_PUBLIC_*, server.ts for secrets)
  firebase/     client.ts (browser SDK), admin.ts (Admin SDK), firestore.ts (typed
                collection helpers), storage.ts (image uploads)
  auth/         session.ts (cookie mint/verify), guard.ts (server-side admin checks)
  validation/   Zod schemas + inferred types for projects/posts/messages/contact
  rate-limit/   swappable RateLimiter interface + in-memory implementation
  content/      lib/content/profile.ts — resume-sourced static content
  logging/      structured JSON logger
  errors.ts     ApiError, consistent JSON error shape, Sentry stub (captureError)
  cors.ts       same-origin CORS helper for public API routes
  ip.ts         request IP extraction + HMAC hashing (never store raw IPs)
types/          Public interface re-exports of the Zod-inferred types
scripts/seed.ts Seeds `projects` from the resume; `posts` starts empty
tests/          unit/ (Vitest: schemas, rate limiter), e2e/ (Playwright smoke test)
```

## Local setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Firebase project** (console.firebase.google.com):
   - Enable **Firestore** (production mode).
   - Enable **Authentication** → Email/Password provider.
   - Enable **Storage**.
   - Add a **Web app** (Project settings → General → Your apps) — copy the config
     values into `NEXT_PUBLIC_FIREBASE_*`.
   - Generate a **service account key** (Project settings → Service accounts →
     Generate new private key) — this gives you `FIREBASE_PROJECT_ID`,
     `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
   - Create your admin user under Authentication → Users, then copy its UID into
     `ADMIN_UIDS`.
   - Deploy `firestore.rules` and `storage.rules` (via the Firebase Console rules editor,
     or the Firebase CLI: `firebase deploy --only firestore:rules,storage`).

3. **Copy `.env.example` to `.env.local`** and fill in every value (see the table below).

4. **Seed initial content** (populates `projects` from the resume; `posts` stays empty
   until you write some in `/admin/blog`):
   ```bash
   npm run seed
   ```

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000. Visit `/login` to sign in as the admin (create that user
   under Firebase Authentication first) and reach `/admin`.

   Config validation is fail-fast: if any required env var is missing, `npm run dev` will
   throw immediately with a description of what's wrong, before serving any page.

## Environment variables

| Variable | Where | Required | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | yes | No trailing slash; used for metadata, sitemap, CORS |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | public | yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | public | yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | public | yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | public | yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | public | yes | Firebase web app config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | public | yes | Firebase web app config |
| `FIREBASE_PROJECT_ID` | server | yes | From the service account JSON |
| `FIREBASE_CLIENT_EMAIL` | server | yes | From the service account JSON |
| `FIREBASE_PRIVATE_KEY` | server | yes | From the service account JSON; keep the `\n` sequences literal |
| `ADMIN_UIDS` | server | yes | Comma-separated Firebase Auth UIDs allowed into `/admin` |
| `SESSION_COOKIE_NAME` | server | no | Defaults to `__session` |
| `SESSION_COOKIE_MAX_AGE_SECONDS` | server | no | Defaults to 5 days |
| `CONTACT_RATE_LIMIT_MAX` | server | no | Defaults to 5 submissions per window |
| `CONTACT_RATE_LIMIT_WINDOW_SECONDS` | server | no | Defaults to 600s (10 min) |
| `IP_HASH_SECRET` | server | yes | HMAC key for hashing submitter IPs; generate with `openssl rand -hex 32` |
| `SENTRY_DSN` | server | no | Leave blank until Sentry is wired in (`lib/errors.ts` is stubbed) |

## Testing

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # Vitest — Zod schemas + rate limiter (16 tests, no external deps)
npm run test:e2e    # Playwright — homepage renders, /admin redirects when logged out
```

`test:e2e` boots the real dev server, so it needs a working `.env.local` (the homepage
reads featured projects from Firestore). It has not been run end-to-end in this
environment since that requires a live Firebase project — run it locally once your
`.env.local` is filled in.

## Deployment (Vercel)

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel.
2. Add every variable from the table above in Vercel's Project Settings → Environment
   Variables (for Production, and Preview if you want PR previews to work).
3. Set `NEXT_PUBLIC_SITE_URL` to your real deployed URL once you know it (Vercel gives you
   one immediately; update this and redeploy, or set it ahead of time if you have a custom
   domain).
4. Deploy. Vercel runs `next build` automatically — the same build step CI runs, so if CI
   is green, this should succeed.

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: install → typecheck → lint →
unit tests → build. The build step statically renders project detail pages
(`generateStaticParams`), which reads Firestore via the Admin SDK — so the same Firebase
secrets used locally must also be added as **GitHub repo secrets** (Settings → Secrets and
variables → Actions) for CI to pass.
