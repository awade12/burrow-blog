# Changelog

## 0.1.0, 2026-11-08

First working release, built in one night for Burrow.

- Public site: mixed home feed, blog / guides / updates sections,
  per-game guide indexes, tag pages, search, RSS (combined and per
  section), sitemap, canonical URLs, Open Graph and JSON-LD,
  tables of contents and reading time on articles, slug redirects.
- Workflow: draft, review, scheduled and published posts, with
  scheduled posts going live automatically at their time.
- Admin: first-run owner setup (claims a seed author profile),
  team logins and author profiles, dashboard stats, Markdown editor
  with true live preview, media uploads, API token management.
- Auth: scrypt password hashing (explicit maxmem), hashed database
  sessions, login throttling with lockout, CSRF origin checks,
  drafts-only API tokens that can never publish.
- Ops: Docker Compose (Postgres, migrations, app), nightly backup
  guidance, /api/health endpoint.
- Repo rules in AGENTS.md, including the enforced 500 LOC file cap.
