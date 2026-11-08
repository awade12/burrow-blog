// Applies db/migrations/*.sql in filename order, once each.
// Plain node + pg, so it runs in the production image with no build step.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import pg from 'pg';

const dir = join(process.cwd(), 'db', 'migrations');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query(`create table if not exists schema_migrations (
  name text primary key, applied_at timestamptz not null default now())`);

for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
  const done = await client.query('select 1 from schema_migrations where name = $1', [file]);
  if (done.rowCount) continue;
  const sql = readFileSync(join(dir, file), 'utf8');
  await client.query('begin');
  try {
    await client.query(sql);
    await client.query('insert into schema_migrations (name) values ($1)', [file]);
    await client.query('commit');
    console.log(`applied ${file}`);
  } catch (err) {
    await client.query('rollback');
    throw err;
  }
}
await client.end();
console.log('migrations complete');
