import Image from 'next/image';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { listGames, listPublished } from '@/features/posts/queries';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [latest, guides, updates, games] = await Promise.all([
    listPublished(undefined, 9),
    listPublished('guides', 3),
    listPublished('updates', 3),
    listGames(),
  ]);
  return (
    <div className="wrap">
      <section className="hero">
        <Image className="mark" src="/burrow-mark.png" alt="Two Burrow critters high-fiving" width={380} height={232} priority />
        <h1>The Warren: notes from <span>underground</span>.</h1>
        <p>
          Blog posts, per-game guides and product updates from the Burrow
          team. Burrow is game servers you split with friends, $3/GB, and
          this is where we write down how it all works.
        </p>
      </section>

      {games.length ? (
        <>
          <h2 className="section-title">Guides by game</h2>
          <div className="chips">
            {games.map((g) => (
              <Link key={g} className="chip" href={`/guides?game=${encodeURIComponent(g)}`}>{g}</Link>
            ))}
          </div>
        </>
      ) : null}

      <h2 className="section-title">Latest in the Warren <Link href="/posts">Blog →</Link></h2>
      <div className="grid">
        {latest.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      {latest.length === 0 ? <p>No posts yet. The burrow is still being dug.</p> : null}

      {guides.length ? (
        <>
          <h2 className="section-title">Newest guides <Link href="/guides">All guides →</Link></h2>
          <div className="grid">
            {guides.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </>
      ) : null}

      {updates.length ? (
        <>
          <h2 className="section-title">Latest updates <Link href="/updates">All updates →</Link></h2>
          <div className="grid">
            {updates.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}
