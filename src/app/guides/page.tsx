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
      <section className="page-head">
        <p className="eyebrow muted">The Warren · Guides</p>
        <h1>{game ? `${game} guides` : 'Guides'}</h1>
        <p>Set up a server, split the bill, keep it running. Pick a game, or browse everything.</p>
      </section>
      {games.length ? (
        <div className="chips" style={{ margin: '24px 0 26px' }}>
          <Link className={`chip${game ? '' : ' active'}`} href="/guides">All games</Link>
          {games.map((g) => (
            <Link
              key={g}
              className={`chip${game === g ? ' active' : ''}`}
              href={`/guides?game=${encodeURIComponent(g)}`}
            >
              {g}
            </Link>
          ))}
        </div>
      ) : null}
      {posts.length ? (
        <div className="grid">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      ) : (
        <p className="empty">No guides here yet. The first ones are being dug.</p>
      )}
    </div>
  );
}
