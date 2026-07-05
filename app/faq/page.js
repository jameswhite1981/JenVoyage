import Link from "next/link";
import Image from "next/image";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};

const sans = { fontFamily: "system-ui,sans-serif" };

const FAQS = [
  {
    q: "Why should I pay you to design my itinerary when I can just do it myself?",
    a: "You absolutely can do it yourself, but scrolling through hundreds of flights, reading endless hotel reviews and comparing activities takes hours. It can quickly get overwhelming and take the joy out of the build up. Think of Jen Voyage as your personal travel research team. For a one-off fee we do all the heavy lifting, price matching and scheduling to fit your exact budget and vibe. We save you time and stress, putting the fun back into your travel planning.",
  },
  {
    q: "Do I have to go with your specific suggestions?",
    a: "Not at all! This is your holiday and you are in total control. We provide you with a fully tailored itinerary alongside alternative options and direct booking links. If a specific hotel or activity doesn't quite call to you, you are completely free to swap it out or choose a back-up option. We give you the perfect blueprint, but you make the final calls.",
  },
  {
    q: "Do you book the hotels and flights for me?",
    a: "No, we don't take your money for bookings. We provide you with the exact links to the best priced flight, accommodation and activity sites. This keeps everything transparent and leaves you in full control of your final booking details.",
  },
  {
    q: "Can you help me make some tweaks?",
    a: "Yes, make use of your 72-hour window to request tweaks and adjustments to your original itinerary.",
  },
  {
    q: "Isn't this all just done using AI?",
    a: "Absolutely not. I'd be lying if I said that AI wasn't involved, and I'd also probably be a bit naive. Most of what you see pre-payment is AI generated. However, all that changes once I look into your request: accommodation, trips and flights are personally picked, by a real person!",
  },
];

const DIFFERENCES = [
  { icon: "📋", title: "Fully costed from the start", body: "Every itinerary includes estimated excursion costs, accommodation ranges, and a per-person total, so no surprises when you arrive." },
  { icon: "🗺️", title: "Geographically smart routing", body: "We plan around the map, not the brochure. Regions are grouped to minimise unnecessary travel days and maximise time in the places that matter." },
  { icon: "🤝", title: "One person, start to finish", body: "You deal with Jen directly, not a call centre, not a rotating team. Every question gets a personal answer from someone who knows your trip." },
  { icon: "🔍", title: "Only destinations she knows", body: "If Jen hasn't visited recently, she won't plan it. Every recommendation is based on first-hand experience, not a supplier catalogue." },
];

export default function FaqPage() {
  return (
    <div style={{ fontFamily: "Georgia,serif", backgroundImage: `linear-gradient(rgba(242,237,228,0.88),rgba(242,237,228,0.88)),url('/map-bg.svg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", color: COLORS.ink }}>

      {/* Minimal nav */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 2rem", borderBottom:`1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>← Home</Link>
        <div style={{ display:"flex", gap:"2rem" }}>
          <Link href="/inspiration" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Inspiration</Link>
          <Link href="/about" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>About</Link>
          <Link href="/reviews" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>Reviews</Link>
          <Link href="/faq" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.ink, textDecoration:"none", borderBottom:`1px solid ${COLORS.ink}`, paddingBottom:"1px" }}>FAQ</Link>
        </div>
      </div>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem", borderBottom: `1px solid ${COLORS.stone}`, display:"flex", alignItems:"flex-start", gap:"2rem" }}>
        <div style={{ width:200, height:200, borderRadius:"50%", overflow:"hidden", position:"relative", background:COLORS.sand, flexShrink:0 }}>
          <Image src="/logo.jpg" alt="Jen Voyage" width={340} height={340} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:340, height:340, objectFit:"cover", mixBlendMode:"multiply" }} />
        </div>
        <div>
          <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "1.25rem" }}>FAQ</div>
          <h1 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: 0, maxWidth: "18ch", color: "#1C3461" }}>
            Got a question?
          </h1>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "1.5rem 1.5rem", borderBottom: `1px solid ${COLORS.stone}` }}>
        {FAQS.map(({ q, a }, i) => (
          <details key={i} style={{ borderTop: i === 0 ? "none" : `1px solid ${COLORS.stone}`, padding: "1.25rem 0" }}>
            <summary style={{ ...sans, fontSize: "0.95rem", fontWeight: 500, color: COLORS.ink, cursor: "pointer", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              {q}
              <span style={{ fontSize: "1.2rem", color: COLORS.gold, flexShrink: 0 }}>+</span>
            </summary>
            <p style={{ ...sans, fontSize: "0.88rem", fontWeight: 300, color: COLORS.dusk, lineHeight: 1.8, margin: "1rem 0 0", maxWidth: "60ch" }}>{a}</p>
          </details>
        ))}
        <div style={{ borderTop: `1px solid ${COLORS.stone}` }} />
      </div>

      {/* The difference */}
      <div style={{ background: COLORS.mist, borderBottom: `1px solid ${COLORS.stone}`, padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "0.5rem" }}>The difference</div>
          <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 300, lineHeight: 1.15, marginBottom: "3rem", maxWidth: "22ch" }}>
            Why Jen Voyage, and not the others?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "2rem" }}>
            {DIFFERENCES.map((d, i) => (
              <div key={i} style={{ background: COLORS.white, border: `1px solid ${COLORS.stone}`, padding: "1.75rem" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>{d.icon}</div>
                <div style={{ ...sans, fontSize: "0.88rem", fontWeight: 500, color: COLORS.ink, marginBottom: "0.6rem" }}>{d.title}</div>
                <p style={{ ...sans, fontSize: "0.82rem", fontWeight: 300, color: COLORS.dusk, lineHeight: 1.75, margin: 0 }}>{d.body}</p>
              </div>
            ))}
          </div>
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
        <Link href="/" style={{ ...sans, background: COLORS.ink, color: COLORS.white, fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.95rem 2.25rem", textDecoration: "none", display: "inline-block" }}>
          Begin Planning
        </Link>
      </div>

    </div>
  );
}
