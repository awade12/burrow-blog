import Link from 'next/link';
import { requireAdminPage } from '@/features/auth/guard';
import { listAllForAdmin } from '@/features/posts/queries';
import { postStats } from '@/features/posts/stats';
import { postHref } from '@/features/posts/types';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user = await requireAdminPage();
  const [stats, recent] = await Promise.all([postStats(), listAllForAdmin()]);
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Hey {user.display_name.split(' ')[0]}.</h1>
      <div className="stat-grid">
        <div className="stat"><div className="n">{stats.total}</div><div className="l">Total posts</div></div>
        <div className="stat"><div className="n">{stats.byStatus.published ?? 0}</div><div className="l">Published</div></div>
        <div className="stat"><div className="n">{stats.byStatus.draft ?? 0}</div><div className="l">Drafts</div></div>
        <div className="stat"><div className="n">{stats.byStatus.review ?? 0}</div><div className="l">In review</div></div>
        <div className="stat"><div className="n">{stats.byStatus.scheduled ?? 0}</div><div className="l">Scheduled</div></div>
        <div className="stat"><div className="n">{stats.bySection.guides ?? 0}</div><div className="l">Guides</div></div>
      </div>
      <p style={{ marginTop: 20 }}>
        <Link className="button" href="/admin/posts/new">Write a post</Link>{' '}
        <Link className="button secondary" href="/admin/media">Upload media</Link>
      </p>
      <h2>Recently touched</h2>
      <table className="admin">
        <thead><tr><th>Title</th><th>Section</th><th>Status</th><th>Author</th><th /></tr></thead>
        <tbody>
          {recent.slice(0, 8).map((p) => (
            <tr key={p.id}>
              <td><Link href={`/admin/posts/${p.id}`}>{p.title}</Link></td>
              <td>{p.section}</td>
              <td><span className="badge">{p.status}</span></td>
              <td>{p.author_name}</td>
              <td>{p.status === 'published' ? <Link href={postHref(p)}>View</Link> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
