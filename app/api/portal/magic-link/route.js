import { listEnquiriesByEmail, createMagicLink } from "../../../../lib/storage.js";
import { sendMagicLink } from "../../../../lib/email.js";
import { isRateLimited, clientIp } from "../../../../lib/rateLimit.js";

export async function POST(request) {
  // Unthrottled, this sends an email per request with no auth — an easy way
  // to spam a stranger's inbox with login-link emails (and burn Resend
  // send credits) without even needing a valid email to enumerate.
  if (isRateLimited(`magic-link:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return Response.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

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
