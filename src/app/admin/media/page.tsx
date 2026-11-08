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
      <h1 style={{ marginTop: 0 }}>Media</h1>
      {error ? <p className="error">{error}</p> : null}
      {saved ? <p className="notice">Uploaded.</p> : null}
      <form action={uploadAction} className="panel" style={{ marginBottom: 22 }}>
        <label htmlFor="file">Image (png, jpg, webp, gif, svg, max 8 MB)</label>
        <input id="file" name="file" type="file" accept="image/*" required />
        <label htmlFor="alt">Alt text</label>
        <input id="alt" name="alt" type="text" placeholder="What is in this image?" />
        <p><button type="submit">Upload</button></p>
      </form>
      <div className="grid">
        {items.map((m) => {
          const url = mediaUrl(m.stored_name);
          const md = `![${m.alt}](${url})`;
          return (
            <div className="card" key={m.id}>
              <Image className="cover" src={url} alt={m.alt} width={640} height={320} unoptimized />
              <div className="body">
                <strong style={{ fontSize: 14 }}>{m.filename}</strong>
                <code style={{ fontSize: 12.5, wordBreak: 'break-all' }}>{url}</code>
                <code style={{ fontSize: 12.5, wordBreak: 'break-all', color: 'var(--muted)' }}>{md}</code>
              </div>
            </div>
          );
        })}
      </div>
      {items.length === 0 ? <p style={{ color: 'var(--muted)' }}>No uploads yet.</p> : null}
    </div>
  );
}
