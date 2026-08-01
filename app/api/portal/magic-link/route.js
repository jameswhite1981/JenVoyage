import { listEnquiriesByEmail, createMagicLink } from "../../../../lib/storage.js";
import { sendMagicLink } from "../../../../lib/email.js";

export async function POST(request) {
  const { email, enquiryId } = await request.json();
  if (!email) return Response.json({ error: "Email required." }, { status: 400 });

  // Check the email has an enquiry
  const enquiries = await listEnquiriesByEmail(email);
  if (!enquiries.length) {
    // Return success regardless to avoid email enumeration
    return Response.json({ ok: true });
  }

  // Only honour enquiryId if it actually belongs to this email — otherwise
  // someone could pass an arbitrary enquiry id from a different account.
  const validEnquiryId = enquiryId && enquiries.some(e => e.id === enquiryId) ? enquiryId : null;

  const token = await createMagicLink(email, validEnquiryId);
  await sendMagicLink(email, token);

  return Response.json({ ok: true });
}
