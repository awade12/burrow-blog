'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { currentUser } from '@/features/auth/session';
import { createAuthorProfile, createLoginUser } from '@/features/auth/users';
import { slugify } from '@/features/posts/mutations';

async function guard() {
  const user = await currentUser();
  if (!user) redirect('/admin/login');
}

export async function addProfileAction(formData: FormData): Promise<void> {
  await guard();
  const name = String(formData.get('display_name') ?? '').trim();
  const slug = slugify(String(formData.get('slug') ?? '')) || slugify(name);
  if (name && slug) await createAuthorProfile(slug, name);
  revalidatePath('/admin/team');
  redirect('/admin/team');
}

export async function addLoginAction(formData: FormData): Promise<void> {
  await guard();
  const displayName = String(formData.get('display_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const slug = slugify(String(formData.get('slug') ?? '')) || slugify(displayName);
  if (!displayName || !email.includes('@') || password.length < 10) {
    redirect('/admin/team?error=Logins need a name, an email, and a 10+ character password.');
  }
  await createLoginUser({ slug, displayName, email, password });
  revalidatePath('/admin/team');
  redirect('/admin/team');
}
