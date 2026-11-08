import 'server-only';
import { query, queryOne } from '@/lib/db/pool';
import { autoExcerpt } from '@/lib/markdown/render';
import type { Difficulty, Section, Status } from './types';

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'untitled';
}

export type PostInput = {
  section: Section;
  title: string;
  slug?: string;
  excerpt?: string;
  body_md: string;
  tags?: string[];
  game?: string | null;
  difficulty?: Difficulty | null;
  cover_path?: string | null;
  seo_title?: string;
  seo_description?: string;
  last_verified?: string | null;
};

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let n = 2;
  for (;;) {
    const row = await queryOne<{ id: string }>(
      'select id from posts where slug = $1',
      [slug],
    );
    if (!row || row.id === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function createPost(authorId: string, input: PostInput): Promise<string> {
  const slug = await uniqueSlug(slugify(input.slug || input.title));
  const row = await queryOne<{ id: string }>(
    `insert into posts
       (section, slug, title, excerpt, body_md, tags, author_id, game,
        difficulty, cover_path, seo_title, seo_description, last_verified)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     returning id`,
    [
      input.section, slug, input.title,
      input.excerpt || autoExcerpt(input.body_md),
      input.body_md, input.tags ?? [], authorId, input.game ?? null,
      input.difficulty ?? null, input.cover_path ?? null,
      input.seo_title ?? '', input.seo_description ?? '',
      input.last_verified ?? null,
    ],
  );
  return row!.id;
}

export async function updatePost(id: string, input: PostInput): Promise<void> {
  const existing = await queryOne<{ slug: string }>('select slug from posts where id = $1', [id]);
  if (!existing) throw new Error('NOT_FOUND');
  let slug = existing.slug;
  if (input.slug && slugify(input.slug) !== existing.slug) {
    slug = await uniqueSlug(slugify(input.slug), id);
    await query(
      `insert into slug_redirects (old_slug, post_id) values ($1, $2)
       on conflict (old_slug) do update set post_id = excluded.post_id`,
      [existing.slug, id],
    );
  }
  await query(
    `update posts set section=$2, slug=$3, title=$4, excerpt=$5, body_md=$6,
       tags=$7, game=$8, difficulty=$9, cover_path=$10, seo_title=$11,
       seo_description=$12, last_verified=$13, updated_at=now()
     where id=$1`,
    [
      id, input.section, slug, input.title,
      input.excerpt || autoExcerpt(input.body_md),
      input.body_md, input.tags ?? [], input.game ?? null,
      input.difficulty ?? null, input.cover_path ?? null,
      input.seo_title ?? '', input.seo_description ?? '',
      input.last_verified ?? null,
    ],
  );
}

export async function setStatus(id: string, status: Status): Promise<void> {
  await query(
    `update posts set status = $2,
       published_at = case when $2 = 'published' and published_at is null
                           then now() else published_at end,
       updated_at = now()
     where id = $1`,
    [id, status],
  );
}

export async function deletePost(id: string): Promise<void> {
  await query('delete from posts where id = $1', [id]);
}

export async function schedulePost(id: string, when: Date): Promise<void> {
  await query(
    `update posts set status = 'scheduled', scheduled_at = $2,
       published_at = coalesce(published_at, $2), updated_at = now()
     where id = $1`,
    [id, when.toISOString()],
  );
}
