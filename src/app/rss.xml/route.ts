import { buildFeed } from '@/features/seo/feed';

export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(await buildFeed(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
