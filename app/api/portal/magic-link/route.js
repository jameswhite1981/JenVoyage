import { listEnquiriesByEmail, createMagicLink } from "../../../../lib/storage.js";
import { sendMagicLink } from "../../../../lib/email.js";

export async function POST(request) {
  const { email } = await request.json();
  if (!email) return Response.json({ error: "Email required." }, { status: 400 });

  // Check the email has an enquiry
  const enquiries = await listEnquiriesByEmail(email);
  if (!enquiries.length) {
    // Return success regardless to avoid email enumeration
    return Response.json({ ok: true });
  }

  const token = await createMagicLink(email);
  await sendMagicLink(email, token);

  return Response.json({ ok: true });
}
