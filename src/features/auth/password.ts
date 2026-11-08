import 'server-only';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

type ScryptOptions = { N: number; r: number; p: number; maxmem: number };
function scryptAsync(
  password: string,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, options, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

// scrypt with OWASP-friendly parameters. The stored format is
// scrypt$N$r$p$saltB64$hashB64 so parameters can evolve per record.
// maxmem must be set explicitly: N=32768, r=8 needs a little over
// Node's 32 MB default limit, and scrypt throws without it.
const N = 32768;
const R = 8;
const P = 1;
const MAXMEM = 128 * 1024 * 1024;
const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM });
  return ['scrypt', N, R, P, salt.toString('base64'), hash.toString('base64')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64!, 'base64');
  const actual = await scryptAsync(password, Buffer.from(saltB64!, 'base64'), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: MAXMEM,
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
