import Link from "next/link";
import Image from "next/image";
import Footer from "../../../components/Footer";
import { getDealCheckByToken } from "../../../../lib/storage.js";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};
const sans = { fontFamily: "system-ui,sans-serif" };

// Fetched live, not cached — a token is only reachable once Jen publishes a
// response, and should reflect edits made after a link's already been sent.
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Your Deal Check results", robots: { index: false, follow: false } };
}

export default async function DealCheckViewPage({ params }) {
  const { token } = await params;
  const dealCheck = await getDealCheckByToken(token);

  return (
    <div style={{ fontFamily: "Georgia,serif", backgroundImage: `linear-gradient(rgba(242,237,228,0.88),rgba(242,237,228,0.88)),url('/map-bg.svg')`, backgroundSize: "cover", backgroundAttachment: "fixed", minHeight: "100vh", color: COLORS.ink }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"1.5rem 2rem", borderBottom:`1px solid ${COLORS.stone}` }}>
        <Link href="/" style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.dusk, textDecoration:"none" }}>← Home</Link>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 1.5rem 2rem" }}>
        <div style={{ width:120, height:120, borderRadius:"50%", overflow:"hidden", position:"relative", background:COLORS.sand, margin:"0 auto 2rem" }}>
          <Image src="/logo.jpg" alt="Jen Voyage" width={120} height={120} style={{ objectFit:"contain", mixBlendMode:"multiply" }} />
        </div>

        {!dealCheck ? (
          <div style={{ textAlign:"center" }}>
            <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 300, marginBottom: "1rem" }}>Not found</h1>
            <p style={{ ...sans, fontSize: "0.9rem", color: COLORS.dusk, lineHeight: 1.8 }}>
              This link isn&apos;t valid, or your Deal Check hasn&apos;t been published yet. Get in touch if you think this is a mistake.
            </p>
          </div>
        ) : (
          <>
            <div style={{ ...sans, fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "0.75rem", textAlign:"center" }}>Deal Check</div>
            <h1 style={{ fontSize: "clamp(1.8rem,4.5vw,2.6rem)", fontWeight: 300, lineHeight: 1.15, marginBottom: "2rem", textAlign:"center", color:"#1C3461" }}>
              Hi {dealCheck.name}, here&apos;s what I found
            </h1>

            {dealCheck.response_message && (
              <div style={{ background: COLORS.white, borderLeft: `3px solid ${COLORS.gold}`, padding: "1.25rem 1.5rem", marginBottom: "2rem", fontSize: "0.95rem", lineHeight: 1.8, color: COLORS.dusk, whiteSpace: "pre-wrap" }}>
                {dealCheck.response_message}
              </div>
            )}

            {dealCheck.response_links?.length > 0 && (
              <div style={{ marginBottom: "2.5rem" }}>
                <div style={{ ...sans, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "1rem" }}>
                  Alternatives worth a look
                </div>
                {dealCheck.response_links.map((l, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:"1rem", background: COLORS.white, border:`1px solid ${COLORS.stone}`, padding:"1rem 1.25rem", marginBottom:"0.75rem" }}>
                    <div>
                      <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:COLORS.gold, marginBottom:"0.25rem" }}>{l.type}</div>
                      <div style={{ ...sans, fontSize:"0.88rem", color:COLORS.ink }}>{l.label}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"1rem", flexShrink:0 }}>
                      {l.price && <div style={{ ...sans, fontSize:"0.88rem", fontWeight:500, color:COLORS.ink, whiteSpace:"nowrap" }}>{l.price}</div>}
                      {l.url && (
                        <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ ...sans, fontSize:"0.72rem", fontWeight:500, color:COLORS.gold, textDecoration:"none", whiteSpace:"nowrap" }}>
                          View →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(dealCheck.response_total_cost || dealCheck.response_per_person_cost) && (
              <div style={{ background: COLORS.mist, border:`1px solid ${COLORS.stone}`, padding: "1.25rem 1.5rem", marginBottom: "2.5rem" }}>
                <div style={{ ...sans, fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.gold, marginBottom: "0.75rem" }}>
                  Cost summary
                </div>
                {dealCheck.response_total_cost && (
                  <div style={{ display:"flex", justifyContent:"space-between", ...sans, fontSize:"0.88rem", color:COLORS.ink, marginBottom:"0.4rem" }}>
                    <span>Total cost</span>
                    <strong>{dealCheck.response_total_cost}</strong>
                  </div>
                )}
                {dealCheck.response_per_person_cost && (
                  <div style={{ display:"flex", justifyContent:"space-between", ...sans, fontSize:"0.88rem", color:COLORS.ink }}>
                    <span>Per person</span>
                    <strong>{dealCheck.response_per_person_cost}</strong>
                  </div>
                )}
              </div>
            )}

            <div style={{ textAlign:"center", borderTop:`1px solid ${COLORS.stone}`, paddingTop:"2rem" }}>
              <p style={{ ...sans, fontSize: "0.85rem", fontWeight: 300, color: COLORS.dusk, marginBottom: "1.5rem" }}>
                Thinking of a bespoke itinerary instead?
              </p>
              <Link href="/" style={{ ...sans, background: COLORS.ink, color: COLORS.white, fontSize: "0.82rem", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.95rem 2.25rem", textDecoration: "none", display: "inline-block" }}>
                Begin Planning
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
