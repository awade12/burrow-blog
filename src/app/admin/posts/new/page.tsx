import Editor from '@/components/admin/Editor';
import { requireAdminPage } from '@/features/auth/guard';
import { listAuthors } from '@/features/auth/users';
import { createPostAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdminPage();
  const authors = await listAuthors();
  const { error } = await searchParams;
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>New post</h1>
      {error ? <p className="error">{error}</p> : null}
      <Editor authors={authors} action={createPostAction} />
    </div>
  );
}
