import type { MetadataRoute } from 'next';
import { config } from '@/lib/config';
import { sitemapPosts } from '@/features/posts/queries';
import { SECTIONS } from '@/features/posts/types';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await sitemapPosts();
  const statics: MetadataRoute.Sitemap = ['', '/posts', '/guides', '/updates', '/search'].map(
    (path) => ({ url: `${config.siteUrl}${path}`, changeFrequency: 'daily', priority: path === '' ? 1 : 0.7 }),
  );
  return [
    ...statics,
    ...posts.map((p) => ({
      url: `${config.siteUrl}${SECTIONS[p.section].path}/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
