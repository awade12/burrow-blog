# The Warren design brief: modern polish pass

Owner feedback (2026-11-08): the site works but "looks like a 2010
site". Target: the finish level of Linear, Vercel, Raycast and
Stripe's blog. Same product, same brand (near-black, Burrow green
#9BD26A, the two green critters), dramatically better craft.

## What "polished" means here (concrete, not vibes)

1. **Typography carries the design.** Inter Variable is self-hosted
   at `public/fonts/InterVariable.woff2` and wired via
   `next/font/local` in the root layout (variable `--font-inter`).
   Headings: weight 650 to 750, letter-spacing -0.03em, tight
   line-height. Body: 400/450, muted gray-green. Eyebrow labels:
   12px, uppercase, letter-spacing 0.08em, green or muted.
2. **Depth without heaviness.** Background #0A0B0C with a very
   subtle radial green glow at the top of the page and hairline
   borders `rgba(255,255,255,0.08)`. Cards: linear-gradient surface
   (white 3% to 1%), 1px border, inset top highlight, soft shadow.
   Nothing flat-gray-boxy.
3. **Micro-interactions in CSS only** (reader pages stay zero
   client JS): cards lift 2px and the border warms to green on
   hover, the arrow in "read more" style links translates 2px,
   links get underline offsets, focus-visible rings everywhere.
4. **Spacing rhythm.** 8pt scale, generous section spacing
   (72 to 96px desktop), container 1120px, article measure 680px.
5. **Details people feel:** selection color green, refined
   scrollbars in the editor, code blocks as dark panels with a
   language label bar, tables with hairline rows, badges as soft
   pills with dot indicators, byline with a small critter avatar
   chip, reading progress is NOT wanted (gimmick), no popups, no
   gradients on text except the hero accent word.
6. **Hero with intent:** eyebrow ("The Burrow blog"), the critter
   mark smaller and treated as an icon, huge tight headline,
   sub copy in muted, and the latest post featured as a large
   card rather than one of nine equals.
7. **Admin gets the same system** (it is a product too): left
   sidebar nav on desktop (top bar collapses on mobile), segmented
   controls, refined tables (row hover, hairlines), stat cards
   with real hierarchy, and an editor that feels like a writing
   tool: calm chrome, the document is the hero.

## Hard constraints

- AGENTS.md rules stand: 500 LOC cap per file, feature folders,
  reader pages are Server Components with no new client JS, all
  CSS in the existing global stylesheet for the public site and a
  dedicated `src/app/admin/admin.css` for admin.
- Keep every existing class hook working or update all usages
  together. Do not break routes, forms, or server actions.
- No em dashes in user-facing copy. Burrow voice stays.
- Mobile must stay perfect: the 390px checks (no horizontal
  overflow, two-row header with full CTA) must still pass.
- Performance: no new runtime dependencies, no images added to
  public pages beyond the font and existing art, CSS stays in
  the two stylesheets.
