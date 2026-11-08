import 'server-only';
import { query, queryOne } from '@/lib/db/pool';
import { hashPassword, verifyPassword } from './password';

export type UserRow = {
  id: string;
  slug: string;
  display_name: string;
  email: string | null;
  can_login: boolean;
};

export async function loginUserCount(): Promise<number> {
  const row = await queryOne<{ count: string }>(
    'select count(*)::text as count from users where can_login',
  );
  return Number(row?.count ?? 0);
}

export async function findLoginUser(email: string): Promise<(UserRow & { password_hash: string }) | null> {
  return queryOne(
    `select id, slug, display_name, email, can_login, password_hash
       from users where lower(email) = lower($1) and can_login and password_hash is not null`,
    [email],
  );
}

export async function checkCredentials(email: string, password: string): Promise<UserRow | null> {
  const user = await findLoginUser(email);
  if (!user) return null;
  const ok = await verifyPassword(password, user.password_hash);
  return ok ? user : null;
}

// First-run setup. If an author profile already exists with the
// chosen slug (seed content ships 'andrew', 'ivy' and 'burrow-team'
// profiles), the owner claims it by attaching their login to it.
export async function setupOwner(input: {
  displayName: string;
  email: string;
  password: string;
  slug: string;
}): Promise<UserRow> {
  if ((await loginUserCount()) > 0) throw new Error('SETUP_DONE');
  const hash = await hashPassword(input.password);
  const existing = await queryOne<UserRow>('select * from users where slug = $1', [input.slug]);
  if (existing) {
    const row = await queryOne<UserRow>(
      `update users set display_name = $2, email = $3, password_hash = $4, can_login = true
        where slug = $1 returning id, slug, display_name, email, can_login`,
      [input.slug, input.displayName, input.email.toLowerCase(), hash],
    );
    return row!;
  }
  const row = await queryOne<UserRow>(
    `insert into users (slug, display_name, email, password_hash, can_login)
     values ($1, $2, $3, $4, true) returning id, slug, display_name, email, can_login`,
    [input.slug, input.displayName, input.email.toLowerCase(), hash],
  );
  return row!;
}

export async function listAuthors(): Promise<UserRow[]> {
  return query<UserRow>(
    'select id, slug, display_name, email, can_login from users order by display_name',
  );
}

export async function getUserBySlug(slug: string): Promise<UserRow | null> {
  return queryOne<UserRow>('select id, slug, display_name, email, can_login from users where slug = $1', [slug]);
}

export async function createAuthorProfile(slug: string, displayName: string): Promise<UserRow> {
  const row = await queryOne<UserRow>(
    `insert into users (slug, display_name) values ($1, $2)
     on conflict (slug) do update set display_name = excluded.display_name
     returning id, slug, display_name, email, can_login`,
    [slug, displayName],
  );
  return row!;
}

// Additional team logins are created by an existing admin, never by
// public sign-up (there is no sign-up route at all).
export async function createLoginUser(input: {
  slug: string;
  displayName: string;
  email: string;
  password: string;
}): Promise<UserRow> {
  const hash = await hashPassword(input.password);
  const existing = await queryOne<UserRow>('select * from users where slug = $1', [input.slug]);
  if (existing) {
    const row = await queryOne<UserRow>(
      `update users set display_name=$2, email=$3, password_hash=$4, can_login=true
        where slug=$1 returning id, slug, display_name, email, can_login`,
      [input.slug, input.displayName, input.email.toLowerCase(), hash],
    );
    return row!;
  }
  const row = await queryOne<UserRow>(
    `insert into users (slug, display_name, email, password_hash, can_login)
     values ($1,$2,$3,$4,true) returning id, slug, display_name, email, can_login`,
    [input.slug, input.displayName, input.email.toLowerCase(), hash],
  );
  return row!;
}
