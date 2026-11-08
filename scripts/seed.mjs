// Seeds author profiles and the launch posts from
// src/content/seed-posts.json. Idempotent: existing slugs are skipped.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

const data = JSON.parse(
  readFileSync(join(process.cwd(), 'src', 'content', 'seed-posts.json'), 'utf8'),
);
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const AUTHORS = {
  andrew: 'Andrew Wade',
  dakota: 'Dakota',
  ivy: 'ivy',
  'burrow-team': 'The Burrow team',
};
const authorIds = {};
for (const [slug, name] of Object.entries(AUTHORS)) {
  const res = await client.query(
    `insert into users (slug, display_name) values ($1, $2)
     on conflict (slug) do update set display_name = excluded.display_name
     returning id`,
    [slug, name],
  );
  authorIds[slug] = res.rows[0].id;
}

for (const post of data.posts) {
  const exists = await client.query('select 1 from posts where slug = $1', [post.slug]);
  if (exists.rowCount) {
    console.log(`skip (exists): ${post.slug}`);
    continue;
  }
  await client.query(
    `insert into posts (section, slug, title, excerpt, body_md, tags, author_id,
       status, game, difficulty, published_at)
     values ($1,$2,$3,$4,$5,$6,$7,'published',$8,$9, now())`,
    [
      post.section, post.slug, post.title, post.excerpt ?? '', post.body,
      post.tags ?? [], authorIds[post.authorSlug] ?? authorIds['burrow-team'],
      post.game ?? null, post.difficulty ?? null,
    ],
  );
  console.log(`seeded: ${post.slug}`);
}
await client.end();
console.log('seed complete');
