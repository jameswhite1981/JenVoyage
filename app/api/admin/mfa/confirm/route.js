import { getPendingMfaSession, clearPendingMfaSession, createSession } from "../../../../../lib/session.js";
import { enableAdminMfa, getAdminMfa } from "../../../../../lib/storage.js";
import { verifyTotp, generateBackupCodes, hashBackupCode } from "../../../../../lib/mfa.js";
import { isRateLimited, clientIp } from "../../../../../lib/rateLimit.js";

// Completes first-time enrollment: proves the admin can generate a valid
// code from the secret /mfa/setup just issued (carried in the pending
// cookie, never the database) before persisting anything, then returns a
// fresh set of backup codes in plaintext — the only time they're ever
// visible, since only their hash gets stored.
export async function POST(request) {
  if (isRateLimited(`mfa-confirm:${clientIp(request)}`, 10, 10 * 60 * 1000)) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const pending = await getPendingMfaSession();
  if (!pending?.pendingSecret) return Response.json({ error: "Session expired, please log in again." }, { status: 401 });

  const existing = await getAdminMfa();
  if (existing?.enabled_at) return Response.json({ error: "MFA is already set up." }, { status: 400 });

  const { code } = await request.json();
  if (!verifyTotp(pending.pendingSecret, code)) {
    return Response.json({ error: "Incorrect code." }, { status: 401 });
  }

  const backupCodes = generateBackupCodes();
  await enableAdminMfa(pending.pendingSecret, backupCodes.map(hashBackupCode));

  await clearPendingMfaSession();
  await createSession("admin", "admin");

  return Response.json({ ok: true, backupCodes });
}
