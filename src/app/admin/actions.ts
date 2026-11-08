'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { recordAttempt, isLockedOut } from '@/features/auth/attempts';
import { createSession, destroySession } from '@/features/auth/session';
import { checkCredentials, setupOwner } from '@/features/auth/users';
import { clientIp } from '@/lib/http/security';
import { slugify } from '@/features/posts/mutations';

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const h = await headers();
  const ip = clientIp(h);
  if (await isLockedOut(email)) {
    redirect('/admin/login?error=Too many failed attempts. Wait 15 minutes and try again.');
  }
  const user = await checkCredentials(email, password);
  await recordAttempt(email, ip, Boolean(user));
  if (!user) redirect('/admin/login?error=Wrong email or password.');
  await createSession(user!.id);
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}

export async function setupAction(formData: FormData): Promise<void> {
  const displayName = String(formData.get('display_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const slug = slugify(String(formData.get('slug') ?? '')) || 'owner';
  if (!displayName || !email.includes('@') || password.length < 10) {
    redirect('/admin/setup?error=Fill everything in, and use a password of at least 10 characters.');
  }
  let user;
  try {
    user = await setupOwner({ displayName, email, password, slug });
  } catch (err) {
    if (err instanceof Error && err.message === 'SETUP_DONE') {
      redirect('/admin/setup?error=Setup is already complete. Log in instead.');
    }
    console.error('setup failed', err);
    redirect('/admin/setup?error=Setup failed before anything was saved. Try again.');
  }
  await createSession(user!.id);
  redirect('/admin');
}
