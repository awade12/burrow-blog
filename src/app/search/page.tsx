import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';
import { searchPublished } from '@/features/posts/queries';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Search', robots: { index: false } };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await searchPublished(q) : [];
  return (
    <div className="wrap">
      <section className="hero">
        <h1>Search the Warren</h1>
        <form method="get" action="/search" style={{ maxWidth: 480, display: 'flex', gap: 10 }}>
          <input type="search" name="q" defaultValue={q ?? ''} placeholder="Minecraft, sleep, billing..." aria-label="Search" />
          <button type="submit">Search</button>
        </form>
      </section>
      {q ? (
        <>
          <p style={{ color: 'var(--muted)' }}>
            {results.length} result{results.length === 1 ? '' : 's'} for “{q}”.
          </p>
          <div className="grid">
            {results.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}
