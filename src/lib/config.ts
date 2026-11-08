import 'server-only';

// Single place that reads the environment. Everything else imports
// from here so a missing variable fails at boot with a clear name.
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const config = {
  databaseUrl: required('DATABASE_URL'),
  sessionSecret: required('SESSION_SECRET'),
  siteUrl: (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
  siteName: 'The Warren',
  siteTagline: 'Blog, guides and updates from Burrow',
  siteDescription:
    'Game servers you split with friends. Guides, updates and notes from the Burrow team.',
};
