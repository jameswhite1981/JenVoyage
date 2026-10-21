// Best-effort in-memory rate limiting. Vercel functions can run as multiple
// concurrent instances and don't guarantee a warm instance survives between
// requests, so this doesn't give a hard guarantee the way a shared store
// (Redis/Postgres) would — but it costs no extra infrastructure, and in
// practice Vercel does reuse warm instances for a running stream of requests
// from the same attacker, which is exactly the traffic pattern a scripted
// brute-force or spam attempt looks like. Good enough as a first layer;
// upgrade to Vercel KV/Upstash if this ever needs to be airtight.
const buckets = new Map();

// Keeps the map from growing unboundedly across the life of a warm instance.
function sweep(now) {
  for (const [key, entry] of buckets) {
    if (now - entry.windowStart > 10 * 60 * 1000) buckets.delete(key);
  }
}

// Returns true if `key` (e.g. "login:1.2.3.4") has made more than `limit`
// requests within `windowMs`. Call BEFORE doing the expensive/sensitive
// work, and short-circuit with a 429 if it returns true.
export function isRateLimited(key, limit, windowMs) {
  const now = Date.now();
  if (buckets.size > 1000) sweep(now);

  let entry = buckets.get(key);
  if (!entry || now - entry.windowStart > windowMs) {
    entry = { windowStart: now, count: 0 };
    buckets.set(key, entry);
  }
  entry.count += 1;
  return entry.count > limit;
}

// Best-effort client IP from the headers Vercel sets — falls back to a
// constant so rate limiting still groups "unknown" traffic together rather
// than silently no-op'ing if the header's ever missing.
export function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
