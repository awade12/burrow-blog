import 'server-only';
import { mkdir, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { extname, join } from 'node:path';
import { config } from '@/lib/config';
import { query, queryOne } from '@/lib/db/pool';

// Uploads live on a Docker volume and are served by the app's media
// route with immutable caching. Filenames are random so a media URL
// is never enumerable by guessing.
const ALLOWED: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};
const MAX_BYTES = 8 * 1024 * 1024;

export type MediaRow = {
  id: string;
  filename: string;
  stored_name: string;
  mime: string;
  size_bytes: number;
  alt: string;
};

export async function saveUpload(
  file: File,
  alt: string,
  uploadedBy: string | null,
): Promise<MediaRow> {
  const ext = ALLOWED[file.type] ?? (file.name ? extname(file.name).toLowerCase() : '');
  if (!Object.values(ALLOWED).includes(ext)) throw new Error('BAD_TYPE');
  if (file.size > MAX_BYTES) throw new Error('TOO_BIG');
  const stored = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`;
  await mkdir(config.uploadDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(join(config.uploadDir, stored), bytes);
  const row = await queryOne<MediaRow>(
    `insert into media (filename, stored_name, mime, size_bytes, alt, uploaded_by)
     values ($1,$2,$3,$4,$5,$6) returning *`,
    [file.name || stored, stored, file.type, file.size, alt, uploadedBy],
  );
  return row!;
}

export async function getMedia(storedName: string): Promise<MediaRow | null> {
  return queryOne<MediaRow>('select * from media where stored_name = $1', [storedName]);
}

export function mediaUrl(storedName: string): string {
  return `/media/${storedName}`;
}
