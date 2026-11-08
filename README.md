# The Warren

A tiny, fast, open-source CMS for a blog, guides library and updates
feed. Built for [Burrow](https://burrowservers.com) (game servers you
split with friends), written to be borrowed: one Next.js app, one
Postgres, posts stored as plain Markdown. No plugin system, no page
builder, no lock-in.

Live at [blog.burrowservers.com](https://blog.burrowservers.com) once
launched; developed in the open under the MIT license.

## Why this exists

We tried an off-the-shelf headless CMS. It worked, but it meant the
marketing site depended on someone else's platform and data format.
The Warren is the opposite bet: boring stack, tiny surface, content as
Markdown in a database we own, and an admin that does exactly three
things well (blog posts, guides, updates).

## Features

- Three sections (blog, guides, updates) with per-game guide indexes
- Markdown authoring with a live preview that renders through the
  exact same code path as the public site
- Draft, review, scheduled and published workflow
- Good auth: scrypt password hashing, hashed DB sessions, login
  throttling with lockout, CSRF origin checks, no public sign-up
- A drafts-only API token system: automation (in our case an AI
  teammate) can draft posts but can never publish them
- Media uploads with unguessable filenames and immutable caching
- RSS (combined and per section), sitemap, canonical URLs, Open
  Graph, JSON-LD, reading time, tables of contents on guides
- Fast by construction: reader pages are Server Components with no
  client JS beyond the framework runtime, no webfonts, short
  `s-maxage` caching with stale-while-revalidate

## Quickstart

```bash
cp .env.example .env   # set PG_PASSWORD and SESSION_SECRET
docker compose up -d --build
```

That runs Postgres, applies `db/migrations/`, and starts the app on
`http://localhost:3100` (bound to localhost; put your own reverse
proxy in front).

Then:

1. Open `/admin/setup` and create the owner account (first run only).
2. Optional: `docker compose exec app node scripts/seed.mjs` for the
   starter authors and launch posts.
3. Optional: `docker compose exec app node scripts/create-token.mjs "ivy drafts"`
   to mint a drafts API token.

## Route map

| Route | What |
|---|---|
| `/` | Mixed feed, guides by game, latest updates |
| `/posts`, `/posts/[slug]` | Blog |
| `/guides`, `/guides/[slug]` | Guides (TOC, last verified, game index at `/guides?game=`) |
| `/updates`, `/updates/[slug]` | Updates and changelogs |
| `/tags/[tag]`, `/search` | Discovery |
| `/rss.xml`, `/rss/[section]` | Feeds |
| `/sitemap.xml`, `/robots.txt` | SEO plumbing |
| `/media/[name]` | Uploaded media (immutable cache) |
| `/admin` | Dashboard, posts, editor, media, tokens, team |
| `/api/v1/drafts` | Drafts API (Bearer token, drafts only) |
| `/api/preview` | Session-guarded Markdown preview for the editor |
| `/api/health` | DB-backed health check |

## Working in this repo

Read `AGENTS.md` first. The short version: 500 lines per file maximum
(enforced by `npm run check:size`), feature folders over file dumps,
server components on reader pages, all SQL parameterised and owned by
its feature, secrets only from the environment.

## Development

```bash
npm install
npm run dev        # needs DATABASE_URL pointing at any Postgres
npm run typecheck
npm run check:size
```

## License

MIT. See `LICENSE`. The Burrow name, logos and critter artwork in
`public/` belong to Wade Holdings Group LLC; swap in your own brand
art when you fork.
