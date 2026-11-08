import type { Metadata } from 'next';
import { config } from '@/lib/config';
import { postHref, type Post } from '@/features/posts/types';

export function postMetadata(post: Post): Metadata {
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const url = `${config.siteUrl}${postHref(post)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      tags: post.tags,
      images: post.cover_path ? [post.cover_path] : ['/burrow-icon.png'],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export function postJsonLd(post: Post): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': post.section === 'guides' ? 'TechArticle' : 'BlogPosting',
    headline: post.title,
    description: post.seo_description || post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author_name },
    publisher: { '@type': 'Organization', name: 'Burrow', url: 'https://burrowservers.com' },
    mainEntityOfPage: `${config.siteUrl}${postHref(post)}`,
  };
}
