import { waitUntil } from "@vercel/functions";
import { createEnquiry, updateEnquiry } from "../../../lib/storage.js";
import { generateItinerary, generateTeaser } from "../../../lib/ai.js";
import { sendConfirmation } from "../../../lib/email.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, referral, destination, destinationName, continent, brief = {} } = body;

    if (!firstName || !email || !destination) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const enquiry = await createEnquiry({
      first_name: firstName,
      last_name: lastName || null,
      email,
      phone: phone || null,
      referral: referral || null,
      destination_name: destinationName || destination,
      brief: { ...brief, destination, destinationName, continent },
      status: "generating",
    });

    sendConfirmation(email, firstName, destinationName || destination).catch(() => {});

    const enquiryId = enquiry.id;

    // Fast teaser (small output, quick model) so the customer sees something
    // in seconds, independent of the full itinerary generation below.
    // waitUntil keeps these running on Vercel after the response returns —
    // without it, the function instance can freeze mid-generation.
    waitUntil((async () => {
      try {
        const teaserText = await generateTeaser(destinationName || destination, brief);
        await updateEnquiry(enquiryId, {
          teaser: teaserText,
          teaser_generated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("[ai] teaser generation failed for", enquiryId, "—", err?.message || err);
      }
    })());

    waitUntil((async () => {
      try {
        console.log("[ai] starting generation for", enquiryId);
        const rawText = await generateItinerary(destinationName || destination, brief);
        console.log("[ai] generation complete for", enquiryId);
        await updateEnquiry(enquiryId, {
          ai_draft: rawText,
          ai_generated_at: new Date().toISOString(),
          status: "ai_ready",
        });
      } catch (err) {
        console.error("[ai] generation failed for", enquiryId, "—", err?.message || err);
        try { await updateEnquiry(enquiryId, { status: "pending" }); } catch {}
      }
    })());

    return Response.json({ ok: true, id: enquiryId });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
