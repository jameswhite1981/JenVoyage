import Link from "next/link";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", white: "#FDFBF8",
};

const sans = { fontFamily: "system-ui,sans-serif" };

const SECTIONS = [
  {
    title: "1. Who we are",
    body: "Jen Voyage ([legal business name], [registered/trading address], company number [if applicable]) is the data controller for the personal information described in this policy. For any privacy query, contact jen@jenvoyage.com.",
  },
  {
    title: "2. What we collect",
    body: "When you submit a trip brief we collect your name, email address, phone number, and details about your trip (destinations, dates, budget, travel party, and preferences). This can include dietary requirements and accessibility or mobility needs, which may reveal information about your religion or health — special category data under UK GDPR. We only ask for this to plan a trip that actually works for you, and only with your consent by submitting the form.",
  },
  {
    title: "3. Why we process it",
    body: "To research and produce your itinerary, to contact you about your enquiry, and to send you your login link and itinerary-ready emails. Our lawful basis is performance of a contract (or steps toward one) for trip details, and explicit consent for dietary/accessibility information.",
  },
  {
    title: "4. Who we share it with",
    body: "We use third-party processors to run the service: Supabase (database hosting), Resend (transactional email delivery), and Vercel (website hosting). We do not sell your data or share it with third parties for marketing purposes. We never share your dietary or accessibility information with airlines, hotels, or activity providers — any bookings you make directly with them are between you and that provider.",
  },
  {
    title: "5. How long we keep it",
    body: "We retain enquiry data for [retention period, e.g. 24 months] after your last enquiry, or as needed to comply with our legal obligations, after which it is deleted.",
  },
  {
    title: "6. Cookies",
    body: "We only use strictly necessary cookies needed to keep you signed in (for the customer portal and admin area). We do not use analytics, advertising, or tracking cookies, so no cookie consent banner is shown. See our Cookie Policy for details.",
  },
  {
    title: "7. Your rights",
    body: "Under UK GDPR you have the right to access, correct, or request deletion of your personal data, to object to or restrict our processing of it, and to withdraw consent at any time. Contact jen@jenvoyage.com to exercise any of these rights. You also have the right to complain to the Information Commissioner's Office (ico.org.uk) if you believe your data has been mishandled.",
  },
  {
    title: "8. Contact",
    body: "Questions about this policy or your data can be sent to jen@jenvoyage.com.",
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "Georgia,serif", background: COLORS.sand, minHeight: "100vh", color: COLORS.ink }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: `1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.dusk, textDecoration: "none" }}>← Home</Link>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "1rem" }}>Legal</div>
        <h1 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "2rem" }}>Privacy Policy</h1>

        <div style={{ ...sans, fontSize: "0.8rem", color: COLORS.dusk, lineHeight: 1.7, background: COLORS.white, border: `1px solid ${COLORS.stone}`, padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
          <strong>Draft placeholder.</strong> This page has not been reviewed by a solicitor, and the bracketed fields (business name, address, retention period) need filling in. Given this form collects special category data (dietary and accessibility information), get this reviewed before relying on it.
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
