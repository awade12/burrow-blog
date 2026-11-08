import type { Metadata } from 'next';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { listGames, listPublished, listPublishedByGame } from '@/features/posts/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Guides',
  description: 'How to set up, run and fix game servers, per game, kept current.',
};

export default async function GuidesIndex({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>;
}) {
  const { game } = await searchParams;
  const games = await listGames();
  const posts = game ? await listPublishedByGame(game) : await listPublished('guides', 60);
  return (
    <div className="wrap">
      <section className="hero">
        <h1>Guides</h1>
        <p>Set up a server, split the bill, keep it running. Pick a game, or browse everything.</p>
      </section>
      {games.length ? (
        <div className="chips" style={{ marginBottom: 22 }}>
          <Link className="chip" href="/guides">All games</Link>
          {games.map((g) => (
            <Link key={g} className="chip" href={`/guides?game=${encodeURIComponent(g)}`}>{g}</Link>
          ))}
        </div>
      ) : null}
      {game ? <h2 className="section-title">{game} guides</h2> : null}
      <div className="grid">
        {posts.map((p) => <PostCard key={p.id} post={p} />)}
      </div>
      {posts.length === 0 ? <p>No guides here yet.</p> : null}
    </div>
  );
}
