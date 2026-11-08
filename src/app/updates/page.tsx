import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import { listPublished } from '@/features/posts/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Updates',
  description: 'What shipped, what changed, and what broke and got fixed at Burrow.',
};

export default async function UpdatesIndex() {
  const posts = await listPublished('updates', 60);
  return (
    <div className="wrap">
      <section className="hero">
        <h1>Updates</h1>
        <p>Changelogs, launches and honest post-mortems from the Burrow team.</p>
      </section>
      <div className="grid">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      {posts.length === 0 ? <p>Nothing here yet.</p> : null}
    </div>
  );
}
