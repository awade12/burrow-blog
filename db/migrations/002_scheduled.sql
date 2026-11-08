-- Scheduled publishing: a post can sit in 'scheduled' status with a
-- scheduled_at time; public queries treat it as live once that time
-- passes (see posts/queries.ts). Status check widened accordingly.
alter table posts drop constraint if exists posts_status_check;
alter table posts add constraint posts_status_check
  check (status in ('draft', 'review', 'scheduled', 'published'));
alter table posts add column if not exists scheduled_at timestamptz;
