create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  email text unique,
  password_hash text,
  can_login boolean not null default false,
  bio text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('blog', 'guides', 'updates')),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body_md text not null default '',
  cover_path text,
  tags text[] not null default '{}',
  author_id uuid not null references users(id),
  status text not null default 'draft' check (status in ('draft', 'review', 'published')),
  game text,
  difficulty text check (difficulty in ('starter', 'intermediate', 'advanced')),
  last_verified date,
  seo_title text not null default '',
  seo_description text not null default '',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_public_idx
  on posts (section, status, published_at desc);

create table if not exists slug_redirects (
  old_slug text primary key,
  post_id uuid not null references posts(id) on delete cascade
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists api_tokens (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  token_hash text not null unique,
  scope text not null default 'drafts',
  created_by uuid references users(id),
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists login_attempts (
  id bigint generated always as identity primary key,
  email text not null,
  ip text not null,
  success boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_idx on login_attempts (email, created_at desc);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  stored_name text not null unique,
  mime text not null,
  size_bytes integer not null,
  alt text not null default '',
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now()
);
