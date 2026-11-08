// Creates a drafts-scoped API token from the CLI.
// Usage: DATABASE_URL=... node scripts/create-token.mjs "ivy drafts"
import { createHash, randomBytes } from 'node:crypto';
import pg from 'pg';

const name = process.argv[2] ?? 'cli token';
const token = `wr_${randomBytes(32).toString('base64url')}`;
const hash = createHash('sha256').update(token).digest('hex');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
await client.query('insert into api_tokens (name, token_hash) values ($1, $2)', [name, hash]);
await client.end();
console.log(`Token for "${name}" (shown once):`);
console.log(token);
