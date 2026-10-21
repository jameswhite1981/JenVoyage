import { getPendingMfaSession, clearPendingMfaSession, createSession } from "../../../../../lib/session.js";
import { getAdminMfa, consumeBackupCode } from "../../../../../lib/storage.js";
import { verifyTotp, hashBackupCode } from "../../../../../lib/mfa.js";
import { isRateLimited, clientIp } from "../../../../../lib/rateLimit.js";

// The second step of every login once MFA is enrolled: a 6-digit TOTP code,
// or (if the authenticator's unavailable) a one-time backup code. Either
// path only ever upgrades the pending cookie into the real admin session,
// never the password step alone.
export async function POST(request) {
  if (isRateLimited(`mfa-verify:${clientIp(request)}`, 10, 10 * 60 * 1000)) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const pending = await getPendingMfaSession();
  if (!pending) return Response.json({ error: "Session expired, please log in again." }, { status: 401 });

  const mfa = await getAdminMfa();
  if (!mfa?.enabled_at) return Response.json({ error: "MFA isn't set up." }, { status: 400 });

  const { code } = await request.json();
  const trimmed = String(code || "").trim();

  const okTotp = verifyTotp(mfa.totp_secret, trimmed);
  const okBackup = !okTotp && /^[0-9A-F]{5}-[0-9A-F]{5}$/i.test(trimmed)
    ? await consumeBackupCode(mfa.id, hashBackupCode(trimmed))
    : false;

  if (!okTotp && !okBackup) {
    return Response.json({ error: "Incorrect code." }, { status: 401 });
  }

  await clearPendingMfaSession();
  await createSession("admin", "admin");
  return Response.json({ ok: true });
}
