import Image from 'next/image';
import Link from 'next/link';
import { postHref, SECTIONS, type PostSummary } from '@/features/posts/types';

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function SectionBadge({ section }: { section: PostSummary['section'] }) {
  return <span className={`badge ${section}`}>{SECTIONS[section].label}</span>;
}

export default function PostCard({ post }: { post: PostSummary }) {
  const href = postHref(post);
  return (
    <article className="card">
      {post.cover_path ? (
        <Link href={href}>
          <Image className="cover" src={post.cover_path} alt="" width={640} height={320} />
        </Link>
      ) : null}
      <div className="body">
        <div className="meta">
          <SectionBadge section={post.section} />
          {post.game ? <span className="badge">{post.game}</span> : null}
          <span>{formatDate(post.published_at)}</span>
        </div>
        <h3><Link href={href}>{post.title}</Link></h3>
        <p>{post.excerpt}</p>
        <div className="meta"><span>By {post.author_name}</span></div>
      </div>
    </article>
  );
}
