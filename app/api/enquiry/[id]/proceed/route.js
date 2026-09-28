import { getEnquiry, updateEnquiry } from "../../../../../lib/storage.js";
import { getStripe } from "../../../../../lib/stripe.js";
import { pickPricingTier } from "../../../../../lib/pricing.js";

function randomLetters(n) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(request, { params }) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) return Response.json({ error: "Not found" }, { status: 404 });

  await updateEnquiry(id, {
    status: "wants_to_proceed",
    proceed_requested_at: new Date().toISOString(),
  });

  const tier = pickPricingTier(enquiry.brief);
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "gbp",
          unit_amount: tier.amountGBP * 100,
          product_data: {
            name: tier.name,
            description: `${enquiry.destination_name} itinerary — Jen Voyage`,
          },
        },
        quantity: 1,
      }],
      customer_email: enquiry.email,
      metadata: { enquiry_id: id, tier: tier.key },
      success_url: `${base}/?payment=success`,
      cancel_url: `${base}/?payment=cancelled`,
      integration_identifier: `jenvoyage-checkout-${randomLetters(8)}`,
    });

    return Response.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("[stripe] failed to create checkout session for", id, "—", err?.message || err);
    return Response.json({ error: "Could not start payment." }, { status: 500 });
  }
}
