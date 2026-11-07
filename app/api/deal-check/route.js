import { createDealCheck } from "../../../lib/storage.js";
import { notifyNewDealCheck } from "../../../lib/discord.js";
import { isRateLimited, clientIp } from "../../../lib/rateLimit.js";

export async function POST(request) {
  if (isRateLimited(`deal-check:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return Response.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const { name, email, description, link, totalCost, adults, childrenUnder16, transferIncluded } = await request.json().catch(() => ({}));

  if (!name?.trim() || !email?.trim()) {
    return Response.json({ error: "Please fill in your name and email." }, { status: 400 });
  }
  if (!description?.trim() && !link?.trim()) {
    return Response.json({ error: "Please add a description or a link to the deal." }, { status: 400 });
  }

  // Parsed defensively rather than trusted as-is — this is a public,
  // unauthenticated endpoint, and a malformed/garbage value here shouldn't
  // fail the whole submission, just fall back to "not provided".
  const toPositiveInt = (v) => {
    const n = Number.parseInt(v, 10);
    return Number.isInteger(n) && n >= 0 ? n : null;
  };

  try {
    const dealCheck = await createDealCheck({
      name: name.trim(),
      email: email.trim(),
      description: description?.trim() || "",
      link: link?.trim() || null,
      quoted_total_cost: totalCost?.trim() || null,
      adults: toPositiveInt(adults),
      children_under_16: toPositiveInt(childrenUnder16),
      transfer_included: Boolean(transferIncluded),
    });
    notifyNewDealCheck(dealCheck).catch((err) => console.error("[discord] deal-check notify failed —", err?.message || err));
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[deal-check] failed to save submission —", err?.message || err);
    return Response.json({ error: "Could not submit your request. Please try again." }, { status: 500 });
  }
}
