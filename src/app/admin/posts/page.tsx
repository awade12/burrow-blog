import Link from 'next/link';
import StatusPill from '@/components/admin/StatusPill';
import { requireAdminPage } from '@/features/auth/guard';
import { listAllForAdmin } from '@/features/posts/queries';
import { postHref, SECTIONS, type Status } from '@/features/posts/types';
import { deletePostAction, quickStatusAction } from './actions';

export const dynamic = 'force-dynamic';

const FILTERS: { key: Status | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Drafts' },
  { key: 'review', label: 'In review' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'published', label: 'Published' },
];

export default async function PostsList({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminPage();
  const { status } = await searchParams;
  const active = (FILTERS.some((f) => f.key === status) ? status : 'all') as Status | 'all';
  const posts = await listAllForAdmin(active === 'all' ? undefined : active);
  return (
    <div>
      <div className="adm-page-head">
        <div className="grow">
          <p className="adm-eyebrow">Content</p>
          <h1 className="adm-title">Posts</h1>
          <p className="adm-sub">Blog posts, guides and updates, newest edits first.</p>
        </div>
        <div className="adm-actions">
          <Link className="adm-btn primary" href="/admin/posts/new">New post</Link>
        </div>
      </div>
      <div className="adm-segmented" role="tablist" aria-label="Filter by status">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            className={active === f.key ? 'on' : ''}
            href={f.key === 'all' ? '/admin/posts' : `/admin/posts?status=${f.key}`}
          >
            {f.label}
          </Link>
        ))}
      </div>
      {posts.length ? (
        <div className="adm-tablewrap">
          <table className="adm-table">
            <thead>
              <tr><th>Title</th><th>Section</th><th>Status</th><th>Author</th><th>Updated</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td><Link className="t" href={`/admin/posts/${p.id}`}>{p.title}</Link></td>
                  <td className="muted">{SECTIONS[p.section].label}</td>
                  <td><StatusPill status={p.status} /></td>
                  <td className="muted">{p.author_name}</td>
                  <td className="muted">{new Date(p.updated_at).toLocaleDateString('en-US')}</td>
                  <td>
                    <div className="adm-rowactions">
                      {p.status !== 'published' ? (
                        <form action={quickStatusAction.bind(null, p.id, 'published')}>
                          <button className="adm-btn sm" type="submit">Publish</button>
                        </form>
                      ) : (
                        <>
                          <Link className="adm-btn sm" href={postHref(p)}>View</Link>
                          <form action={quickStatusAction.bind(null, p.id, 'draft')}>
                            <button className="adm-btn sm" type="submit">Unpublish</button>
                          </form>
                        </>
                      )}
                      <form action={deletePostAction.bind(null, p.id)}>
                        <button className="adm-btn sm danger" type="submit">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="adm-empty">Nothing in this bucket yet.</p>
      )}
    </div>
  );
}
