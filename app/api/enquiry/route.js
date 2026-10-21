import { waitUntil } from "@vercel/functions";
import { createEnquiry, updateEnquiry, getEnquiry } from "../../../lib/storage.js";
import { generateItinerary, generateTeaser } from "../../../lib/ai.js";
import { sendConfirmation } from "../../../lib/email.js";
import { notifyNewEnquiry } from "../../../lib/discord.js";
import { isRateLimited, clientIp } from "../../../lib/rateLimit.js";

export async function POST(request) {
  // Each enquiry triggers two paid Anthropic calls plus an email send, with
  // no login required — an unthrottled version of this endpoint is a
  // billing-abuse vector (scriptable cost attack), not just a spam one.
  if (isRateLimited(`enquiry:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return Response.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

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

    notifyNewEnquiry({
      id: enquiryId, firstName, lastName, email, phone,
      destinationName: destinationName || destination,
    }).catch((err) => console.error("[discord] notify failed for", enquiryId, "—", err?.message || err));

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
        // Don't blindly stamp status "ai_ready" — if the customer already
        // clicked "Proceed to payment" while this background generation was
        // still running, status has moved on to "wants_to_proceed" (or
        // beyond) and this would silently clobber it back.
        const current = await getEnquiry(enquiryId);
        const updates = { ai_draft: rawText, ai_generated_at: new Date().toISOString() };
        if (current?.status === "generating") updates.status = "ai_ready";
        await updateEnquiry(enquiryId, updates);
      } catch (err) {
        console.error("[ai] generation failed for", enquiryId, "—", err?.message || err);
        try {
          const current = await getEnquiry(enquiryId);
          if (current?.status === "generating") await updateEnquiry(enquiryId, { status: "pending" });
        } catch {}
      }
    })());

    return Response.json({ ok: true, id: enquiryId });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
