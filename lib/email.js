import { Resend } from "resend";

// Lazy so importing this module never requires RESEND_API_KEY to be present
// — see lib/db.js for why (Next.js build-time page-data-collection).
let resend;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}
const FROM = process.env.RESEND_FROM || "Jen Voyage <noreply@jenvoyage.com>";
const BASE = process.env.NEXT_PUBLIC_BASE_URL;

export async function sendConfirmation(email, firstName, destinationName) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `We've received your brief — Jen Voyage`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1C1A17">
        <p style="font-size:0.75rem;letter-spacing:0.3em;text-transform:uppercase;color:#B8962E">Jen Voyage</p>
        <h1 style="font-size:1.8rem;font-weight:300">Thank you, ${firstName}.</h1>
        <p style="font-size:1rem;line-height:1.8;color:#4A3F35">
          We've received your brief for ${destinationName} and we're on it.
          Your personalised itinerary will be ready within 48 hours.
        </p>
        <p style="font-size:1rem;line-height:1.8;color:#4A3F35">
          Once it's ready, you'll receive a link to view and download your full itinerary.
          If you have anything to add in the meantime, just reply to this email.
        </p>
        <p style="font-size:0.9rem;color:#C8BFB0;margin-top:2rem">— Jen</p>
      </div>
    `,
  });
}

export async function sendMagicLink(email, token) {
  const link = `${BASE}/api/auth/verify?token=${token}`;
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your Jen Voyage login link`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1C1A17">
        <p style="font-size:0.75rem;letter-spacing:0.3em;text-transform:uppercase;color:#B8962E">Jen Voyage</p>
        <h1 style="font-size:1.8rem;font-weight:300">Your login link</h1>
        <p style="font-size:1rem;line-height:1.8;color:#4A3F35">
          Click the button below to access your Jen Voyage portal. This link expires in 7 days and can only be used once.
        </p>
        <a href="${link}" style="display:inline-block;background:#1C1A17;color:#FDFBF8;font-family:system-ui,sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;padding:0.9rem 2rem;text-decoration:none;margin:1rem 0">
          View my itinerary →
        </a>
        <p style="font-size:0.8rem;color:#C8BFB0;margin-top:1.5rem">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendItineraryReady(email, firstName, destinationName, token) {
  const link = `${BASE}/api/auth/verify?token=${token}`;
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your ${destinationName} itinerary is ready — Jen Voyage`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1C1A17">
        <p style="font-size:0.75rem;letter-spacing:0.3em;text-transform:uppercase;color:#B8962E">Jen Voyage</p>
        <h1 style="font-size:1.8rem;font-weight:300">Your itinerary is ready, ${firstName}.</h1>
        <p style="font-size:1rem;line-height:1.8;color:#4A3F35">
          Your bespoke ${destinationName} itinerary is ready to view. Click below to see your full day-by-day plan and download your PDF copy.
        </p>
        <a href="${link}" style="display:inline-block;background:#1C1A17;color:#FDFBF8;font-family:system-ui,sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;padding:0.9rem 2rem;text-decoration:none;margin:1rem 0">
          View my itinerary →
        </a>
        <p style="font-size:0.9rem;color:#C8BFB0;margin-top:2rem">— Jen</p>
      </div>
    `,
  });
}
