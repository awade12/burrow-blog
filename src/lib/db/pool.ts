import 'server-only';
import { Pool } from 'pg';
import { config } from '../config';

// One pool per process. Next.js may create this module more than once
// in dev, so the pool is cached on globalThis.
const globalForPool = globalThis as unknown as { warrenPool?: Pool };

export const pool =
  globalForPool.warrenPool ??
  new Pool({ connectionString: config.databaseUrl, max: 8 });

if (process.env.NODE_ENV !== 'production') globalForPool.warrenPool = pool;

export async function query<T extends Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T extends Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
