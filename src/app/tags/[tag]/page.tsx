import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import { listPublishedByTag } from '@/features/posts/queries';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}`, description: `Posts tagged ${decodeURIComponent(tag)} in The Warren.` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = await listPublishedByTag(decoded);
  return (
    <div className="wrap">
      <section className="hero">
        <h1>#{decoded}</h1>
        <p>{posts.length} post{posts.length === 1 ? '' : 's'} with this tag.</p>
      </section>
      <div className="grid">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      {posts.length === 0 ? <p>Nothing tagged like that yet.</p> : null}
    </div>
  );
}
