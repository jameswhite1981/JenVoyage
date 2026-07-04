import { createEnquiry, updateEnquiry } from "../../../lib/storage.js";
import { generateItinerary } from "../../../lib/ai.js";
import { sendConfirmation } from "../../../lib/email.js";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, referral, destination, destinationName, continent, brief = {} } = body;

    if (!firstName || !email || !destination) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }

    const enquiry = createEnquiry({
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
    (async () => {
      try {
        console.log("[ai] starting generation for", enquiryId);
        const rawText = await generateItinerary(destinationName || destination, brief);
        console.log("[ai] generation complete for", enquiryId);
        updateEnquiry(enquiryId, {
          ai_draft: rawText,
          ai_generated_at: new Date().toISOString(),
          status: "ai_ready",
        });
      } catch (err) {
        console.error("[ai] generation failed for", enquiryId, "—", err?.message || err);
        try { updateEnquiry(enquiryId, { status: "pending" }); } catch {}
      }
    })();

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
