// Cache policy for reader pages. Content changes rarely and publish
// actions revalidate the Next cache, so browsers and shared caches
// can hold pages briefly and serve stale while revalidating.
export const PUBLIC_CACHE = {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
} as const;

export const IMMUTABLE_CACHE = {
  'Cache-Control': 'public, max-age=31536000, immutable',
} as const;
