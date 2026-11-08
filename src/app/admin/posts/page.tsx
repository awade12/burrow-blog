import Link from 'next/link';
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <h1 style={{ margin: 0 }}>Posts</h1>
        <Link className="button" href="/admin/posts/new" style={{ marginLeft: 'auto' }}>New post</Link>
      </div>
      <div className="tabs">
        {FILTERS.map((f) => (
          <Link key={f.key} className={active === f.key ? 'on' : ''} href={f.key === 'all' ? '/admin/posts' : `/admin/posts?status=${f.key}`}>
            {f.label}
          </Link>
        ))}
      </div>
      <table className="admin">
        <thead>
          <tr><th>Title</th><th>Section</th><th>Status</th><th>Author</th><th>Updated</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td><Link href={`/admin/posts/${p.id}`}>{p.title}</Link></td>
              <td>{SECTIONS[p.section].label}</td>
              <td><span className="badge">{p.status}</span></td>
              <td>{p.author_name}</td>
              <td>{new Date(p.updated_at).toLocaleDateString('en-US')}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                {p.status !== 'published' ? (
                  <form action={quickStatusAction.bind(null, p.id, 'published')} style={{ display: 'inline' }}>
                    <button className="secondary" type="submit">Publish</button>
                  </form>
                ) : (
                  <>
                    <Link href={postHref(p)}>View</Link>{' '}
                    <form action={quickStatusAction.bind(null, p.id, 'draft')} style={{ display: 'inline' }}>
                      <button className="secondary" type="submit">Unpublish</button>
                    </form>
                  </>
                )}{' '}
                <form action={deletePostAction.bind(null, p.id)} style={{ display: 'inline' }}>
                  <button className="danger" type="submit">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {posts.length === 0 ? <p style={{ color: 'var(--muted)' }}>Nothing in this bucket yet.</p> : null}
    </div>
  );
}
