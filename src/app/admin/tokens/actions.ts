'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { currentUser } from '@/features/auth/session';
import { createApiToken } from '@/features/auth/tokens';
import { query } from '@/lib/db/pool';

async function guard() {
  const user = await currentUser();
  if (!user) redirect('/admin/login');
  return user!;
}

// Returns the plain token exactly once; only its hash is stored.
export async function createTokenAction(formData: FormData): Promise<{ token?: string; error?: string }> {
  const user = await guard();
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return { error: 'Name the token (for example: ivy drafts).' };
  const token = await createApiToken(name, user.id);
  revalidatePath('/admin/tokens');
  return { token };
}

export async function revokeTokenAction(id: string): Promise<void> {
  await guard();
  await query('update api_tokens set revoked_at = now() where id = $1 and revoked_at is null', [id]);
  revalidatePath('/admin/tokens');
  redirect('/admin/tokens');
}
