// Fails if any source file exceeds the AGENTS.md 500 LOC cap.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const LIMIT = 500;
const ROOTS = ['src', 'scripts', 'db'];
const EXTS = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.sql']);
const SKIP = new Set(['seed-posts.ts']); // data, not code

let failed = false;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (EXTS.has(extname(name)) && !SKIP.has(name)) {
      const lines = readFileSync(path, 'utf8').split('\n').length;
      if (lines > LIMIT) {
        console.error(`OVER ${LIMIT} LOC: ${path} (${lines})`);
        failed = true;
      }
    }
  }
}
for (const root of ROOTS) walk(root);
if (failed) process.exit(1);
console.log(`All files within the ${LIMIT} LOC cap.`);
