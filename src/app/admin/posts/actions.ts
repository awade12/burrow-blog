'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { currentUser } from '@/features/auth/session';
import {
  createPost, deletePost, schedulePost, setStatus, slugify, updatePost,
  type PostInput,
} from '@/features/posts/mutations';
import type { Difficulty, Section, Status } from '@/features/posts/types';

async function guard() {
  const user = await currentUser();
  if (!user) redirect('/admin/login');
  return user!;
}

function parseTags(raw: string): string[] {
  return raw.split(',').map((t) => slugify(t.trim())).filter(Boolean).slice(0, 8);
}

function parseForm(formData: FormData): { input: PostInput; authorId: string | null; intent: string; when: string } {
  const input: PostInput = {
    section: (String(formData.get('section') ?? 'blog') as Section),
    title: String(formData.get('title') ?? '').trim(),
    slug: String(formData.get('slug') ?? '').trim(),
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    body_md: String(formData.get('body_md') ?? ''),
    tags: parseTags(String(formData.get('tags') ?? '')),
    game: String(formData.get('game') ?? '').trim() || null,
    difficulty: (String(formData.get('difficulty') ?? '') || null) as Difficulty | null,
    cover_path: String(formData.get('cover_path') ?? '').trim() || null,
    seo_title: String(formData.get('seo_title') ?? '').trim(),
    seo_description: String(formData.get('seo_description') ?? '').trim(),
    last_verified: String(formData.get('last_verified') ?? '') || null,
  };
  return {
    input,
    authorId: String(formData.get('author_id') ?? '') || null,
    intent: String(formData.get('intent') ?? 'draft'),
    when: String(formData.get('scheduled_at') ?? ''),
  };
}

async function applyIntent(id: string, intent: string, when: string): Promise<void> {
  if (intent === 'published') await setStatus(id, 'published');
  else if (intent === 'review') await setStatus(id, 'review');
  else if (intent === 'scheduled' && when) await schedulePost(id, new Date(when));
  else if (intent === 'draft') await setStatus(id, 'draft');
}

async function setAuthor(id: string, authorId: string | null): Promise<void> {
  if (!authorId) return;
  const { query } = await import('@/lib/db/pool');
  await query('update posts set author_id = $2 where id = $1', [id, authorId]);
}

export async function createPostAction(formData: FormData): Promise<void> {
  const user = await guard();
  const { input, authorId, intent, when } = parseForm(formData);
  if (!input.title) redirect('/admin/posts/new?error=Give it a title first.');
  const id = await createPost(authorId ?? user.id, input);
  if (authorId) await setAuthor(id, authorId);
  await applyIntent(id, intent, when);
  revalidatePath('/', 'layout');
  redirect(`/admin/posts/${id}?saved=1`);
}

export async function updatePostAction(id: string, formData: FormData): Promise<void> {
  await guard();
  const { input, authorId, intent, when } = parseForm(formData);
  await updatePost(id, input);
  if (authorId) await setAuthor(id, authorId);
  await applyIntent(id, intent, when);
  revalidatePath('/', 'layout');
  redirect(`/admin/posts/${id}?saved=1`);
}

export async function quickStatusAction(id: string, status: Status): Promise<void> {
  await guard();
  await setStatus(id, status);
  revalidatePath('/', 'layout');
  redirect('/admin/posts');
}

export async function deletePostAction(id: string): Promise<void> {
  await guard();
  await deletePost(id);
  revalidatePath('/', 'layout');
  redirect('/admin/posts');
}
