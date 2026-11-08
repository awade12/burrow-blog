import { queryOne } from '@/lib/db/pool';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await queryOne('select 1 as ok');
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
