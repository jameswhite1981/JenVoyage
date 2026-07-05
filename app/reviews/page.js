import Link from "next/link";
import Image from "next/image";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};

const sans = { fontFamily: "system-ui,sans-serif" };

const REVIEWS = [
  {
    quote: "Jen planned our honeymoon in Japan and it was absolutely faultless. Every detail had been thought through, and we didn't have to worry about a thing from the moment we landed.",
    name: "Sophie & Tom",
    trip: "Tokyo & Kyoto, 12 nights",
  },
  {
    quote: "I've used big travel agencies before and the difference is night and day. Jen actually listens, then builds something around you rather than fitting you into a template.",
    name: "Marcus H.",
    trip: "Peru & Machu Picchu, 14 nights",
  },
  {
    quote: "The Thailand itinerary had something for every member of the family: the kids loved the elephant sanctuary, we loved the cooking class in Chiang Mai. Genuinely magical.",
    name: "Claire W.",
    trip: "Thailand, family of four, 10 nights",
  },
];

export default function ReviewsPage() {
  return (
    <div style={{ fontFamily: "Georgia,serif", backgroundImage: `linear-gradient(rgba(242,237,228,0.88),rgba(242,237,228,0.88)),url('/map-bg.svg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", color: COLORS.ink }}>

      {/* Minimal nav */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 2rem", borderBottom:`1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>← Home</Link>
        <div style={{ display:"flex", gap:"2rem" }}>
          <Link href="/inspiration" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Inspiration</Link>
          <Link href="/about" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>About</Link>
          <Link href="/reviews" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.ink, textDecoration:"none", borderBottom:`1px solid ${COLORS.ink}`, paddingBottom:"1px" }}>Reviews</Link>
          <Link href="/faq" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>FAQ</Link>
        </div>
      </div>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem", borderBottom: `1px solid ${COLORS.stone}`, display:"flex", alignItems:"flex-start", gap:"2rem" }}>
        <div style={{ width:200, height:200, borderRadius:"50%", overflow:"hidden", position:"relative", background:COLORS.sand, flexShrink:0 }}>
          <Image src="/logo.jpg" alt="Jen Voyage" width={340} height={340} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:340, height:340, objectFit:"cover", mixBlendMode:"multiply" }} />
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
        {REVIEWS.map((r, i) => (
          <div key={i} style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: "2rem", marginBottom: "3.5rem" }}>
            <p style={{ fontSize: "1.15rem", fontWeight: 300, lineHeight: 1.9, color: COLORS.ink, margin: "0 0 1.25rem" }}>"{r.quote}"</p>
            <div style={{ ...sans, fontSize: "0.85rem", fontWeight: 500, color: COLORS.dusk }}>{r.name}</div>
            <div style={{ ...sans, fontSize: "0.75rem", color: COLORS.stone, marginTop: "0.25rem" }}>{r.trip}</div>
          </div>
        ))}
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

    </div>
  );
}
