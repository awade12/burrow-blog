import Image from 'next/image';
import Link from 'next/link';
import PostCard, { formatDate, SectionBadge } from './PostCard';
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
          <div className="meta">
            <span>By {post.author_name}</span>
            <span>{formatDate(post.published_at)}</span>
            <span>{readingTime(post.body_md)} min read</span>
            {post.last_verified ? <span>Last verified {formatDate(post.last_verified)}</span> : null}
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
          <aside className="info-box">
            <h4>Run this on Burrow</h4>
            <p>
              Game servers you split with friends at $3/GB. Nobody fronts the
              whole bill, and the server sleeps for $1 a month when your group
              takes a break.
            </p>
            <p><a href="https://burrowservers.com">Start a server on Burrow</a></p>
          </aside>
        ) : null}
        {post.tags.length ? (
          <div className="chips" style={{ margin: '18px 0' }}>
            {post.tags.map((t) => (
              <Link key={t} className="chip" href={`/tags/${encodeURIComponent(t)}`}>#{t}</Link>
            ))}
          </div>
        ) : null}
        <div className="prev-next">
          <span>{prev ? <Link href={postHref(prev)}>← {prev.title}</Link> : null}</span>
          <span>{next ? <Link href={postHref(next)}>{next.title} →</Link> : null}</span>
        </div>
      </div>
      {related.length ? (
        <div className="wrap">
          <h2 className="section-title">Keep reading</h2>
          <div className="grid">
            {related.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
          <p style={{ marginTop: 18 }}>
            <Link href={SECTIONS[post.section].path}>All {SECTIONS[post.section].label.toLowerCase()} →</Link>
          </p>
        </div>
      ) : null}
    </article>
  );
}
