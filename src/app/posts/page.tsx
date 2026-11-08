import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import { listPublished } from '@/features/posts/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Stories, the math, and notes from the Burrow team.',
};

export default async function BlogIndex() {
  const posts = await listPublished('blog', 60);
  return (
    <div className="wrap">
      <section className="page-head">
        <p className="eyebrow muted">The Warren · Blog</p>
        <h1>Blog</h1>
        <p>Stories, the math behind split servers, and notes from two people in Texas building Burrow.</p>
      </section>
      {posts.length ? (
        <div className="grid" style={{ marginTop: 30 }}>
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      ) : (
        <p className="empty" style={{ marginTop: 30 }}>Nothing here yet. First post is being written.</p>
      )}
    </div>
  );
}
