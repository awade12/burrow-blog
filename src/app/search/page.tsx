import type { Metadata } from 'next';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { searchPublished } from '@/features/posts/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Search', robots: { index: false } };

const HINTS = ['Minecraft', 'sleep', 'split the bill', 'billing'];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await searchPublished(q) : [];
  return (
    <div className="wrap">
      <section className="page-head">
        <p className="eyebrow muted">The Warren · Search</p>
        <h1>Search the Warren</h1>
        <form className="search-form" method="get" action="/search">
          <input type="search" name="q" defaultValue={q ?? ''} placeholder="Minecraft, sleep, billing..." aria-label="Search" />
          <button type="submit">Search</button>
        </form>
        {!q ? (
          <div className="search-hints">
            <span>Popular:</span>
            {HINTS.map((h) => (
              <Link key={h} className="chip" href={`/search?q=${encodeURIComponent(h)}`}>{h}</Link>
            ))}
          </div>
        ) : null}
      </section>
      {q ? (
        <>
          <p className="results-note">
            {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;.
          </p>
          {results.length ? (
            <div className="grid">
              {results.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          ) : (
            <p className="empty">
              Nothing in the burrow matches that yet. Try a game name, or browse the guides instead.
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
