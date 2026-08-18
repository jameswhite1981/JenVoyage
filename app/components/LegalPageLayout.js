import Link from "next/link";
import Image from "next/image";
import Footer from "./Footer";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};

const sans = { fontFamily: "system-ui,sans-serif" };

const CONTACT_MAILTO = "mailto:jenvoyageyourway@gmail.com?subject=Enquiry%20from%20Jen%20Voyage%20website";

export default function LegalPageLayout({ eyebrow = "Legal", title, draftNotice, sections }) {
  return (
    <div style={{ fontFamily: "Georgia,serif", backgroundImage: `linear-gradient(rgba(242,237,228,0.88),rgba(242,237,228,0.88)),url('/map-bg.svg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", color: COLORS.ink }}>
      <div className="jv-nav" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 2rem", borderBottom:`1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>← Home</Link>
        <div className="jv-nav-links" style={{ display:"flex", gap:"2rem" }}>
          <Link href="/inspiration" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Inspiration</Link>
          <Link href="/about" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>About</Link>
          <Link href="/reviews" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Reviews</Link>
          <Link href="/faq" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>FAQ</Link>
          <a href={CONTACT_MAILTO} style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none", border:`1px solid ${COLORS.stone}`, padding:"0.4rem 0.9rem" }}>Contact</a>
        </div>
      </div>

      <div className="jv-page-header" style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem", borderBottom: `1px solid ${COLORS.stone}`, display:"flex", alignItems:"center", gap:"2rem" }}>
        <div className="jv-header-logo" style={{ width:120, height:120, borderRadius:"50%", overflow:"hidden", position:"relative", background:COLORS.sand, flexShrink:0, border:`1.5px solid ${COLORS.stone}` }}>
          <Image src="/logo.jpg" alt="Jen Voyage" width={200} height={200} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:200, height:200, objectFit:"cover", mixBlendMode:"multiply" }} />
        </div>
        <div>
          <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "0.75rem" }}>{eyebrow}</div>
          <h1 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1, margin: 0 }}>{title}</h1>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>
        {draftNotice && (
          <div style={{ ...sans, fontSize: "0.8rem", color: COLORS.dusk, lineHeight: 1.7, background: COLORS.white, border: `1px solid ${COLORS.stone}`, padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
            {draftNotice}
          </div>
        )}

        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom: "1.75rem" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 400, marginBottom: "0.5rem" }}>{s.title}</h2>
            <p style={{ ...sans, fontSize: "0.88rem", fontWeight: 300, color: COLORS.dusk, lineHeight: 1.75, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
