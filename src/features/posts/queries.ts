import 'server-only';
import { query, queryOne } from '@/lib/db/pool';
import type { Post, PostSummary, Section, Status } from './types';

export const PUBLICLY_VISIBLE =
  "(p.status = 'published' or (p.status = 'scheduled' and p.scheduled_at <= now()))";

const POST_COLUMNS = `
  p.id, p.section, p.slug, p.title, p.excerpt, p.body_md, p.cover_path,
  p.tags, p.author_id, u.display_name as author_name, u.slug as author_slug,
  p.status, p.game, p.difficulty, p.last_verified::text, p.seo_title,
  p.seo_description, p.published_at::text, p.scheduled_at::text, p.created_at::text, p.updated_at::text`;

export async function listPublished(section?: Section, limit = 30): Promise<PostSummary[]> {
  return query<PostSummary & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id
      where ${PUBLICLY_VISIBLE} ${section ? 'and p.section = $2' : ''}
      order by p.published_at desc nulls last limit $1`,
    section ? [limit, section] : [limit],
  ) as Promise<PostSummary[]>;
}

export async function getPublishedBySlug(slug: string): Promise<Post | null> {
  return queryOne<Post & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id
      where p.slug = $1 and ${PUBLICLY_VISIBLE}`,
    [slug],
  ) as Promise<Post | null>;
}

export async function redirectTargetFor(oldSlug: string): Promise<string | null> {
  const row = await queryOne<{ slug: string }>(
    `select p.slug from slug_redirects r join posts p on p.id = r.post_id
      where r.old_slug = $1 and (p.status = 'published' or (p.status = 'scheduled' and p.scheduled_at <= now()))`,
    [oldSlug],
  );
  return row?.slug ?? null;
}

export async function listAllForAdmin(status?: Status): Promise<PostSummary[]> {
  return query<PostSummary & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id
      ${status ? 'where p.status = $1' : ''}
      order by p.updated_at desc limit 200`,
    status ? [status] : [],
  ) as Promise<PostSummary[]>;
}

export async function getById(id: string): Promise<Post | null> {
  return queryOne<Post & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id where p.id = $1`,
    [id],
  ) as Promise<Post | null>;
}

export async function listGames(): Promise<string[]> {
  const rows = await query<{ game: string }>(
    `select distinct game from posts p
      where (p.status = 'published' or (p.status = 'scheduled' and p.scheduled_at <= now()))
        and p.section = 'guides' and p.game is not null
      order by game`,
  );
  return rows.map((r) => r.game);
}

export async function listPublishedByGame(game: string): Promise<PostSummary[]> {
  return query<PostSummary & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id
      where ${PUBLICLY_VISIBLE} and p.section = 'guides' and p.game = $1
      order by p.published_at desc nulls last`,
    [game],
  ) as Promise<PostSummary[]>;
}

export async function searchPublished(term: string): Promise<PostSummary[]> {
  const like = `%${term}%`;
  return query<PostSummary & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id
      where ${PUBLICLY_VISIBLE}
        and (p.title ilike $1 or p.body_md ilike $1 or p.game ilike $1
             or array_to_string(p.tags, ' ') ilike $1)
      order by p.published_at desc nulls last limit 30`,
    [like],
  ) as Promise<PostSummary[]>;
}

export async function relatedPosts(post: Post, limit = 3): Promise<PostSummary[]> {
  return query<PostSummary & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id
      where ${PUBLICLY_VISIBLE} and p.id <> $1
        and ((p.game is not null and p.game = $2) or p.tags && $3::text[] or p.section = $4)
      order by (p.game = $2) desc, p.published_at desc nulls last limit $5`,
    [post.id, post.game, post.tags, post.section, limit],
  ) as Promise<PostSummary[]>;
}

export async function neighbours(post: Post): Promise<{ prev: PostSummary | null; next: PostSummary | null }> {
  const stamp = post.published_at ?? post.created_at;
  const prev = await queryOne<PostSummary & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id
      where ${PUBLICLY_VISIBLE} and p.section = $1
        and coalesce(p.published_at, p.created_at) < $2::timestamptz
      order by coalesce(p.published_at, p.created_at) desc limit 1`,
    [post.section, stamp],
  ) as PostSummary | null;
  const next = await queryOne<PostSummary & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id
      where ${PUBLICLY_VISIBLE} and p.section = $1
        and coalesce(p.published_at, p.created_at) > $2::timestamptz
      order by coalesce(p.published_at, p.created_at) asc limit 1`,
    [post.section, stamp],
  ) as PostSummary | null;
  return { prev, next };
}

export async function listPublishedByTag(tag: string): Promise<PostSummary[]> {
  return query<PostSummary & Record<string, unknown>>(
    `select ${POST_COLUMNS} from posts p join users u on u.id = p.author_id
      where ${PUBLICLY_VISIBLE} and $1 = any(p.tags)
      order by p.published_at desc nulls last limit 40`,
    [tag],
  ) as Promise<PostSummary[]>;
}

export async function sitemapPosts(): Promise<{ slug: string; section: Section; updated_at: string }[]> {
  return query<{ slug: string; section: Section; updated_at: string }>(
    `select slug, section, updated_at::text from posts p where ${PUBLICLY_VISIBLE}`,
  );
}
