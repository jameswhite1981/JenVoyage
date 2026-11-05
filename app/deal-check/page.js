import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import DealCheckForm from "./DealCheckForm.js";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};

const sans = { fontFamily: "system-ui,sans-serif" };

const CONTACT_MAILTO = "mailto:jenvoyageyourway@gmail.com?subject=Enquiry%20from%20Jen%20Voyage%20website";

export const metadata = {
  title: "Deal Check",
  description: "Already been quoted a holiday deal elsewhere? Send it over and Jen will give you a free, honest read on whether it's actually good value.",
  alternates: { canonical: "/deal-check" },
};

export default function DealCheckPage() {
  return (
    <div style={{ fontFamily: "Georgia,serif", backgroundImage: `linear-gradient(rgba(242,237,228,0.88),rgba(242,237,228,0.88)),url('/map-bg.svg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", color: COLORS.ink }}>

      {/* Minimal nav */}
      <div className="jv-nav" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 2rem", borderBottom:`1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>← Home</Link>
        <div className="jv-nav-links" style={{ display:"flex", gap:"2rem" }}>
          <Link href="/inspiration" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Inspiration</Link>
          <Link href="/about" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>About</Link>
          <Link href="/reviews" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Reviews</Link>
          <Link href="/faq" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>FAQ</Link>
          <Link href="/deal-check" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.ink, textDecoration:"none", borderBottom:`1px solid ${COLORS.ink}`, paddingBottom:"1px" }}>Deal Check</Link>
          <a href={CONTACT_MAILTO} style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none", border:`1px solid ${COLORS.stone}`, padding:"0.4rem 0.9rem" }}>Contact</a>
        </div>
      </div>

      {/* Header */}
      <div className="jv-page-header" style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem", borderBottom: `1px solid ${COLORS.stone}`, display:"flex", alignItems:"flex-start", gap:"2rem" }}>
        <div className="jv-header-logo" style={{ width:200, height:200, borderRadius:"50%", overflow:"hidden", position:"relative", background:COLORS.sand, flexShrink:0 }}>
          <Image src="/logo.jpg" alt="Jen Voyage" width={200} height={200} style={{ objectFit:"contain", mixBlendMode:"multiply" }} />
        </div>
        <div>
          <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "1.25rem" }}>Free &amp; no obligation</div>
          <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 0, maxWidth: "18ch", color: "#1C3461" }}>
            Is your deal actually a deal?
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.5rem 1rem" }}>
        <p style={{ ...sans, fontSize: "0.95rem", fontWeight: 300, color: COLORS.dusk, lineHeight: 1.8, maxWidth: "62ch" }}>
          Already been quoted a holiday by another agent or travel site? Before you book, send it over. Jen will take an honest look — flights, accommodation, what&apos;s actually included — and tell you straight whether it&apos;s good value or whether you could do better. No pressure to book with us instead, just a second opinion from someone who does this for a living.
        </p>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
        <DealCheckForm />
      </div>

      <Footer />
    </div>
  );
}
