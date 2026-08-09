# Design TODO

A full visual language ("ASE Daniel" — Champagne Mist + Burgundy palette, Onest type,
motion system) was applied across this pass, adapted from a supplied design spec. It now
covers global chrome plus every public page. Auth and Admin still use the original
plain/unstyled treatment.

## Done in this pass

- **Design tokens** (`app/globals.css`): full palette (`--color-ink`, `--color-accent`,
  `--color-surface`, etc. — currently Champagne Mist + Burgundy), radii scale,
  spring/ease custom properties, Onest font, adaptive rem grid (fluid type/spacing
  scaling with viewport width).
- **Shared primitives** (`components/ui/`): `Eyebrow`, `PillButton`, `TagChip`,
  `AnimatedLink`, `icons.tsx` (inline SVG set) — reused across every page below.
- **Motion infra** (`components/effects/`): Lenis smooth scroll + scroll-lock (with
  proper resize/scroll-reset on route change), intro loader (000→100 count), line/word
  scroll-reveals, a 3D flip-in reveal (`Reveal3D`) and pointer-tilt card (`TiltCard`) for
  richer entrances, scroll-linked `Parallax` drift, the cursor-driven liquid hero image
  reveal, scroll-progress count-up stats, adaptive-grid scale-up above 1920px, and a
  `PageTransition` wrapper that fades/slides each route's content in on navigation.
- **Global chrome**: `components/layout/header.tsx` (replaces the old `nav.tsx`),
  `components/layout/nav-overlay.tsx` (new full-screen menu), `components/layout/footer.tsx`
  — all restyled, and now shared by every route.
- **Home** (`app/page.tsx` + `components/home/*`): full rebuild — liquid-reveal hero,
  project carousel card, "Built with" tech strip, CreateBand pill row, real-project
  portfolio grid (`components/projects/project-card.tsx` restyled to the black-card
  pattern), "What I do" skills section, real-data Stats panel.
- **About** (`app/about/page.tsx`): **superseded by the minimalism pass below** — see
  that section for the current treatment.
- **Projects** (`app/projects/page.tsx`, `app/projects/[slug]/page.tsx`): restyled with
  tokens (`shell`, `TagChip`, `PillButton`, `rounded-card`) and staggered reveal
  animations on the grid and detail sections. The grid itself was later superseded by
  the spatial 3D pass below.
- **Blog** (`app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `components/blog/post-card.tsx`):
  same token/reveal treatment as Projects.
- **Contact page** (`app/contact/page.tsx`, `components/contact/contact-form.tsx`):
  restyled inputs/button to match tokens, reveal animation on load.
- **Contact modal** (`components/contact/contact-modal.tsx`): compact modal wired to
  the real `/api/contact` endpoint, reachable from Header/Hero/NavOverlay/Footer CTAs.

## High-craft interaction system (this pass)

A second motion layer added on top of the above, built as independent modular
hooks/components sharing one `requestAnimationFrame` loop (`lib/raf-ticker.ts`) instead
of each running its own — grain regen, cursor/magnetic tracking, scroll-focus blur, and
the hero character's rotation all subscribe to it rather than calling
`requestAnimationFrame` themselves. All of it respects `prefers-reduced-motion`
(verified with Playwright's `emulateMedia`) and the cursor/magnetic system is fully
disabled on touch (verified with touch-context emulation — native cursor stays, no
registry work happens at all).

- **Film grain** (`components/effects/grain-overlay.tsx`) — fixed fullscreen WebGL
  canvas, ~5% opacity procedural noise shader, regenerated every other tick.
- **Chromatic aberration** (`components/effects/chromatic-aberration.tsx`) — wraps the
  hero character's image; reads real scroll velocity directly off the existing Lenis
  instance (`getScrollVelocity()` on `ScrollProvider`), RGB-splits via an SVG filter,
  decays back to 0 once scrolling stops.
- **Magnetic + gooey cursor** (`components/effects/magnetic-cursor-provider.tsx`,
  `lib/hooks/use-magnetic.ts`) — custom cursor with an SVG goo filter that visually
  fuses into a blob toward nearby buttons/links, which also get pulled toward the
  cursor. Applied to `PillButton`, `AnimatedLink`, and both header/nav-overlay nav
  links (via small per-item wrapper components, since hooks can't run inside `.map()`
  callbacks — see `MagneticNavLink`, `NavOverlayLink`).
- **Decrypt text reveal** (`components/effects/decrypt-text.tsx`,
  `lib/hooks/use-decrypt-text.ts`) — replaces `RevealLines` for the hero headline and
  every major section title (Projects/Blog/Contact H1s, Portfolio/Services/Stats/Footer
  headings) plus each `ProjectCard` title. Character count never changes during the
  scramble (only which glyph shows), so there's no layout shift — the one exception is a
  single one-time width snap when the font swaps from JetBrains Mono (scrambling) back
  to Onest (resolved), which is a minor, accepted trade-off.
- **Scroll-focus blur depth** (`components/effects/scroll-focus.tsx`) — wraps existing
  Reveal/TiltCard components (doesn't replace them) on Home's CreateBand/Portfolio
  cards/Services rows/Stats panel, the Projects and Blog list cards, and About's
  timeline/certification/skill blocks.
- **Hero character scroll-rotation** — *(superseded — see "ProfileCard" below, which
  replaced the floating character entirely)*.
- **Synthesized UI sound** (`components/effects/ui-sound-provider.tsx`,
  `components/ui/sound-toggle.tsx`) — Web Audio API oscillator blips, no audio files.
  Defaults muted; the `AudioContext` is only created/resumed inside the unmute button's
  own click handler, so it always has a genuine user gesture behind it. Wired to
  `PillButton` hover and to every `DecryptText` heading resolving (doubles as the "major
  section transition" cue, naturally bounded since it only fires once per heading).

### Scope calls made without asking (disclosed here)

- Button-hover sound is only on `PillButton` (the primary CTAs), not every
  `AnimatedLink`/nav link — kept deliberately minimal so it reads as "barely-there"
  rather than noisy.
- Section-entrance sound reuses `DecryptText`'s own resolve event rather than adding a
  second, separate "section visible" sound trigger — one clean integration point
  instead of two overlapping ones.

## Spatial 3D project grids + About minimalism pass (latest)

Two deliberately opposite directions, both confirmed with you directly before building:

- **Spatial 3D depth-parallax** (`components/effects/spatial-grid.tsx`,
  `components/effects/spatial-card.tsx`) — applied to Home's Portfolio grid and the
  `/projects` list. `SpatialGrid` gives the whole card grid a CSS `perspective` and
  gently rotates the scene toward the cursor (lerped, max ~5°); `SpatialCard` places
  each card at a fixed `translateZ` depth (an alternating near/far pattern per index),
  so the parallax shift between cards comes for free from the browser's own perspective
  math rather than per-card computation. Verified visually with Playwright screenshots
  at different cursor positions — cards visibly skew/shift relative to each other.
  `ScrollFocus` (blur-on-scroll) was removed from these cards — layering a second,
  different "distance" cue (scroll-blur) on top of the new cursor-driven depth cue read
  as muddled, so the spatial 3D effect is the sole depth signal here now.
- **About minimalism pass** (`app/about/page.tsx`) — per your call to strip decoration
  and keep structure: removed the parallax background glow, the `TiltCard` interactive
  photo tilt, the decorative giant globe icon, the word-by-word `RevealWords` statement
  reveal, and the `Reveal3D`/`ScrollFocus` treatment on every timeline/certification/
  skill item. Replaced with: a static photo with a plain fade-in, a plain statement
  fade-in, and the timeline/certifications/skills rebuilt as clean editorial rows
  separated by hairline dividers (no bordered card boxes, no pill chips for skills —
  just label + `·`-separated plain text) with simple fade-ins only. All real content is
  unchanged, only the visual treatment changed.

## ProfileCard integration (latest)

- **Replaced the floating hero character** — `HeroCharacter` (the `rotateY`
  scroll-lerp on the standalone cartoon PNG) is gone entirely; deleted
  `components/home/hero-character.tsx`. In its place, the hero's right column now
  renders `<ProfileCard />` (`components/effects/profile-card.tsx`), a holographic
  tilt card ported from the React Bits `ProfileCard` component (JS → strict
  TypeScript, no `any`), using the same cartoon sticker as its avatar
  (`/hero/character.png`).
- **Theming** — the ported CSS (`components/effects/profile-card.css`) swapped every
  blue/purple accent for the site palette: the six `--sunpillar` holographic gradient
  stops are now warm burgundy/tan hues, the name/title gradient text and the glare
  overlay are warm-toned, and the default behind-glow color is
  `rgba(128, 1, 31, 0.55)` (burgundy) with `DEFAULT_INNER_GRADIENT` set to a
  burgundy-to-champagne diagonal.
- **Sized down for the hero slot** — the component's natural footprint is a large
  showcase card (~540px tall). A `.hero-profile-card` scoped override caps it at
  `max-height: 300px` with proportionally shrunk details/avatar-content/mini-avatar/
  handle/status/contact-button so it reads as a compact hero-sidebar element instead
  of a standalone feature card.
- **Avatar-crop fix** — the base `.pc-avatar-content .avatar` rule is `width: 100%`,
  which assumes a showcase-sized card. At the hero's shorter height, the sticker's
  tall/narrow native aspect ratio (~0.43) overflowed the card and clipped the head off
  (image is bottom-anchored). Fixed by shrinking the avatar to `width: 62%` within
  `.hero-profile-card` specifically — computed from the card's own aspect ratio vs. the
  image's native proportions — confirmed visually via Playwright screenshot that the
  full figure (face, glasses, crossed arms) now fits.
- **Content** — all real, nothing invented: `name`/`title` come from `profile`, `handle`
  is the GitHub username (`print-kendaniel`), `status` is the location
  ("Biñan, Laguna, PH") rather than an unverifiable "available for work" claim,
  `contactText="Contact"` opens the existing contact modal via `onContactClick`.
- Hover/tap the card in the hero to see the tilt, shine, and glow — tilt physics
  (exponential-smoothing pointer tracking), mobile device-orientation tilt, and the
  holographic sunpillar sweep all carried over unchanged from the source component.

## ProfileCard brightness fix + Dock + StaggeredMenu (latest)

- **ProfileCard hover brightness fix** — the hover-state shine/glare on
  `.hero-profile-card` was blowing out to near-white at pointer-center. Tamed three
  rules in `components/effects/profile-card.css`: `.pc-shine::before`'s brightness
  filter (was `2 - pointerFromCenter`, now `1.15 - pointerFromCenter * 0.25`),
  `.pc-card:hover .pc-shine`'s filter (brightness 0.85→0.7, contrast 1.5→1.25), and
  `.pc-glare`'s radial gradient stops (were near-white `hsl(30,25%,80%)`, now a muted
  `hsl(30,20%,52%)`) plus its own brightness (0.8→0.55). Tilt/shine/glow effect is
  unchanged, just calmer.
- **Dock** (`components/effects/dock.tsx` + `.css`, mounted globally via
  `components/layout/site-dock.tsx` in `app/layout.tsx`) — ported from React Bits
  (JS → TypeScript, `motion` package for the spring-based magnification), reskinned to
  burgundy (`var(--color-ink)` panel, champagne icon color). Quick-nav items: Home,
  Projects, About, Blog, Contact (opens the contact modal) — real icons added to
  `components/ui/icons.tsx` (`HomeIcon`, `FolderIcon`, `UserIcon`, `FileTextIcon`,
  `MailIcon`). Simplified from the original: dropped the outer wrapper's own animated
  height (the panel is `position: fixed` directly to the viewport bottom-center, so
  that motion value had no layout purpose here). Hidden below `768px` — a hover-driven
  magnify dock is a desktop-pointer interaction; touch/mobile already has the header's
  menu. `prefers-reduced-motion` renders a static, non-magnifying row of the same
  buttons instead of skipping the feature.
- **StaggeredMenu replaces the old `NavOverlay` content** — the previous full-screen
  ink overlay with a plain vertical link list is gone. In its place: a ported (JS →
  TypeScript, `gsap` for the timeline) right-side drawer with color-band prelayers,
  a staggered item reveal (numbered, uppercase, large type), and a socials section —
  reskinned from the original's purple/blue to champagne panel background (
  `var(--color-surface)`) with burgundy accent text and prelayer bands
  (`#80011f`/`#e0c9a0`/`#f7e7ce`). Adapted from the source, not a verbatim port: the
  original ships its own header/logo/toggle button and internal open state; since the
  site already has a `Header` with its own logo, desktop nav, and "Menu" button, the
  ported version is a **controlled** component (`open`/`onClose`/`onNavigate` props,
  no internal toggle) — `components/layout/nav-overlay.tsx` keeps orchestrating scroll
  lock and Escape-to-close (as it always did) and now also renders a click-to-close
  backdrop scrim behind the drawer. Nav items are real (Home/Projects/About/Blog +
  Contact opening the modal); socials pull from `profile.links`. Deleted
  `nav-overlay-link.tsx` (the old list-item component), fully superseded.
- Verified via Playwright: dock renders with all 5 icons at the bottom-center; card
  hover screenshot confirms the toned-down glow (no more blown-out white); menu-open
  screenshot confirms the drawer slides in with staggered numbered items and socials;
  reduced-motion context renders the static dock variant; a mobile/touch viewport
  (`<768px`) hides the dock as intended.

## Hero peek — scroll-triggered cartoon head (latest)

- **`components/home/hero-peek.tsx`**, rendered at the top of `Hero` (behind the
  headline, `z-1`) — a big cropped view of `/hero/character.png` (object-position:
  top, so it's mostly face/head/shoulders, not the full body) tucked against the left
  viewport edge, `lg:` and up only. At rest it sits mostly off-screen
  (`translateX(-72%)`); scrolling from the very top of the page eases it in
  (cubic ease-out) over the first ~260px of scroll, then it holds — the "trigger" is
  just how far the user has scrolled, so it reacts the instant they start.
- **Sticky was tried and dropped** — the natural approach ("pin it in the viewport
  for the whole hero scroll") is CSS `position: sticky`, but the hero section needs
  `overflow-hidden` for its other effects (`LiquidReveal`, the giant watermark text),
  and an `overflow-hidden` ancestor silently disables `position: sticky` on
  descendants (well-known CSS gotcha, confirmed here via a Playwright rect dump
  showing the "sticky" element's `top` tracking scroll 1:1 instead of pinning).
  Replaced with plain absolute positioning + a scroll-driven `transform`, which
  sidesteps the issue entirely and is simpler besides.
- `prefers-reduced-motion`: renders at a fixed, already-peeked position
  (`translateX(-22%)`), no scroll listener attached.
- `aria-hidden` + `pointer-events-none` throughout — purely decorative, never
  intercepts clicks on the headline/buttons it sits behind.
- Verified via Playwright at several scroll depths (0 / 130 / 260px) confirming the
  ease-in, plus a reduced-motion context (static peeked pose) and a mobile viewport
  (hidden below `lg`, `1024px`).

## LiquidHover replaces ProfileCard and the hero peek (latest)

- Both the `ProfileCard` "ID card" element and the `HeroPeek` scroll-triggered
  cartoon head (previous two entries above) are gone — deleted
  `components/effects/profile-card.tsx`/`.css` and `components/home/hero-peek.tsx`
  outright, per direct feedback that the card read as an out-of-place ID-badge and the
  request for something with "a big face" done differently.
- **`components/effects/liquid-hover.tsx`** — a WebGL fluid-distortion effect (ported
  from an Originkit component, JS → strict TypeScript: typed `FBO`/`DoubleFBO`/
  `ShaderProgram` shapes, no `any`) that ripples the user's real photo
  (`/about/portrait.jpg` — the same photo already used on the About page) as the
  pointer or a touch moves across it. Sits in the hero's right column where
  `ProfileCard` used to be, in a `3 / 4` aspect card matching the portrait's own
  proportions.
- Unchanged from the source: the full Navier–Stokes-style fluid sim (advection,
  divergence, pressure/Jacobi iteration, gradient subtraction) driving a per-pixel
  displacement of the image texture — this is what makes the ripple look liquid
  rather than a simple pointer-follow warp.
- `prefers-reduced-motion`: skips mounting the WebGL canvas entirely and renders a
  plain static `next/image` in the same rounded frame — no ripple, no listeners
  attached, matching how every other motion system in this codebase degrades.
- Touch is left wired up (unlike the magnetic-cursor system elsewhere, this isn't a
  hover-only desktop convenience — a finger dragging across the photo is the same
  interaction, just via `touchmove`, so it stays enabled).
- Verified via Playwright: idle frame shows the portrait clean and undistorted; a
  simulated pointer drag across the canvas shows the fluid ripple mid-motion; the
  reduced-motion context confirms the static-image fallback with no canvas mounted.

## ScrollExpand between Hero and the pill band (latest)

- **`components/effects/scroll-expand.tsx`** + `.css` — ported from a React Bits /
  Originkit component (JS → strict TypeScript: typed refs, a `ScrollExpandConfig`
  shape instead of an untyped props bag, no `any`). Rendered in `app/page.tsx` right
  after `<Hero />` and before `<CreateBand />` (the "Learn / Build / Ship" pill row),
  so it's the transition beat between the hero and the rest of the home page.
- A sticky-stage frame that starts as a small rounded rect holding the site name over
  a zoomed-in crop of the portrait, and expands to full-bleed as the user scrolls
  through it — `useWindowScroll` (drives off page scroll, not an internal scroller,
  since it's a normal page section, not a boxed component). Uses the same photo as
  the About page and the earlier `LiquidHover` experiment (`/about/portrait.jpg`) —
  no new asset needed.
- Content is real, not fabricated: `title` is `profile.name`, the overlay that fades
  in once fully expanded shows `profile.title` and `profile.location`.
- Left the component's own reduced-motion handling as-is rather than disabling the
  effect outright: it removes the smoothing/lag (`current = target` immediately) but
  keeps the expansion directly tied to scroll position. That's the right call for a
  scroll-*linked* transform specifically — it's not an autoplaying animation, it's a
  direct 1:1 mapping to where the user already is on the page, so killing it entirely
  would make the scroll feel broken rather than calmer. Verified via Playwright that
  the frame still expands correctly (just without lag) under
  `reducedMotion: "reduce"`.
- Kept the ported component's plain `<img>` (not `next/image`) with an eslint-disable
  — the scroll handler zooms it via direct `element.style.transform`, same rationale
  as the raw `<img>` tags in the earlier `ProfileCard`/`LiquidHover` ports.
- Verified via Playwright at rest, mid-expansion, and full-bleed scroll positions (all
  three confirm the clip-path/zoom/title/overlay crossfade), plus reduced-motion and
  a mobile viewport (390px, `scrollHint` "Scroll" visible, frame fits the narrower
  stage).

## ScrollStack for "What I do best" (latest)

- **`components/effects/scroll-stack.tsx`** + `.css` — ported from a React Bits
  component (JS → strict TypeScript: typed `CardTransform` shape, no `any`).
  Replaces the plain hairline-divided row list in `components/home/services-section.tsx`
  with a Lenis-driven pinning card stack — each service scrolls up, pins, and shrinks
  slightly as the next one arrives, so by the end all four are fanned/stacked.
- **Dropped `useWindowScroll` mode entirely** — the site already owns a single global
  Lenis instance for the whole page (`ScrollProvider`, mounted in `app/layout.tsx`).
  The original component's window-scroll mode creates its *own* independent Lenis
  instance bound to `window`, which would fight the existing one for wheel/touch
  events (two smoothers racing on the same input). Instead `ScrollStack` always uses
  its own internal scroller div with its own isolated Lenis instance
  (`wrapper`/`content` options) — fully self-contained, never touches page scroll.
  The section has a fixed height (`78vh`) so users scroll *within* the panel to move
  through the cards, then continue on to the rest of the page normally once released.
- **Found and worked around a real Tailwind v4 gotcha**: passing a Tailwind height
  utility (`h-[75vh]`) via `className` had no effect — the scroller stayed at its CSS
  default of `height: 100%`. Cause: Tailwind v4 wraps all utility classes in
  `@layer utilities`, and per the CSS cascade, anything in a named layer loses to
  *any* unlayered rule regardless of source order or selector specificity — and this
  project's own component CSS files (`scroll-stack.css` here, same as `dock.css`,
  `profile-card.css`, etc.) are plain imported stylesheets, not run through Tailwind,
  so they're unlayered and always win. Fixed by adding a proper `style` prop to
  `ScrollStack` and sizing it with an inline style instead of a class — inline styles
  aren't subject to the layer/cascade fight at all. Worth remembering for any future
  component that needs to size one of these ported effects via a Tailwind class.
- Content is the same four real service rows as before (title + description), now
  inside `ScrollStackItem` cards styled burgundy-on-champagne with a white circular
  arrow badge, matching the site palette rather than the source's plain white cards.
- `prefers-reduced-motion`: skips mounting Lenis and all scroll-transform logic
  entirely, rendering the same cards as a plain static stacked column (`.scroll-stack-static`,
  with a `height: auto !important` escape hatch so the caller's fixed-height style —
  needed for the scrolling variant — never clips the static fallback).
- Verified via Playwright: entering the section shows card 1 pinned; scrolling the
  internal panel shows the stacking/scaling mid-transition and the fully-fanned state;
  reduced-motion renders all four cards plainly with no clipping; a 390px mobile
  viewport scrolls the stack via touch correctly.

## TextPressure replaces the hero headline (latest)

- **`components/effects/text-pressure.tsx`** + `.css` — ported from a React Bits /
  CodePen component (JS → strict TypeScript, no `any`). Replaces the hero's
  `DecryptText` tagline (`components/home/hero.tsx`) with a variable-font display of
  the full name (`profile.name`, "Ken Daniel Llamanzares") whose weight shifts
  per-character based on distance from the cursor (or touch point) — bold near the
  pointer, light further away.
- **Font loading changed from the source**: the original does a runtime `@import` of
  a Google Fonts URL inside a `<style>` tag at mount. This app already loads every
  font through `next/font` (`app/layout.tsx`), so instead `hero.tsx` loads
  `Roboto_Flex` via `next/font/google` and passes the resolved `fontFamily` in —
  properly self-hosted/preloaded like the rest of the site's type, no runtime CSS
  fetch or FOUT.
- **Found and fixed a real bug in the ported source**, not just a style tweak: with
  `flex={true}` (the original's default), the per-character `<span>` for a space is a
  lone whitespace text node inside `display: inline-block` — that collapses to zero
  width in every browser tested. The original's own demos only ever pass single words
  ("Compressa", "Hello!"), so this never surfaced; a real multi-word name renders as
  one run-together word. Fixed by rendering a non-breaking space (` `) instead of
  a literal space for those spans, and separately switched `flex={false}` (normal
  inline-block flow reads better for real running text than the demo's edge-to-edge
  `justify-content: space-between` stretch).
- **Found and fixed a second real bug**: the source's font-size heuristic
  (`containerWidth / (charCount / 2)`, i.e. assume ~0.5em average character advance)
  undershoots for Roboto Flex, which measures wider — on a narrow mobile container
  this overflowed the name past the viewport edge (confirmed via Playwright: rendered
  width 399px inside a 347px container). Added one corrective pass after the initial
  layout: measure the actual rendered `scrollWidth` and shrink to fit if it exceeds
  the container, instead of trusting the fixed-ratio estimate blindly. Verified fixed
  at 390px, 320px, and 1440px viewports.
- Renamed the ported CSS's bare `.flex`/`.stroke` classes to `.text-pressure-flex`/
  `.text-pressure-stroke` — after the Tailwind-v4-layer discovery documented above
  (unlayered component CSS always beats Tailwind's `@layer`-wrapped utilities), a bare
  `.flex{justify-content:space-between}` here would have silently broken every
  Tailwind `flex` element site-wide, not just this component.
- `width` axis disabled for this usage (`width={false}`) — it's the dominant driver of
  the mobile overflow above (a mid-word character can swing from `wdth` 5 to 200), and
  the weight-only pressure effect alone still reads clearly as the "pressure" look.
  `italic` also disabled — Roboto Flex has no true `ital` axis (it uses `slnt`
  instead), so passing it was a silent no-op.
- `prefers-reduced-motion`: skips the mousemove/touchmove listeners and the
  per-frame rAF loop entirely, leaving the text at the font's default axis values
  (uniform weight, no pointer-tracking) — verified via Playwright.
- Touch left enabled (same reasoning as `LiquidHover`'s touch support): a finger
  crossing the name is the direct equivalent interaction, not a hover-only
  desktop convenience.

## Known simplifications vs. the original spec (disclosed, not oversights)

- Hover "spring" motion uses CSS transitions with spring-like cubic-bezier easings
  instead of literal per-element rAF physics — cheaper and simpler, reads the same.
- The hero carousel card swaps captions instantly (no crossfade animation) when you
  click through it — the dots/arrows still animate, just not the text swap itself.
- No same-page anchor smooth-scrolling between sections (e.g. a "View Work" link just
  navigates to `/projects` rather than scrolling to an in-page section) — this is a
  multi-page app, not the single-page site the spec was written for.

## Still using the original plain treatment

- **Projects/Blog detail markdown body** — the `ReactMarkdown` output on
  `app/projects/[slug]/page.tsx` and `app/blog/[slug]/page.tsx` still has no typographic
  styling (no `@tailwindcss/typography` or equivalent) — headings/lists/code blocks
  inside project/post descriptions render with browser defaults.
- **Auth** (`app/login/page.tsx`) — bare form, no branding treatment.
- **Admin** (all of `/admin/*`) — entirely functional, zero design pass. This is the CMS
  you'll use daily, worth prioritizing next: `app/admin/layout.tsx`,
  `app/admin/page.tsx`, `components/admin/project-form.tsx`,
  `components/admin/post-form.tsx`, `components/admin/message-row.tsx`,
  `components/admin/delete-button.tsx`, `components/admin/logout-button.tsx`.
- OG image templates (`app/**/opengraph-image.tsx`) — still plain text on white
  background, not restyled to match the new palette.
- No dark mode.
- No loading skeletons — `loading.tsx` files still just render "Loading…" text.
