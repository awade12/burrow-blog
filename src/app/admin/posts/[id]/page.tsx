import Link from 'next/link';
import { notFound } from 'next/navigation';
import Editor from '@/components/admin/Editor';
import StatusPill from '@/components/admin/StatusPill';
import { requireAdminPage } from '@/features/auth/guard';
import { listAuthors } from '@/features/auth/users';
import { getById } from '@/features/posts/queries';
import { postHref, SECTIONS } from '@/features/posts/types';
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
      <Link className="adm-backlink" href="/admin/posts">← All posts</Link>
      <div className="adm-page-head">
        <div className="grow">
          <p className="adm-eyebrow">{SECTIONS[post.section].label} · Editing</p>
          <h1 className="adm-title" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            Edit post <StatusPill status={post.status} />
          </h1>
        </div>
        {post.status === 'published' || post.status === 'scheduled' ? (
          <div className="adm-actions">
            <Link className="adm-btn" href={postHref(post)}>View live post</Link>
          </div>
        ) : null}
      </div>
      {saved ? <p className="adm-banner notice">Saved. The Warren has it from here.</p> : null}
      <Editor authors={authors} post={post} action={updatePostAction.bind(null, id)} />
    </div>
  );
}
