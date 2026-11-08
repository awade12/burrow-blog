# AGENTS.md — rules for anyone (human or AI) working in this repo

This is an open-source project. Write code a stranger can read, run, and
trust. When a rule here conflicts with finishing faster, the rule wins.

## Hard rules (enforced)

1. **500 lines per file, maximum.** Target 300. If a file is heading past
   the cap, split it by responsibility into its feature folder before it
   gets there. `npm run check:size` enforces this and must pass.
2. **Folders, not file dumps.** Code lives in feature folders
   (`src/features/<name>/`). The repo root holds config files only.
   `src/app/` holds routes only, and route files stay thin: they call a
   feature function and render. No business logic in routes.
3. **Layering.** `app` -> `features` -> `lib`. `lib` never imports from
   `features`. `components` are presentational and never touch the
   database. No circular imports.
4. **All SQL lives in the feature that owns the data**, in `queries.ts`
   files, always parameterised. Never string-build SQL with user input.
   Migrations are numbered, append-only, and never edited after merge.

## Performance rules (this blog must stay lightning fast)

5. **Reader pages are Server Components.** Zero client components on
   public pages unless a rule-breaking reason is documented in the PR.
   The admin editor is the one place client JS is expected.
6. **No new runtime dependency without a written justification** in the
   PR description (what it replaces, its size, why stdlib or an existing
   dep cannot do it).
7. **No third-party font services.** Typography is the self-hosted
   Inter Variable (one woff2, `next/font/local`, display swap);
   external font CDNs are banned. No client-side data fetching for
   content, images always carry width and height, uploads are served
   with immutable cache headers.
8. Every public route sets deliberate cache headers. HTML: short
   `s-maxage` with `stale-while-revalidate`. Static assets: immutable.

## Security rules

9. Passwords: scrypt (node:crypto), per-user salt, `timingSafeEqual`.
   Sessions and API tokens are stored **hashed** (SHA-256) in the
   database, never in plain text, never logged.
10. Session cookie: `HttpOnly`, `Secure`, `SameSite=Lax`, path `/`.
11. Every state-changing request passes an origin check (CSRF). Auth
    routes are rate limited and logins lock after repeated failures.
12. All rendered Markdown is sanitised server-side. Treat post bodies
    as untrusted input, even our own.
13. Secrets come from the environment only. If a secret appears in a
    file, a log, or a commit, it is compromised: rotate it.

## Code style

14. TypeScript strict mode. No `any` without a comment saying why.
    No default exports except where Next.js requires them.
15. Files are kebab-case. Components are PascalCase. One component or
    one responsibility per file (see rule 1).
16. Functions do one thing and are named for what they return or do.
    Comments explain *why*, not *what*.
17. User-facing copy follows the Burrow voice: plain, warm, specific.
    **No em dashes in user-facing copy.** Use commas or periods.

## Workflow

18. Small commits, imperative messages ("Add guide index", not
    "changes"). A change that adds a route also adds or updates its
    entry in the README route map.
19. Before pushing: `npm run typecheck`, `npm run check:size`, and a
    production build must all pass.
20. Do not add a feature that is not in the plan (docs/PLAN.md lives
    with the project owners) without opening an issue first. Small
    scope is a feature of this codebase, not a limitation.

## Repo map

- `src/app/` — routes (public site, admin, API). Thin by rule 2.
- `src/features/` — one folder per feature: `posts`, `auth`, `media`,
  `seo`. Each owns its queries, types, and server logic.
- `src/components/` — shared presentational components.
- `src/lib/` — framework-level helpers: `db`, `markdown`, `http`,
  `config`. No feature logic here.
- `src/content/` — seed content and static copy.
- `db/migrations/` — numbered SQL migrations.
- `scripts/` — migrate, seed, token creation, and the size checker.
