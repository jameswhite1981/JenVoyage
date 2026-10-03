"use server";
import { createMagicLink, updateEnquiry, getEnquiry } from "../../lib/storage.js";
import { sendItineraryReady } from "../../lib/email.js";
import { generatePdf } from "../../lib/pdf.js";
import { getStripe } from "../../lib/stripe.js";
import { TIERS } from "../../lib/pricing.js";

function randomLetters(n) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// Re-sends the "itinerary ready" email for an already-published enquiry —
// e.g. the customer lost the original email or their magic link expired.
// Doesn't touch published_content or status, just issues a fresh magic link.
// personalMessage keeps the stored note in sync in case it was edited since
// publishing. Re-renders the PDF from whatever's actually published, rather
// than trusting a caller-supplied copy, so a resend always reflects the
// live version even if edits happened after the original send.
export async function resendItineraryEmail(email, firstName, destinationName, enquiryId, personalMessage) {
  if (enquiryId) await updateEnquiry(enquiryId, { personal_message: personalMessage || null });
  const token = await createMagicLink(email, enquiryId);
  const enquiry = enquiryId ? await getEnquiry(enquiryId) : null;
  const pdfBuffer = enquiry?.published_content ? await generatePdf(enquiry.published_content, firstName) : null;
  await sendItineraryReady(email, firstName, destinationName, token, personalMessage, pdfBuffer);
}

// Issues a fresh magic link and returns the URL directly, without emailing
// it — a manual fallback for when the automated email isn't reliable, so
// Jen can paste the link into WhatsApp/text/a different email herself. Same
// single-use, 7-day-expiry link the automated email would have sent.
export async function getShareableLink(email, enquiryId) {
  const token = await createMagicLink(email, enquiryId);
  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify?token=${token}`;
}

// Creates a Stripe Checkout Session for a customer Jen has spoken to
// directly (phone/in person) and returns the URL to send manually, rather
// than waiting for them to click through the self-serve "Proceed to
// payment" flow in app/page.js. Same session shape as
// app/api/enquiry/[id]/proceed/route.js — metadata.enquiry_id is all the
// webhook needs to fulfil it identically either way — but lets Jen pick the
// tier herself instead of relying on pickPricingTier's auto-detection,
// since a phone conversation may have surfaced details the written brief
// didn't (e.g. she talked them into — or out of — a multi-region trip).
export async function generatePaymentLink(enquiryId, tierKey) {
  const tier = TIERS[tierKey];
  if (!tier) throw new Error("Unknown pricing tier.");
  const enquiry = await getEnquiry(enquiryId);
  if (!enquiry) throw new Error("Enquiry not found.");

  const base = process.env.NEXT_PUBLIC_BASE_URL;
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
    metadata: { enquiry_id: enquiryId, tier: tier.key },
    success_url: `${base}/?payment=success`,
    cancel_url: `${base}/?payment=cancelled`,
    integration_identifier: `jenvoyage-checkout-${randomLetters(8)}`,
  });

  await updateEnquiry(enquiryId, { status: "wants_to_proceed", proceed_requested_at: new Date().toISOString() });

  return session.url;
}
