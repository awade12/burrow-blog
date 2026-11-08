import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate, SectionBadge } from '@/components/PostCard';
import { listPublished } from '@/features/posts/queries';
import { postHref } from '@/features/posts/types';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Updates',
  description: 'What shipped, what changed, and what broke and got fixed at Burrow.',
};

export default async function UpdatesIndex() {
  const posts = await listPublished('updates', 60);
  return (
    <div className="wrap">
      <section className="page-head">
        <p className="eyebrow muted">The Warren · Updates</p>
        <h1>Updates</h1>
        <p>Changelogs, launches and honest post-mortems from the Burrow team.</p>
      </section>
      {posts.length ? (
        <div className="post-rows" style={{ marginTop: 30 }}>
          {posts.map((p) => (
            <Link className="post-row" key={p.id} href={postHref(p)}>
              <span className="post-row-date">{formatDate(p.published_at)}</span>
              <span className="post-row-main">
                <span className="post-row-title">{p.title}</span>
                <span className="post-row-excerpt">{p.excerpt}</span>
              </span>
              <SectionBadge section={p.section} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty" style={{ marginTop: 30 }}>Nothing here yet. Quiet is good news.</p>
      )}
    </div>
  );
}
