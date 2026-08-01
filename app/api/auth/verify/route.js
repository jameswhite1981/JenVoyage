import { claimMagicLink } from "../../../../lib/storage.js";
import { createSession } from "../../../../lib/session.js";

// GET only forwards to the confirmation page — it must not claim the token
// itself, since email security scanners (e.g. Outlook Safe Links) pre-fetch
// links in emails and would silently burn the one-time token before the
// real user ever clicks.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  if (!token) return Response.redirect(`${base}/portal/login?error=missing`);
  return Response.redirect(`${base}/portal/verify?token=${token}`);
}

export async function POST(request) {
  const { token } = await request.json();
  if (!token) return Response.json({ error: "missing" }, { status: 400 });

  const link = await claimMagicLink(token);
  if (!link) return Response.json({ error: "invalid" }, { status: 400 });

  await createSession(link.email, "user");
  return Response.json({ ok: true, enquiryId: link.enquiry_id });
}
