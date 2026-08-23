"use server";
import { updateEnquiry, createMagicLink } from "../../../../lib/storage.js";
import { sendItineraryReady } from "../../../../lib/email.js";

export async function saveDraft(id, content) {
  await updateEnquiry(id, { published_content: content });
}

export async function publishEnquiry(id, content, email, firstName, destinationName, personalMessage) {
  await updateEnquiry(id, {
    published_content: content,
    status: "published",
    published_at: new Date().toISOString(),
    personal_message: personalMessage || null,
  });

  const token = await createMagicLink(email, id);
  await sendItineraryReady(email, firstName, destinationName, token, personalMessage);
}
