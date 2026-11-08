import Image from 'next/image';
import Link from 'next/link';
import PostCard, { Avatar, formatDate, SectionBadge } from './PostCard';
import { getHeadings, readingTime, renderMarkdown } from '@/lib/markdown/render';
import { neighbours, relatedPosts } from '@/features/posts/queries';
import { postHref, SECTIONS, type Post } from '@/features/posts/types';

export default async function ArticleView({ post }: { post: Post }) {
  const html = renderMarkdown(post.body_md);
  const headings = post.section === 'guides' ? getHeadings(post.body_md).filter((h) => h.depth === 2) : [];
  const [related, { prev, next }] = await Promise.all([relatedPosts(post), neighbours(post)]);

  return (
    <article>
      <div className="narrow">
        <div className="article-head">
          <div className="meta">
            <SectionBadge section={post.section} />
            {post.game ? <span className="badge">{post.game}</span> : null}
            {post.difficulty ? <span className="badge">{post.difficulty}</span> : null}
          </div>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="standfirst">{post.excerpt}</p> : null}
          <div className="byline">
            <Avatar size={34} />
            <span className="byline-name">{post.author_name}</span>
            <span className="byline-sep" aria-hidden="true">·</span>
            <span>{formatDate(post.published_at)}</span>
            <span className="byline-sep" aria-hidden="true">·</span>
            <span>{readingTime(post.body_md)} min read</span>
            {post.last_verified ? (
              <span className="verified">Verified {formatDate(post.last_verified)}</span>
            ) : null}
          </div>
        </div>
        {post.cover_path ? (
          <Image className="article-cover" src={post.cover_path} alt="" width={1200} height={600} priority />
        ) : null}
        {headings.length > 2 ? (
          <nav className="toc" aria-label="On this page">
            <h4>On this page</h4>
            <ul>
              {headings.map((h) => (
                <li key={h.id}><a href={`#${h.id}`}>{h.text}</a></li>
              ))}
            </ul>
          </nav>
        ) : null}
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        {post.section === 'guides' ? (
          <aside className="cta-panel">
            <div className="cta-panel-head">
              <Avatar size={40} />
              <div>
                <h4>Run this on Burrow</h4>
                <p className="cta-sub">The host this guide was written for.</p>
              </div>
            </div>
            <p>
              Game servers you split with friends. Nobody fronts the whole
              bill, and the server sleeps while your group takes a break
              instead of charging you for an empty world.
            </p>
            <div className="stat-chips">
              <span className="stat-chip">
                <strong>$3/GB</strong>
                <small>flat, no tiers</small>
              </span>
              <span className="stat-chip">
                <strong>Split</strong>
                <small>everyone pays their share</small>
              </span>
              <span className="stat-chip">
                <strong>$1/mo</strong>
                <small>while it sleeps</small>
              </span>
            </div>
            <div className="cta-actions">
              <a className="cta-button" href="https://burrowservers.com">Start a server</a>
              <a className="cta-quiet" href="https://discord.gg/xchUdWNbuv">Ask in the Discord</a>
            </div>
          </aside>
        ) : null}
        {post.tags.length ? (
          <div className="tags-row">
            {post.tags.map((t) => (
              <Link key={t} className="chip" href={`/tags/${encodeURIComponent(t)}`}>#{t}</Link>
            ))}
          </div>
        ) : null}
        <div className="prev-next">
          {prev ? (
            <Link className="pn-card" href={postHref(prev)}>
              <span className="pn-label">← Older</span>
              <span className="pn-title">{prev.title}</span>
            </Link>
          ) : <span style={{ flex: 1 }} />}
          {next ? (
            <Link className="pn-card pn-next" href={postHref(next)}>
              <span className="pn-label">Newer →</span>
              <span className="pn-title">{next.title}</span>
            </Link>
          ) : null}
        </div>
      </div>
      {related.length ? (
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow muted">Keep reading</p>
              <h2>More like this</h2>
            </div>
            <Link className="head-link" href={SECTIONS[post.section].path}>
              All {SECTIONS[post.section].label.toLowerCase()} <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="grid">
            {related.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      ) : null}
    </article>
  );
}
