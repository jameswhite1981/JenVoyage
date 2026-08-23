"use server";
import { createMagicLink, updateEnquiry } from "../../lib/storage.js";
import { sendItineraryReady } from "../../lib/email.js";

// Re-sends the "itinerary ready" email for an already-published enquiry —
// e.g. the customer lost the original email or their magic link expired.
// Doesn't touch published_content or status, just issues a fresh magic link.
// personalMessage keeps the stored note in sync in case it was edited since
// publishing.
export async function resendItineraryEmail(email, firstName, destinationName, enquiryId, personalMessage) {
  if (enquiryId) await updateEnquiry(enquiryId, { personal_message: personalMessage || null });
  const token = await createMagicLink(email, enquiryId);
  await sendItineraryReady(email, firstName, destinationName, token, personalMessage);
}

// Issues a fresh magic link and returns the URL directly, without emailing
// it — a manual fallback for when the automated email isn't reliable, so
// Jen can paste the link into WhatsApp/text/a different email herself. Same
// single-use, 7-day-expiry link the automated email would have sent.
export async function getShareableLink(email, enquiryId) {
  const token = await createMagicLink(email, enquiryId);
  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${token}`;
}
