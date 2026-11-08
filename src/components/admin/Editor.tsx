'use client';

import { useMemo, useState } from 'react';
import type { UserRow } from '@/features/auth/users';
import type { Post } from '@/features/posts/types';

type Props = {
  authors: UserRow[];
  post?: Post;
  action: (formData: FormData) => Promise<void>;
};

// The one deliberately client-heavy screen in the app (AGENTS.md
// rule 5): a Markdown editor with a live, server-rendered preview so
// what you see is exactly what readers get.
export default function Editor({ authors, post, action }: Props) {
  const [body, setBody] = useState(post?.body_md ?? '');
  const [preview, setPreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const words = useMemo(() => body.split(/\s+/).filter(Boolean).length, [body]);

  async function refreshPreview() {
    setBusy(true);
    const res = await fetch('/api/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ md: body }),
    });
    const data = (await res.json()) as { html?: string };
    setPreview(data.html ?? '');
    setShowPreview(true);
    setBusy(false);
  }

  return (
    <form action={action}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }} className="editor-top">
        <div>
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required defaultValue={post?.title ?? ''} />
          <label htmlFor="slug">Slug (blank = from title)</label>
          <input id="slug" name="slug" type="text" defaultValue={post?.slug ?? ''} placeholder="minecraft-server-for-your-friend-group" />
          <label htmlFor="excerpt">Excerpt (blank = first paragraph)</label>
          <textarea id="excerpt" name="excerpt" rows={2} style={{ fontFamily: 'inherit' }} defaultValue={post?.excerpt ?? ''} />
        </div>
        <div>
          <label htmlFor="section">Section</label>
          <select id="section" name="section" defaultValue={post?.section ?? 'blog'}>
            <option value="blog">Blog</option>
            <option value="guides">Guides</option>
            <option value="updates">Updates</option>
          </select>
          <label htmlFor="author_id">Author</label>
          <select id="author_id" name="author_id" defaultValue={post?.author_id ?? ''}>
            <option value="">Current user / keep author</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.display_name}</option>
            ))}
          </select>
          <label htmlFor="game">Game (guides)</label>
          <input id="game" name="game" type="text" defaultValue={post?.game ?? ''} placeholder="Minecraft" />
          <label htmlFor="difficulty">Difficulty (guides)</label>
          <select id="difficulty" name="difficulty" defaultValue={post?.difficulty ?? ''}>
            <option value="">None</option>
            <option value="starter">Starter</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <label htmlFor="last_verified">Last verified (guides)</label>
          <input id="last_verified" name="last_verified" type="text" placeholder="2026-11-07" defaultValue={post?.last_verified ?? ''} />
        </div>
      </div>

      <label htmlFor="tags">Tags (comma separated)</label>
      <input id="tags" name="tags" type="text" defaultValue={post?.tags.join(', ') ?? ''} placeholder="minecraft, getting-started" />
      <label htmlFor="cover_path">Cover image path (from Media, e.g. /media/123.png)</label>
      <input id="cover_path" name="cover_path" type="text" defaultValue={post?.cover_path ?? ''} />

      <label htmlFor="body_md">
        Body (Markdown) · {words} words · about {Math.max(1, Math.round(words / 200))} min read
      </label>
      <div className="editor-grid">
        <textarea id="body_md" name="body_md" rows={26} value={body} onChange={(e) => setBody(e.target.value)} required />
        <div>
          <button type="button" className="secondary" onClick={refreshPreview} disabled={busy}>
            {busy ? 'Rendering...' : 'Refresh preview'}
          </button>
          {showPreview ? (
            <div className="preview-pane prose" style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              Preview renders with the exact same code as the public site.
            </p>
          )}
        </div>
      </div>

      <details style={{ marginTop: 8 }}>
        <summary style={{ cursor: 'pointer', color: 'var(--muted)' }}>SEO (optional, auto-filled when blank)</summary>
        <label htmlFor="seo_title">SEO title</label>
        <input id="seo_title" name="seo_title" type="text" defaultValue={post?.seo_title ?? ''} />
        <label htmlFor="seo_description">SEO description</label>
        <textarea id="seo_description" name="seo_description" rows={2} style={{ fontFamily: 'inherit' }} defaultValue={post?.seo_description ?? ''} />
      </details>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end', marginTop: 18 }}>
        <div>
          <label htmlFor="intent">On save</label>
          <select id="intent" name="intent" defaultValue={post?.status === 'published' ? 'published' : 'draft'}>
            <option value="draft">Save as draft</option>
            <option value="review">Send to review</option>
            <option value="published">Publish now</option>
            <option value="scheduled">Schedule</option>
          </select>
        </div>
        <div>
          <label htmlFor="scheduled_at">Schedule for</label>
          <input id="scheduled_at" name="scheduled_at" type="datetime-local" />
        </div>
        <button type="submit">Save post</button>
        {post ? <span style={{ color: 'var(--muted)', fontSize: 14 }}>Status now: {post.status}</span> : null}
      </div>
    </form>
  );
}
