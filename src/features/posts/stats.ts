import 'server-only';
import { query } from '@/lib/db/pool';

export type PostStats = {
  total: number;
  byStatus: Record<string, number>;
  bySection: Record<string, number>;
};

export async function postStats(): Promise<PostStats> {
  const rows = await query<{ status: string; section: string; count: string }>(
    'select status, section, count(*)::text as count from posts group by status, section',
  );
  const stats: PostStats = { total: 0, byStatus: {}, bySection: {} };
  for (const r of rows) {
    const n = Number(r.count);
    stats.total += n;
    stats.byStatus[r.status] = (stats.byStatus[r.status] ?? 0) + n;
    stats.bySection[r.section] = (stats.bySection[r.section] ?? 0) + n;
  }
  return stats;
}
