import crypto from "crypto";
import { db } from "../../../../lib/db.js";
import { sendMagicLink } from "../../../../lib/email.js";

export async function POST(request) {
  const { email } = await request.json();
  if (!email) return Response.json({ error: "Email required." }, { status: 400 });

  // Check the email has an enquiry
  const { data } = await db.from("enquiries").select("id").eq("email", email).limit(1);
  if (!data?.length) {
    // Return success regardless to avoid email enumeration
    return Response.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await db.from("magic_links").insert({ email, token, expires_at: expiresAt });
  await sendMagicLink(email, token);

  return Response.json({ ok: true });
}
