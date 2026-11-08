import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { query, queryOne } from '@/lib/db/pool';

export const SESSION_COOKIE = 'warren_session';
const SESSION_DAYS = 30;

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await query(
    'insert into sessions (user_id, token_hash, expires_at) values ($1, $2, $3)',
    [userId, hashToken(token), expires.toISOString()],
  );
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await query('delete from sessions where token_hash = $1', [hashToken(token)]);
  jar.delete(SESSION_COOKIE);
}

export type AuthedUser = {
  id: string;
  slug: string;
  display_name: string;
  email: string;
};

export async function currentUser(): Promise<AuthedUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = await queryOne<AuthedUser>(
    `select u.id, u.slug, u.display_name, u.email
       from sessions s join users u on u.id = s.user_id
      where s.token_hash = $1 and s.expires_at > now() and u.can_login`,
    [hashToken(token)],
  );
  return row;
}

export async function requireUser(): Promise<AuthedUser> {
  const user = await currentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}
