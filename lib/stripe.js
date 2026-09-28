import Stripe from "stripe";

// Lazy so importing this module never requires STRIPE_SECRET_KEY to be
// present — see lib/db.js for why (Next.js build-time page-data collection).
// Always call methods on this instantiated client, never the deprecated
// stripe.api_key = ... global pattern.
let stripe;
export function getStripe() {
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripe;
}
