import Link from "next/link";
import Image from "next/image";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};

const sans = { fontFamily: "system-ui,sans-serif" };


export default function AboutPage() {
  return (
    <div style={{ fontFamily: "Georgia,serif", backgroundImage: `linear-gradient(rgba(242,237,228,0.88),rgba(242,237,228,0.88)),url('/map-bg.svg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", color: COLORS.ink }}>
      {/* Minimal nav */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 2rem", borderBottom:`1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>← Home</Link>
        <div style={{ display:"flex", gap:"2rem" }}>
          <Link href="/inspiration" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Inspiration</Link>
          <Link href="/about" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.ink, textDecoration:"none", borderBottom:`1px solid ${COLORS.ink}`, paddingBottom:"1px" }}>About</Link>
          <Link href="/reviews" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Reviews</Link>
          <Link href="/faq" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>FAQ</Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem", borderBottom: `1px solid ${COLORS.stone}`, display:"flex", alignItems:"flex-start", gap:"2rem" }}>
        <div style={{ width:200, height:200, borderRadius:"50%", overflow:"hidden", position:"relative", background:COLORS.sand, flexShrink:0 }}>
          <Image src="/logo.jpg" alt="Jen Voyage" width={340} height={340} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:340, height:340, objectFit:"cover", mixBlendMode:"multiply" }} />
        </div>
        <div>
          <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "1.25rem" }}>About Jen</div>
          <h1 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 0, maxWidth: "18ch", color: "#1C3461" }}>
            Travel planned by someone who actually travels
          </h1>
        </div>
      </div>

      {/* Story */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
          <p style={{ ...sans, fontSize: "0.92rem", fontWeight: 300, color: COLORS.ink, lineHeight: 1.6, margin: 0 }}>
            Hi, I'm Jen (no real surprises there) and I've always had a love for travel. When I was younger, I took time off work to immerse myself in new cultures, and discover how others live.
          </p>
          <p style={{ ...sans, fontSize: "0.92rem", fontWeight: 300, color: COLORS.ink, lineHeight: 1.6, margin: 0 }}>
            As I got older, I continued exploring with my now-husband (who thankfully loves to travel just as much as I do) and now I'm proud to be 'dragging' our daughter along, instilling that same love of adventure in her.
          </p>
          <p style={{ ...sans, fontSize: "0.92rem", fontWeight: 300, color: COLORS.ink, lineHeight: 1.6, margin: 0 }}>
            Whether it's a relaxing beach break or a jam-packed itinerary, I believe holidays are an absolute necessity. It doesn't matter if you're heading to Bognor or Bali, a mental reset is essential, no matter where you go or what you do.
          </p>
          <p style={{ ...sans, fontSize: "0.92rem", fontWeight: 300, color: COLORS.ink, lineHeight: 1.6, margin: 0 }}>
            I certainly haven't been everywhere in the world, but I'd love to help you get to where you're going. I absolutely love researching new countries and cities, and I always learn something new along the way!
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
        <h3 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 300, lineHeight: 1.2, marginBottom: "1rem" }}>
          Ready to start planning?
        </h3>
        <p style={{ ...sans, fontSize: "0.9rem", fontWeight: 300, color: COLORS.dusk, lineHeight: 1.7, marginBottom: "2rem" }}>
          Tell us where you want to go. We'll take it from there.
        </p>
        <Link href="/" style={{ fontFamily:"system-ui,sans-serif", background: COLORS.ink, color: COLORS.white, border: "none", fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.95rem 2.25rem", textDecoration: "none", display: "inline-block" }}>
          Begin Planning
        </Link>
      </div>
    </div>
  );
}
