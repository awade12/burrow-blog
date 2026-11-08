export type Section = 'blog' | 'guides' | 'updates';
export type Status = 'draft' | 'review' | 'scheduled' | 'published';
export type Difficulty = 'starter' | 'intermediate' | 'advanced';

export type Post = {
  id: string;
  section: Section;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  cover_path: string | null;
  tags: string[];
  author_id: string;
  author_name: string;
  author_slug: string;
  status: Status;
  game: string | null;
  difficulty: Difficulty | null;
  last_verified: string | null;
  seo_title: string;
  seo_description: string;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PostSummary = Pick<
  Post,
  | 'id' | 'section' | 'slug' | 'title' | 'excerpt' | 'cover_path' | 'tags'
  | 'author_name' | 'author_slug' | 'game' | 'difficulty' | 'published_at' | 'status' | 'updated_at'
  | 'body_md'
>;

export const SECTIONS: Record<Section, { path: string; label: string }> = {
  blog: { path: '/posts', label: 'Blog' },
  guides: { path: '/guides', label: 'Guides' },
  updates: { path: '/updates', label: 'Updates' },
};

export function postHref(post: Pick<Post, 'section' | 'slug'>): string {
  return `${SECTIONS[post.section].path}/${post.slug}`;
}
