'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UserRow } from '@/features/auth/users';
import { SECTIONS, type Post } from '@/features/posts/types';
import StatusPill from './StatusPill';
import EditorToolbar, { type Transform } from './EditorToolbar';

type Props = {
  authors: UserRow[];
  post?: Post;
  action: (formData: FormData) => Promise<void>;
};

type Fields = {
  title: string; slug: string; excerpt: string; section: string; authorId: string;
  game: string; difficulty: string; lastVerified: string; tags: string;
  coverPath: string; seoTitle: string; seoDescription: string;
  intent: string; scheduledAt: string;
};

function initialFields(post?: Post): Fields {
  return {
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    section: post?.section ?? 'blog',
    authorId: post?.author_id ?? '',
    game: post?.game ?? '',
    difficulty: post?.difficulty ?? '',
    lastVerified: post?.last_verified ?? '',
    tags: post?.tags.join(', ') ?? '',
    coverPath: post?.cover_path ?? '',
    seoTitle: post?.seo_title ?? '',
    seoDescription: post?.seo_description ?? '',
    intent: post?.status === 'published' ? 'published' : 'draft',
    scheduledAt: '',
  };
}

// The one deliberately client-heavy screen in the app (AGENTS.md
// rule 5): a writing tool. Document first, publish controls in a
// rail, live preview rendered by the same code as the public site,
// and a local autosave so a closed tab never eats a draft.
export default function Editor({ authors, post, action }: Props) {
  const storageKey = `warren-draft-${post?.id ?? 'new'}`;
  const startFields = useMemo(() => initialFields(post), [post]);
  const [fields, setFields] = useState<Fields>(startFields);
  const [body, setBody] = useState(post?.body_md ?? '');
  const [restored, setRestored] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [preview, setPreview] = useState('');
  const [previewBusy, setPreviewBusy] = useState(false);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [wide, setWide] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSel = useRef<{ start: number; end: number } | null>(null);
  const readyRef = useRef(false);
  const submittedRef = useRef(false);

  const words = useMemo(() => body.split(/\s+/).filter(Boolean).length, [body]);
  const readMins = Math.max(1, Math.round(words / 200));
  const set = (patch: Partial<Fields>) => setFields((f) => ({ ...f, ...patch }));

  // Restore a locally autosaved draft once, on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw) as { fields?: Partial<Fields>; body?: string };
        if (data.fields) setFields((f) => ({ ...f, ...data.fields }));
        if (typeof data.body === 'string') setBody(data.body);
        setRestored(true);
      }
    } catch {
      // A corrupt local draft is not worth an error screen.
    }
    readyRef.current = true;
    // Runs once on mount by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave everything, debounced, once restore has had its chance.
  useEffect(() => {
    if (!readyRef.current) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ fields, body }));
        setSavedAt(new Date());
      } catch {
        // Storage blocked or full: autosave is best effort only.
      }
    }, 500);
    return () => clearTimeout(t);
  }, [fields, body, storageKey]);

  // A successful save navigates away; drop the local draft on the
  // way out so a stale copy never resurrects.
  useEffect(
    () => () => {
      if (submittedRef.current) {
        try { localStorage.removeItem(storageKey); } catch { /* best effort */ }
      }
    },
    [storageKey],
  );

  const discardDraft = () => {
    try { localStorage.removeItem(storageKey); } catch { /* best effort */ }
    setFields(startFields);
    setBody(post?.body_md ?? '');
    setRestored(false);
    setSavedAt(null);
  };

  // Track the split-view breakpoint so auto-preview only runs when
  // the pane is actually on screen (or the preview tab is open).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1201px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const refreshPreview = useCallback(async () => {
    setPreviewBusy(true);
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ md: body }),
      });
      const data = (await res.json()) as { html?: string };
      setPreview(data.html ?? '');
    } catch {
      // Keep the last good preview if a render hiccups.
    }
    setPreviewBusy(false);
  }, [body]);

  useEffect(() => {
    if (!wide && tab !== 'preview') return;
    const t = setTimeout(refreshPreview, 600);
    return () => clearTimeout(t);
  }, [body, wide, tab, refreshPreview]);

  const applyTransform = (t: Transform) => {
    const ta = textareaRef.current;
    const res = t(body, ta?.selectionStart ?? body.length, ta?.selectionEnd ?? body.length);
    pendingSel.current = { start: res.start, end: res.end };
    setBody(res.value);
  };

  // Land the cursor where the last toolbar edit wants it.
  useEffect(() => {
    const el = textareaRef.current;
    if (pendingSel.current && el) {
      el.focus();
      el.setSelectionRange(pendingSel.current.start, pendingSel.current.end);
      pendingSel.current = null;
    }
  }, [body]);

  const onBodyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab' || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault();
    applyTransform((value, start, end) => ({
      value: value.slice(0, start) + '  ' + value.slice(end),
      start: start + 2,
      end: start + 2,
    }));
  };

  const onFormKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const sectionPath = SECTIONS[fields.section as keyof typeof SECTIONS]?.path ?? '/posts';

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={() => { submittedRef.current = true; }}
      onKeyDown={onFormKeyDown}
    >
      {restored ? (
        <div className="adm-restore" role="status">
          <span>Restored an unsaved draft from this browser.</span>
          <button type="button" className="adm-btn sm" onClick={discardDraft}>Discard it</button>
        </div>
      ) : null}
      <div className="adm-editor-grid">
        <div className="adm-doc">
          <input
            className="adm-doc-title" id="title" name="title" type="text" required
            placeholder="Give it a title" value={fields.title}
            onChange={(e) => set({ title: e.target.value })} aria-label="Title"
          />
          <div className="adm-slug-row">
            <span>{sectionPath}/</span>
            <input
              id="slug" name="slug" type="text" value={fields.slug}
              onChange={(e) => set({ slug: e.target.value })}
              placeholder="blank means we make one from the title" aria-label="Slug"
            />
          </div>
          <textarea
            className="adm-doc-excerpt" id="excerpt" name="excerpt" rows={2}
            placeholder="A one or two sentence standfirst. Blank means we use the first paragraph."
            value={fields.excerpt} onChange={(e) => set({ excerpt: e.target.value })}
            aria-label="Excerpt"
          />
          <div className="adm-card adm-write-card">
            <div className="adm-toolbar">
              <EditorToolbar onTransform={applyTransform} />
              <span className="adm-tabs" role="tablist" aria-label="Editor view">
                <button type="button" className={tab === 'write' ? 'on' : ''} onClick={() => setTab('write')}>Write</button>
                <button type="button" className={tab === 'preview' ? 'on' : ''} onClick={() => setTab('preview')}>Preview</button>
              </span>
            </div>
            <div className="adm-doc-split" data-tab={tab}>
              <div className="adm-write-pane">
                <textarea
                  ref={textareaRef} className="adm-textarea" id="body_md" name="body_md" required
                  placeholder="Write in Markdown. The preview on the right is exactly what readers get."
                  value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={onBodyKeyDown}
                  aria-label="Body in Markdown"
                />
              </div>
              <div className="adm-preview-wrap">
                <div className="adm-preview-pane">
                  <div className="pane-label">Preview</div>
                  {preview ? (
                    <div className="prose" dangerouslySetInnerHTML={{ __html: preview }} />
                  ) : (
                    <p className="adm-preview-empty">
                      {previewBusy ? 'Rendering...' : 'Preview appears here as you write.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="adm-statusbar">
              <span>{words} words</span>
              <span>about {readMins} min read</span>
              <span className="right">
                <span>{savedAt ? `Saved locally ${savedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}` : 'Autosave on'}</span>
                <button type="button" onClick={refreshPreview} disabled={previewBusy}>
                  {previewBusy ? 'Rendering...' : 'Refresh preview'}
                </button>
                <span>Ctrl/Cmd + S saves</span>
              </span>
            </div>
          </div>
        </div>

        <aside className="adm-rail">
          <section className="adm-card">
            <h3 className="adm-card-title">Publish</h3>
            {post ? (
              <p className="adm-statusline">Status now <StatusPill status={post.status} /></p>
            ) : (
              <p className="adm-statusline">Status now <span className="adm-pill draft">new</span></p>
            )}
            <label htmlFor="section">Section</label>
            <select id="section" name="section" value={fields.section} onChange={(e) => set({ section: e.target.value })}>
              <option value="blog">Blog</option>
              <option value="guides">Guides</option>
              <option value="updates">Updates</option>
            </select>
            <label htmlFor="author_id">Author</label>
            <select id="author_id" name="author_id" value={fields.authorId} onChange={(e) => set({ authorId: e.target.value })}>
              <option value="">Current user / keep author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.display_name}</option>
              ))}
            </select>
            <label htmlFor="intent">On save</label>
            <select id="intent" name="intent" value={fields.intent} onChange={(e) => set({ intent: e.target.value })}>
              <option value="draft">Save as draft</option>
              <option value="review">Send to review</option>
              <option value="published">Publish now</option>
              <option value="scheduled">Schedule</option>
            </select>
            <label htmlFor="scheduled_at">Schedule for</label>
            <input
              id="scheduled_at" name="scheduled_at" type="datetime-local"
              value={fields.scheduledAt} onChange={(e) => set({ scheduledAt: e.target.value })}
            />
            <p style={{ marginTop: 16, marginBottom: 0 }}>
              <button className="adm-btn primary block" type="submit">Save post</button>
            </p>
            <p className="adm-hint">Publishing and scheduling take effect on save.</p>
          </section>

          <section className="adm-card">
            <h3 className="adm-card-title">Details</h3>
            <label htmlFor="tags">Tags, comma separated</label>
            <input id="tags" name="tags" type="text" value={fields.tags} onChange={(e) => set({ tags: e.target.value })} placeholder="minecraft, getting-started" />
            <label htmlFor="game">Game (guides)</label>
            <input id="game" name="game" type="text" value={fields.game} onChange={(e) => set({ game: e.target.value })} placeholder="Minecraft" />
            <label htmlFor="difficulty">Difficulty (guides)</label>
            <select id="difficulty" name="difficulty" value={fields.difficulty} onChange={(e) => set({ difficulty: e.target.value })}>
              <option value="">None</option>
              <option value="starter">Starter</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <label htmlFor="last_verified">Last verified (guides)</label>
            <input id="last_verified" name="last_verified" type="text" placeholder="2026-11-07" value={fields.lastVerified} onChange={(e) => set({ lastVerified: e.target.value })} />
          </section>

          <section className="adm-card">
            <h3 className="adm-card-title">Cover</h3>
            <label htmlFor="cover_path">Cover image path</label>
            <input id="cover_path" name="cover_path" type="text" value={fields.coverPath} onChange={(e) => set({ coverPath: e.target.value })} placeholder="/media/123.png" />
            {/* Plain img on purpose: the path is free text and may be
                external, so the Next image loader stays out of it. */}
            <div className="adm-cover-thumb">
              {fields.coverPath ? (
                <img src={fields.coverPath} alt="Cover preview" width={640} height={320} />
              ) : (
                <span>No cover set. Upload one in Media, then paste its path.</span>
              )}
            </div>
          </section>

          <details className="adm-card adm-seo">
            <summary>SEO, optional</summary>
            <label htmlFor="seo_title">SEO title</label>
            <input id="seo_title" name="seo_title" type="text" value={fields.seoTitle} onChange={(e) => set({ seoTitle: e.target.value })} />
            <label htmlFor="seo_description">SEO description</label>
            <textarea id="seo_description" name="seo_description" rows={3} value={fields.seoDescription} onChange={(e) => set({ seoDescription: e.target.value })} />
            <p className="adm-hint">Blank fields are filled from the title and excerpt on save.</p>
          </details>
        </aside>
      </div>
    </form>
  );
}
