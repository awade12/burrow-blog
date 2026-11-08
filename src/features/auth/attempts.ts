import 'server-only';
import { query, queryOne } from '@/lib/db/pool';

// Login throttling: 10 failures inside 15 minutes locks the account
// for that window. Counts come from the login_attempts table so the
// limit survives restarts and is shared across processes.
const MAX_FAILURES = 10;
const WINDOW_MINUTES = 15;

export async function recordAttempt(email: string, ip: string, success: boolean): Promise<void> {
  await query('insert into login_attempts (email, ip, success) values ($1, $2, $3)', [
    email.toLowerCase(),
    ip,
    success,
  ]);
}

export async function isLockedOut(email: string): Promise<boolean> {
  const row = await queryOne<{ count: string }>(
    `select count(*)::text as count from login_attempts
      where email = $1 and not success
        and created_at > now() - ($2 || ' minutes')::interval`,
    [email.toLowerCase(), String(WINDOW_MINUTES)],
  );
  return Number(row?.count ?? 0) >= MAX_FAILURES;
}
