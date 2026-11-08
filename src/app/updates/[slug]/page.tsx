import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import ArticleView from '@/components/ArticleView';
import { getPublishedBySlug, redirectTargetFor } from '@/features/posts/queries';
import { postJsonLd, postMetadata } from '@/features/seo/metadata';
import { postHref } from '@/features/posts/types';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const post = await getPublishedBySlug(slug);
  if (post) return post;
  const target = await redirectTargetFor(slug);
  if (target) {
    const moved = await getPublishedBySlug(target);
    if (moved) permanentRedirect(postHref(moved));
  }
  notFound();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return postMetadata(await load(slug));
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await load(slug);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd(post)) }} />
      <ArticleView post={post} />
    </>
  );
}
