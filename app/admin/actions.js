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
