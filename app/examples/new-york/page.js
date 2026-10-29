import Link from "next/link";
import Footer from "../../components/Footer";
import ItineraryDisplay from "../../components/ItineraryDisplay.js";
import { getTemplate } from "../../../lib/storage.js";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};
const sans = { fontFamily: "system-ui,sans-serif" };
const CONTACT_MAILTO = "mailto:jenvoyageyourway@gmail.com?subject=Enquiry%20from%20Jen%20Voyage%20website";

// The saved template this sample links to — a real, fully fleshed-out
// itinerary shown exactly as a customer would see it in their own portal,
// not a screenshot. See app/admin/templates for how Jen manages these.
const TEMPLATE_ID = "926c37ad-c44b-41c8-9a21-83b078be0abc";

export const metadata = {
  title: "Sample Itinerary: New York",
  description: "A full, real example of a bespoke Jen Voyage itinerary — shown exactly as a customer sees it, flights, accommodation, day-by-day plan and all.",
  alternates: { canonical: "/examples/new-york" },
};

export default async function NewYorkExamplePage() {
  const template = await getTemplate(TEMPLATE_ID);

  return (
    <div style={{ fontFamily: "Georgia,serif", backgroundImage: `linear-gradient(rgba(242,237,228,0.88),rgba(242,237,228,0.88)),url('/map-bg.svg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", color: COLORS.ink }}>
      <div className="jv-nav" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 2rem", borderBottom:`1px solid ${COLORS.stone}` }}>
        <Link href="/faq" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>← FAQ</Link>
        <div className="jv-nav-links" style={{ display:"flex", gap:"2rem" }}>
          <Link href="/inspiration" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Inspiration</Link>
          <Link href="/about" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>About</Link>
          <Link href="/reviews" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Reviews</Link>
          <a href={CONTACT_MAILTO} style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none", border:`1px solid ${COLORS.stone}`, padding:"0.4rem 0.9rem" }}>Contact</a>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "3rem 1.5rem 2rem" }}>
        <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "0.75rem" }}>Sample itinerary</div>
        <p style={{ ...sans, fontSize: "0.88rem", fontWeight: 300, color: COLORS.dusk, lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: "60ch" }}>
          This is a real, complete Jen Voyage itinerary — shown exactly as a customer sees it once theirs is ready, not a mock-up. Click into any section below to explore it.
        </p>

        {template ? (
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.stone}`, padding: "2rem 2rem 1rem", marginBottom: "3rem" }}>
            <ItineraryDisplay itinerary={template.content} collapsible />
          </div>
        ) : (
          <p style={{ ...sans, color: COLORS.dusk }}>This sample isn&apos;t available right now.</p>
        )}
      </div>

      <div style={{ borderTop: `1px solid ${COLORS.stone}`, padding: "4rem 1.5rem", textAlign: "center" }}>
        <p style={{ ...sans, fontSize: "0.92rem", fontWeight: 300, color: COLORS.dusk, marginBottom: "1.5rem" }}>
          Ready to start your own adventure?
        </p>
        <Link href="/" style={{ ...sans, background: COLORS.ink, color: COLORS.white, fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.95rem 2.25rem", textDecoration: "none", display: "inline-block" }}>
          Begin Planning
        </Link>
      </div>

      <Footer />
    </div>
  );
}
