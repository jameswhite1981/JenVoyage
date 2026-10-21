import crypto from "node:crypto";
import { createSession } from "../../../../lib/session.js";
import { isRateLimited, clientIp } from "../../../../lib/rateLimit.js";

// Constant-time comparison — a plain !== lets an attacker on the same
// network path statistically recover the password character-by-character
// from response timing, since JS string comparison short-circuits on the
// first mismatched byte. timingSafeEqual needs equal-length buffers, so
// length is checked separately (an early length mismatch doesn't leak
// anything useful — only a few possible lengths, unlike character content).
function passwordMatches(candidate, expected) {
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request) {
  const ip = clientIp(request);
  if (isRateLimited(`admin-login:${ip}`, 10, 10 * 60 * 1000)) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const { password } = await request.json();

  if (!password || !process.env.ADMIN_PASSWORD || !passwordMatches(password, process.env.ADMIN_PASSWORD)) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  await createSession("admin", "admin");
  return Response.json({ ok: true });
}
