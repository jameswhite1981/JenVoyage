import Link from "next/link";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", white: "#FDFBF8",
};

const sans = { fontFamily: "system-ui,sans-serif" };

const SECTIONS = [
  {
    title: "1. What are cookies",
    body: "Cookies are small text files stored on your device when you visit a website, used to remember information between requests.",
  },
  {
    title: "2. Cookies we use",
    body: "We only use strictly necessary cookies that keep you signed in: one for the customer portal (jv_session) and a separate one for the admin area (jv_admin_session). Both are deleted when you sign out or expire automatically after 30 days. Without these, you wouldn't be able to stay logged in to view your itinerary.",
  },
  {
    title: "3. What we don't use",
    body: "We do not use analytics, advertising, or tracking cookies of any kind, and no data about your visit is shared with third parties for marketing purposes.",
  },
  {
    title: "4. Consent",
    body: "Because we only use strictly necessary cookies, UK law doesn't require us to show a cookie consent banner — these cookies are essential to the service you've asked for (staying logged in). If that ever changes (for example, if we add analytics in future), we'll update this policy and add a consent banner.",
  },
  {
    title: "5. Contact",
    body: "Questions about this policy can be sent to jen@jenvoyage.com.",
  },
];

export default function CookiesPage() {
  return (
    <div style={{ fontFamily: "Georgia,serif", background: COLORS.sand, minHeight: "100vh", color: COLORS.ink }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: `1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.dusk, textDecoration: "none" }}>← Home</Link>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
        <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "1rem" }}>Legal</div>
        <h1 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "2rem" }}>Cookie Policy</h1>

        <div style={{ ...sans, fontSize: "0.8rem", color: COLORS.dusk, lineHeight: 1.7, background: COLORS.white, border: `1px solid ${COLORS.stone}`, padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
          <strong>Draft placeholder.</strong> This reflects what the site's code actually does today (only essential login cookies, no tracking). If analytics or marketing tools are added later, this page and the consent requirements will need revisiting — have a solicitor confirm before relying on it.
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
