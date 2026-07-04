import { claimMagicLink } from "../../../../lib/storage.js";
import { createSession } from "../../../../lib/session.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  if (!token) return Response.redirect(`${base}/portal/login?error=missing`);

  const link = claimMagicLink(token);
  if (!link) return Response.redirect(`${base}/portal/login?error=invalid`);

  await createSession(link.email, "user");
  return Response.redirect(`${base}/portal`);
}
