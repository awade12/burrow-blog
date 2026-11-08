import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { config } from '@/lib/config';
import { IMMUTABLE_CACHE } from '@/lib/http/cache';
import { getMedia } from '@/features/media/store';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (name.includes('/') || name.includes('..')) return new NextResponse('Not found', { status: 404 });
  const row = await getMedia(name);
  if (!row) return new NextResponse('Not found', { status: 404 });
  try {
    const bytes = await readFile(join(config.uploadDir, row.stored_name));
    return new NextResponse(bytes, {
      headers: { 'Content-Type': row.mime, ...IMMUTABLE_CACHE },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
