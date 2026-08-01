import Link from "next/link";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", white: "#FDFBF8",
};

const sans = { fontFamily: "system-ui,sans-serif" };

const SECTIONS = [
  {
    title: "1. About Jen Voyage",
    body: "Jen Voyage designs personalised holiday itineraries. We are not a travel agent or tour operator: we do not sell flights, accommodation or activities, and we do not take payment for bookings made through the links we provide.",
  },
  {
    title: "2. Our Service",
    body: "You provide us with a brief describing your trip. We research and produce a bespoke itinerary with suggested flights, accommodation and activities, along with direct booking links. Any tweaks within the stated review window are included in the price you paid.",
  },
  {
    title: "3. Bookings & Payments",
    body: "All bookings are made directly by you with the relevant airline, hotel or activity provider, under their own terms and conditions. Jen Voyage is not a party to those bookings and is not responsible for pricing changes, availability, cancellations or refunds made by third-party providers.",
  },
  {
    title: "4. Accuracy of Information",
    body: "We make every effort to ensure prices, availability and travel requirements (such as visas or vaccinations) are accurate at the time of writing, but these can change. You are responsible for checking official sources before you travel.",
  },
  {
    title: "5. Liability",
    body: "Jen Voyage accepts no liability for losses arising from bookings made, or not made, based on our itinerary suggestions, or for issues arising during your trip.",
  },
  {
    title: "6. Cancellations & Refunds",
    body: "Once your itinerary has been delivered, fees paid to Jen Voyage are non-refundable, except where required by law.",
  },
  {
    title: "7. Governing Law",
    body: "These terms are governed by the laws of England and Wales.",
  },
  {
    title: "8. Contact",
    body: "Questions about these terms can be sent to jen@jenvoyage.com.",
  },
];

export default function TermsPage() {
  return (
    <div style={{ fontFamily: "Georgia,serif", background: COLORS.sand, minHeight: "100vh", color: COLORS.ink }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: `1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.dusk, textDecoration: "none" }}>← Home</Link>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "1rem" }}>Legal</div>
        <h1 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "2rem" }}>Terms &amp; Conditions</h1>

        <div style={{ ...sans, fontSize: "0.8rem", color: COLORS.dusk, lineHeight: 1.7, background: COLORS.white, border: `1px solid ${COLORS.stone}`, padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
          <strong>Draft placeholder.</strong> This page has not been reviewed by a solicitor and should not be relied on as your binding terms. Replace this text with reviewed terms before treating it as legally in effect.
        </div>

        {SECTIONS.map((s) => (
          <div key={s.title} style={{ marginBottom: "1.75rem" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 400, marginBottom: "0.5rem" }}>{s.title}</h2>
            <p style={{ ...sans, fontSize: "0.88rem", fontWeight: 300, color: COLORS.dusk, lineHeight: 1.75, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
