import { notFound } from 'next/navigation';
import Editor from '@/components/admin/Editor';
import { requireAdminPage } from '@/features/auth/guard';
import { listAuthors } from '@/features/auth/users';
import { getById } from '@/features/posts/queries';
import { updatePostAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdminPage();
  const { id } = await params;
  const { saved } = await searchParams;
  const [post, authors] = await Promise.all([getById(id), listAuthors()]);
  if (!post) notFound();
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Edit post</h1>
      {saved ? <p className="notice">Saved.</p> : null}
      <Editor authors={authors} post={post} action={updatePostAction.bind(null, id)} />
    </div>
  );
}
