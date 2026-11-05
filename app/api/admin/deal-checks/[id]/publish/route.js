import crypto from "node:crypto";
import { getDealCheck, updateDealCheck, markDealCheckHandled } from "../../../../../../lib/storage.js";
import { sendDealCheckResponse } from "../../../../../../lib/email.js";

export async function POST(request, { params }) {
  const { id } = await params;
  const { response_links, response_message, response_total_cost, response_per_person_cost, response_amount_saved, response_verdict } = await request.json();

  const existing = await getDealCheck(id);
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  // Reuse the existing token on a re-publish (e.g. after tweaking the
  // message) rather than minting a new one, so a link already sent to the
  // customer keeps working.
  const token = existing.response_token || crypto.randomBytes(24).toString("hex");

  try {
    await updateDealCheck(id, {
      response_links: response_links || [],
      response_message: response_message || null,
      response_total_cost: response_total_cost || null,
      response_per_person_cost: response_per_person_cost || null,
      response_amount_saved: response_amount_saved || null,
      response_verdict: response_verdict || null,
      response_token: token,
      published_at: new Date().toISOString(),
    });
    await markDealCheckHandled(id, true);
    await sendDealCheckResponse(existing.email, existing.name, response_message || "", token);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[deal-check] publish failed for", id, "—", err?.message || err);
    return Response.json({ error: "Could not publish. Please try again." }, { status: 500 });
  }
}
