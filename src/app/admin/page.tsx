import Link from 'next/link';
import StatusPill from '@/components/admin/StatusPill';
import { requireAdminPage } from '@/features/auth/guard';
import { listAllForAdmin } from '@/features/posts/queries';
import { postStats } from '@/features/posts/stats';
import { postHref, SECTIONS } from '@/features/posts/types';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user = await requireAdminPage();
  const [stats, recent] = await Promise.all([postStats(), listAllForAdmin()]);
  const first = user.display_name.split(' ')[0];
  const cards = [
    { n: stats.total, l: 'Total posts', s: 'Everything in The Warren' },
    { n: stats.byStatus.published ?? 0, l: 'Published', s: 'Live for readers' },
    { n: stats.byStatus.draft ?? 0, l: 'Drafts', s: 'Still being written' },
    { n: stats.byStatus.review ?? 0, l: 'In review', s: 'Waiting on a second pair of eyes' },
    { n: stats.byStatus.scheduled ?? 0, l: 'Scheduled', s: 'Queued to go live' },
    { n: stats.bySection.guides ?? 0, l: 'Guides', s: 'Per-game help library' },
  ];
  return (
    <div>
      <div className="adm-page-head">
        <div className="grow">
          <p className="adm-eyebrow">Dashboard</p>
          <h1 className="adm-title">Hey {first}.</h1>
          <p className="adm-sub">Here is where The Warren stands. Write something good.</p>
        </div>
        <div className="adm-actions">
          <Link className="adm-btn" href="/admin/media">Upload media</Link>
          <Link className="adm-btn primary" href="/admin/posts/new">Write a post</Link>
        </div>
      </div>
      <div className="adm-stat-grid">
        {cards.map((c) => (
          <div className="adm-stat" key={c.l}>
            <div className="n">{c.n}</div>
            <div className="l">{c.l}</div>
            <div className="s">{c.s}</div>
          </div>
        ))}
      </div>
      <h2 className="adm-section-title">Recently touched</h2>
      <div className="adm-recent">
        {recent.slice(0, 8).map((p) => (
          <div className="adm-recent-row" key={p.id}>
            <div className="grow">
              <Link className="ttl" href={`/admin/posts/${p.id}`}>{p.title}</Link>
              <span className="meta">
                {SECTIONS[p.section].label} · by {p.author_name} ·{' '}
                {new Date(p.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <StatusPill status={p.status} />
            {p.status === 'published' ? (
              <Link className="adm-btn sm" href={postHref(p)}>View</Link>
            ) : null}
          </div>
        ))}
        {recent.length === 0 ? <p className="adm-empty">No posts yet. The burrow is still being dug.</p> : null}
      </div>
    </div>
  );
}
