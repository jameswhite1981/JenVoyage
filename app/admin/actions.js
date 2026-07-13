"use server";
import { createMagicLink } from "../../lib/storage.js";
import { sendItineraryReady } from "../../lib/email.js";

// Re-sends the "itinerary ready" email for an already-published enquiry —
// e.g. the customer lost the original email or their magic link expired.
// Doesn't touch published_content or status, just issues a fresh magic link.
export async function resendItineraryEmail(email, firstName, destinationName) {
  const token = await createMagicLink(email);
  await sendItineraryReady(email, firstName, destinationName, token);
}

// Issues a fresh magic link and returns the URL directly, without emailing
// it — a manual fallback for when the automated email isn't reliable, so
// Jen can paste the link into WhatsApp/text/a different email herself. Same
// single-use, 7-day-expiry link the automated email would have sent.
export async function getShareableLink(email) {
  const token = await createMagicLink(email);
  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${token}`;
}
