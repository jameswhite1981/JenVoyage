import { getPendingMfaSession, createPendingMfaSession } from "../../../../../lib/session.js";
import { getAdminMfa } from "../../../../../lib/storage.js";
import { generateTotpSecret, totpQrDataUrl } from "../../../../../lib/mfa.js";

// Only reachable mid-login (password already verified, real session not
// yet issued) and only when MFA hasn't been enrolled yet — re-enrolling
// over an already-active MFA needs to go through a verified session
// instead, not just a password, or a stolen password alone could be used
// to swap in an attacker's own authenticator.
export async function GET() {
  const pending = await getPendingMfaSession();
  if (!pending) return Response.json({ error: "Session expired, please log in again." }, { status: 401 });

  const existing = await getAdminMfa();
  if (existing?.enabled_at) return Response.json({ error: "MFA is already set up." }, { status: 400 });

  const secret = generateTotpSecret();
  const qr = await totpQrDataUrl(secret);

  // Re-issue the pending cookie carrying this secret so /mfa/confirm can
  // verify against it without it ever touching the database until confirmed.
  await createPendingMfaSession(secret);

  return Response.json({ secret, qr });
}
