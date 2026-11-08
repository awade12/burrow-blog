import Link from 'next/link';
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
      <Link className="adm-backlink" href="/admin/posts">← All posts</Link>
      <div className="adm-page-head">
        <div className="grow">
          <p className="adm-eyebrow">New post</p>
          <h1 className="adm-title">Write something worth reading</h1>
        </div>
      </div>
      {error ? <p className="adm-banner error">{error}</p> : null}
      <Editor authors={authors} action={createPostAction} />
    </div>
  );
}
