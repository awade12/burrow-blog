import Image from 'next/image';
import { requireAdminPage } from '@/features/auth/guard';
import { query } from '@/lib/db/pool';
import { mediaUrl, type MediaRow } from '@/features/media/store';
import { uploadAction } from './actions';

export const dynamic = 'force-dynamic';

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdminPage();
  const { error, saved } = await searchParams;
  const items = await query<MediaRow & Record<string, unknown>>(
    'select * from media order by created_at desc limit 60',
  );
  return (
    <div>
      <div className="adm-page-head">
        <div className="grow">
          <p className="adm-eyebrow">Library</p>
          <h1 className="adm-title">Media</h1>
          <p className="adm-sub">Upload an image, then paste its path into a post or the cover field.</p>
        </div>
      </div>
      {error ? <p className="adm-banner error">{error}</p> : null}
      {saved ? <p className="adm-banner notice">Uploaded. It is in the library below.</p> : null}
      <form action={uploadAction} className="adm-card" style={{ marginBottom: 22 }}>
        <h3 className="adm-card-title">Upload</h3>
        <label htmlFor="file">Image (png, jpg, webp, gif, svg, max 8 MB)</label>
        <input id="file" name="file" type="file" accept="image/*" required />
        <label htmlFor="alt">Alt text</label>
        <input id="alt" name="alt" type="text" placeholder="What is in this image?" />
        <p style={{ marginBottom: 0 }}>
          <button className="adm-btn primary" type="submit">Upload image</button>
        </p>
      </form>
      <div className="adm-media-grid">
        {items.map((m) => {
          const url = mediaUrl(m.stored_name);
          const md = `![${m.alt}](${url})`;
          return (
            <div className="adm-media-card" key={m.id}>
              <Image className="thumb" src={url} alt={m.alt} width={640} height={320} unoptimized />
              <div className="b">
                <span className="fn">{m.filename}</span>
                <code>{url}</code>
                <code>{md}</code>
              </div>
            </div>
          );
        })}
      </div>
      {items.length === 0 ? <p className="adm-empty">No uploads yet.</p> : null}
    </div>
  );
}
