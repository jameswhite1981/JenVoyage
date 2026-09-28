import { getStripe } from "../../../../lib/stripe.js";
import { updateEnquiry } from "../../../../lib/storage.js";

// Signature verification needs the raw request body, so this must run on
// the Node.js runtime (not Edge) and must never let Next.js auto-parse the
// body as JSON before we see it.
export const runtime = "nodejs";

// Fulfillment happens here, not on the success page — a customer isn't
// guaranteed to land back on the success page (they could lose their
// connection right after paying), so anything driven only by that page
// would silently drop payments. checkout.session.completed and
// checkout.session.async_payment_succeeded are both handled, gated on
// payment_status, because delayed-notification payment methods fire
// "completed" while the session is still unpaid.
export async function POST(request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe] webhook signature verification failed —", err?.message || err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    const enquiryId = session.metadata?.enquiry_id;

    if (enquiryId && session.payment_status !== "unpaid") {
      try {
        await updateEnquiry(enquiryId, {
          paid_at: new Date().toISOString(),
          stripe_session_id: session.id,
          amount_paid: session.amount_total, // pence
        });
      } catch (err) {
        console.error("[stripe] failed to mark enquiry paid for", enquiryId, "—", err?.message || err);
        // Returning 500 makes Stripe retry the webhook rather than silently losing the payment record.
        return new Response("Failed to record payment", { status: 500 });
      }
    }
  } else if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object;
    console.error("[stripe] async payment failed for session", session.id, "enquiry", session.metadata?.enquiry_id);
  }

  return Response.json({ received: true });
}
