import { createDealCheck } from "../../../lib/storage.js";
import { notifyNewDealCheck } from "../../../lib/discord.js";
import { isRateLimited, clientIp } from "../../../lib/rateLimit.js";

export async function POST(request) {
  if (isRateLimited(`deal-check:${clientIp(request)}`, 5, 10 * 60 * 1000)) {
    return Response.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const { name, email, description, link } = await request.json().catch(() => ({}));

  if (!name?.trim() || !email?.trim()) {
    return Response.json({ error: "Please fill in your name and email." }, { status: 400 });
  }
  if (!description?.trim() && !link?.trim()) {
    return Response.json({ error: "Please add a description or a link to the deal." }, { status: 400 });
  }

  try {
    const dealCheck = await createDealCheck({
      name: name.trim(),
      email: email.trim(),
      description: description?.trim() || "",
      link: link?.trim() || null,
    });
    notifyNewDealCheck(dealCheck).catch((err) => console.error("[discord] deal-check notify failed —", err?.message || err));
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[deal-check] failed to save submission —", err?.message || err);
    return Response.json({ error: "Could not submit your request. Please try again." }, { status: 500 });
  }
}
