'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { currentUser } from '@/features/auth/session';
import { saveUpload } from '@/features/media/store';

export async function uploadAction(formData: FormData): Promise<void> {
  const user = await currentUser();
  if (!user) redirect('/admin/login');
  const file = formData.get('file');
  const alt = String(formData.get('alt') ?? '');
  if (!(file instanceof File) || file.size === 0) redirect('/admin/media?error=Pick a file first.');
  try {
    await saveUpload(file as File, alt, user!.id);
  } catch (e) {
    redirect(`/admin/media?error=${e instanceof Error ? e.message : 'Upload failed.'}`);
  }
  revalidatePath('/admin/media');
  redirect('/admin/media?saved=1');
}
