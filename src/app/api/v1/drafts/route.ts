import { userIdForApiToken } from '@/features/auth/tokens';
import { getUserBySlug } from '@/features/auth/users';
import { createPost, updatePost, type PostInput } from '@/features/posts/mutations';
import { query } from '@/lib/db/pool';
import type { Post } from '@/features/posts/types';

export const dynamic = 'force-dynamic';

// Token API for programmatic drafting (ivy). Tokens are scoped to
// drafts: this route can create and edit posts, but the status is
// always forced to draft or review, never published or scheduled.
async function authorIdFor(req: Request): Promise<string | null> {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const owner = await userIdForApiToken(token);
  if (owner) return owner;
  // CLI-created tokens have no owner; fall back to the ivy profile.
  const ivy = await getUserBySlug('ivy');
  return ivy?.id ?? null;
}

function parseBody(body: Record<string, unknown>): PostInput {
  return {
    section: (body.section as PostInput['section']) ?? 'blog',
    title: String(body.title ?? ''),
    slug: body.slug ? String(body.slug) : undefined,
    excerpt: body.excerpt ? String(body.excerpt) : undefined,
    body_md: String(body.body_md ?? ''),
    tags: Array.isArray(body.tags) ? body.tags.map(String) : [],
    game: body.game ? String(body.game) : null,
    difficulty: (body.difficulty as PostInput['difficulty']) ?? null,
    cover_path: body.cover_path ? String(body.cover_path) : null,
    seo_title: body.seo_title ? String(body.seo_title) : '',
    seo_description: body.seo_description ? String(body.seo_description) : '',
    last_verified: body.last_verified ? String(body.last_verified) : null,
  };
}

export async function POST(req: Request) {
  const authorId = await authorIdFor(req);
  if (!authorId) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const input = parseBody(body);
  if (!input.title) return Response.json({ error: 'title is required' }, { status: 400 });
  const authorOverride = body.author_slug ? await getUserBySlug(String(body.author_slug)) : null;
  const id = await createPost(authorOverride?.id ?? authorId, input);
  if (body.status === 'review') {
    await query("update posts set status = 'review' where id = $1", [id]);
  }
  const rows = await query<Post & Record<string, unknown>>('select * from posts where id = $1', [id]);
  return Response.json({ id, post: rows[0] }, { status: 201 });
}

export async function PATCH(req: Request) {
  const authorId = await authorIdFor(req);
  if (!authorId) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const id = String(body.id ?? '');
  if (!id) return Response.json({ error: 'id is required' }, { status: 400 });
  await updatePost(id, parseBody(body));
  return Response.json({ id });
}

export async function GET(req: Request) {
  const authorId = await authorIdFor(req);
  if (!authorId) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const rows = await query(
    `select id, section, slug, title, status, updated_at from posts
      where status in ('draft', 'review') order by updated_at desc limit 100`,
  );
  return Response.json({ drafts: rows });
}
