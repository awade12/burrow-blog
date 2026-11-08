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

// Small round critter chip used in card footers and article bylines.
export function Avatar({ size = 26 }: { size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size }} aria-hidden="true">
      <Image src="/burrow-icon.png" alt="" width={size} height={size} />
    </span>
  );
}

// Designed cover for posts without an uploaded one: a tinted
// gradient per section, the critter mark, and a quiet label, so the
// grid never has holes in it.
function FallbackCover({ post }: { post: PostSummary }) {
  return (
    <div className={`cover-fallback cover-${post.section}`} aria-hidden="true">
      <Image className="cover-mark" src="/burrow-mark.png" alt="" width={190} height={116} />
      <span className="cover-label">
        {SECTIONS[post.section].label}
        {post.game ? ` · ${post.game}` : ''}
      </span>
    </div>
  );
}

export default function PostCard({
  post,
  variant,
}: {
  post: PostSummary;
  variant?: 'featured';
}) {
  const href = postHref(post);
  const featured = variant === 'featured';
  return (
    <article className={featured ? 'card card-featured' : 'card'}>
      <Link className="card-main" href={href}>
        <div className="card-cover">
          {post.cover_path ? (
            <Image
              className="cover-img"
              src={post.cover_path}
              alt=""
              width={featured ? 1200 : 640}
              height={featured ? 675 : 360}
            />
          ) : (
            <FallbackCover post={post} />
          )}
        </div>
        <div className="card-body">
          <div className="meta">
            <SectionBadge section={post.section} />
            {post.game ? <span className="badge">{post.game}</span> : null}
            <span>{formatDate(post.published_at)}</span>
          </div>
          <h3 className="card-title">{post.title}</h3>
          <p className="card-excerpt">{post.excerpt}</p>
          <div className="card-foot">
            <Avatar />
            <span className="card-author">{post.author_name}</span>
            <span className="read-link">
              Read <span className="arrow" aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
