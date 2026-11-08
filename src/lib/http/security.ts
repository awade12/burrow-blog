import 'server-only';
import { headers } from 'next/headers';
import { config } from '../config';

// CSRF defence in depth on top of SameSite cookies: any mutation
// must come from our own origin. Server actions get this implicitly
// from Next.js, route handlers call this explicitly.
export async function assertSameOrigin(): Promise<void> {
  const h = await headers();
  const origin = h.get('origin');
  if (!origin) return; // non-browser callers use tokens, not cookies
  const site = new URL(config.siteUrl);
  const from = new URL(origin);
  if (from.host !== site.host && from.host !== h.get('host')) {
    throw new Error('BAD_ORIGIN');
  }
}

export function clientIp(h: Headers): string {
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
}
