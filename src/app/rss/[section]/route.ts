import { buildFeed } from '@/features/seo/feed';
import type { Section } from '@/features/posts/types';

export const dynamic = 'force-dynamic';

const SECTIONS: Section[] = ['blog', 'guides', 'updates'];

export async function GET(_req: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  // Feeds are addressed as /rss/blog, /rss/guides, /rss/updates.
  if (!SECTIONS.includes(section as Section)) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(await buildFeed(section as Section), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
