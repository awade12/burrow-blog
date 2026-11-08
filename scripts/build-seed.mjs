// Regenerates src/content/seed-posts.json from seed-posts.ts after
// editing seed content. Dev-only (needs the typescript devDependency).
import { readFileSync, writeFileSync } from 'node:fs';
import ts from 'typescript';

const src = readFileSync('src/content/seed-posts.ts', 'utf8');
const js = ts.transpileModule(src, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const mod = { exports: {} };
new Function('module', 'exports', js)(mod, mod.exports);
writeFileSync(
  'src/content/seed-posts.json',
  JSON.stringify({ posts: mod.exports.SEED_POSTS }, null, 2),
);
console.log('seed-posts.json regenerated');
