import { config } from '@/lib/config';
import { listPublished } from '@/features/posts/queries';
import { postHref, type Section } from '@/features/posts/types';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function buildFeed(section?: Section): Promise<string> {
  const posts = await listPublished(section, 40);
  const items = posts
    .map((p) => {
      const url = `${config.siteUrl}${postHref(p)}`;
      return `<item><title>${esc(p.title)}</title><link>${url}</link>` +
        `<guid>${url}</guid><description>${esc(p.excerpt)}</description>` +
        `<pubDate>${p.published_at ? new Date(p.published_at).toUTCString() : ''}</pubDate>` +
        `<author>${esc(p.author_name)}</author></item>`;
    })
    .join('\n');
  const label = section ? `${config.siteName} ${section}` : config.siteName;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>` +
    `<title>${esc(label)}</title><link>${config.siteUrl}</link>` +
    `<description>${esc(config.siteDescription)}</description>${items}</channel></rss>`;
}
