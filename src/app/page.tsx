import Image from 'next/image';
import Link from 'next/link';
import PostCard, { formatDate, SectionBadge } from '@/components/PostCard';
import { listGames, listPublished } from '@/features/posts/queries';
import { postHref } from '@/features/posts/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [latest, guides, updates, games] = await Promise.all([
    listPublished(undefined, 9),
    listPublished('guides', 3),
    listPublished('updates', 4),
    listGames(),
  ]);
  const featured = latest[0];
  const shown = new Set(
    [featured?.id, ...guides.map((g) => g.id), ...updates.map((u) => u.id)].filter(Boolean),
  );
  const more = latest.filter((p) => !shown.has(p.id)).slice(0, 3);

  return (
    <div className="wrap">
      <section className="hero">
        <div className="hero-top">
          <span className="hero-mark">
            <Image src="/burrow-mark.png" alt="" width={92} height={56} priority />
          </span>
          <p className="eyebrow">The Burrow blog</p>
        </div>
        <h1>The Warren: notes from <span>underground</span>.</h1>
        <p className="sub">
          Blog posts, per-game guides and product updates from the Burrow
          team. Burrow is game servers you split with friends, $3/GB, and
          this is where we write down how it all works.
        </p>
        <div className="hero-actions">
          <a className="cta-button" href="https://burrowservers.com">Start a server</a>
          <Link className="ghost-button" href="/guides">Read the guides</Link>
        </div>
      </section>

      {featured ? (
        <section>
          <p className="eyebrow muted feature-label">Latest in the Warren</p>
          <PostCard post={featured} variant="featured" />
        </section>
      ) : (
        <p className="empty" style={{ marginTop: 56 }}>
          No posts yet. The burrow is still being dug.
        </p>
      )}

      {guides.length ? (
        <section>
          <div className="section-head">
            <div>
              <p className="eyebrow muted">Guides</p>
              <h2>Start with a guide</h2>
            </div>
            <Link className="head-link" href="/guides">
              All guides <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          {games.length ? (
            <div className="chips" style={{ marginBottom: 20 }}>
              {games.map((g) => (
                <Link key={g} className="chip" href={`/guides?game=${encodeURIComponent(g)}`}>{g}</Link>
              ))}
            </div>
          ) : null}
          <div className="grid grid-fit">
            {guides.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      ) : null}

      {updates.length ? (
        <section>
          <div className="section-head">
            <div>
              <p className="eyebrow muted">Updates</p>
              <h2>What shipped lately</h2>
            </div>
            <Link className="head-link" href="/updates">
              All updates <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="post-rows">
            {updates.map((p) => (
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
        </section>
      ) : null}

      {more.length ? (
        <section>
          <div className="section-head">
            <div>
              <p className="eyebrow muted">Blog</p>
              <h2>More from the Warren</h2>
            </div>
            <Link className="head-link" href="/posts">
              All posts <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid">
            {more.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
