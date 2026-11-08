import 'server-only';
import { randomBytes } from 'node:crypto';
import { query, queryOne } from '@/lib/db/pool';
import { hashToken } from './session';

// API tokens for programmatic drafting (ivy). Scope is fixed to
// 'drafts': a token can create and edit drafts, never publish.
export async function createApiToken(name: string, createdBy: string | null): Promise<string> {
  const token = `wr_${randomBytes(32).toString('base64url')}`;
  await query('insert into api_tokens (name, token_hash, created_by) values ($1, $2, $3)', [
    name,
    hashToken(token),
    createdBy,
  ]);
  return token;
}

export async function userIdForApiToken(token: string): Promise<string | null> {
  if (!token.startsWith('wr_')) return null;
  const row = await queryOne<{ id: string; created_by: string | null }>(
    `update api_tokens set last_used_at = now()
      where token_hash = $1 and revoked_at is null and scope = 'drafts'
      returning id, created_by`,
    [hashToken(token)],
  );
  return row?.created_by ?? null;
}
