import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import ReviewForm from "./ReviewForm.js";
import { listApprovedReviews } from "../../lib/storage.js";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};

const sans = { fontFamily: "system-ui,sans-serif" };

const CONTACT_MAILTO = "mailto:jenvoyageyourway@gmail.com?subject=Enquiry%20from%20Jen%20Voyage%20website";

// Shown live approved customer reviews behind auth-free but DB-backed
// content — never statically cached, or a newly approved review wouldn't
// appear until the next deploy.
export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const REVIEWS = await listApprovedReviews();
  return (
    <div style={{ fontFamily: "Georgia,serif", backgroundImage: `linear-gradient(rgba(242,237,228,0.88),rgba(242,237,228,0.88)),url('/map-bg.svg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", color: COLORS.ink }}>

      {/* Minimal nav */}
      <div className="jv-nav" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 2rem", borderBottom:`1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>← Home</Link>
        <div className="jv-nav-links" style={{ display:"flex", gap:"2rem" }}>
          <Link href="/inspiration" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Inspiration</Link>
          <Link href="/about" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>About</Link>
          <Link href="/reviews" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.ink, textDecoration:"none", borderBottom:`1px solid ${COLORS.ink}`, paddingBottom:"1px" }}>Reviews</Link>
          <Link href="/faq" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>FAQ</Link>
          <a href={CONTACT_MAILTO} style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none", border:`1px solid ${COLORS.stone}`, padding:"0.4rem 0.9rem" }}>Contact</a>
        </div>
      </div>

      {/* Header */}
      <div className="jv-page-header" style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem", borderBottom: `1px solid ${COLORS.stone}`, display:"flex", alignItems:"flex-start", gap:"2rem" }}>
        <div className="jv-header-logo" style={{ width:200, height:200, borderRadius:"50%", overflow:"hidden", position:"relative", background:COLORS.sand, flexShrink:0 }}>
          <Image src="/logo.jpg" alt="Jen Voyage" width={200} height={200} style={{ objectFit:"contain", mixBlendMode:"multiply" }} />
        </div>
        <div>
          <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "1.25rem" }}>Reviews</div>
          <h1 style={{ fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 0, maxWidth: "18ch", color: "#1C3461" }}>
            What our travellers say
          </h1>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
        {REVIEWS.length === 0 && (
          <p style={{ ...sans, fontSize: "0.9rem", fontWeight: 300, color: COLORS.dusk, textAlign: "center" }}>
            Be the first to leave a review below.
          </p>
        )}
        {REVIEWS.map((r) => (
          <div key={r.id} style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: "2rem", marginBottom: "3.5rem" }}>
            <div style={{ color: COLORS.gold, letterSpacing: "2px", marginBottom: "0.6rem" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
            <p style={{ fontSize: "1.15rem", fontWeight: 300, lineHeight: 1.9, color: COLORS.ink, margin: "0 0 1.25rem" }}>"{r.quote}"</p>
            <div style={{ ...sans, fontSize: "0.85rem", fontWeight: 500, color: COLORS.dusk }}>{r.name}</div>
            {r.trip && <div style={{ ...sans, fontSize: "0.75rem", color: COLORS.stone, marginTop: "0.25rem" }}>{r.trip}</div>}
          </div>
        ))}
      </div>

      {/* Leave a review */}
      <div style={{ borderTop: `1px solid ${COLORS.stone}`, padding: "4rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "0.75rem" }}>Travelled with us?</div>
          <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 300, color: "#1C3461" }}>Leave a review</h2>
        </div>
        <ReviewForm />
      </div>

      {/* CTA */}
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
