"use server";
import { updateEnquiry, createMagicLink } from "../../../../lib/storage.js";
import { sendItineraryReady } from "../../../../lib/email.js";

export async function saveDraft(id, content) {
  updateEnquiry(id, { published_content: content });
}

export async function publishEnquiry(id, content, email, firstName, destinationName) {
  updateEnquiry(id, {
    published_content: content,
    status: "published",
    published_at: new Date().toISOString(),
  });

  const token = createMagicLink(email);
  await sendItineraryReady(email, firstName, destinationName, token);
}
