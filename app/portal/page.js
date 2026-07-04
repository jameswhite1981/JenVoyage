import { getSession } from "../../lib/session.js";
import { listEnquiriesByEmail } from "../../lib/storage.js";
import { redirect } from "next/navigation";
import Link from "next/link";
import ItineraryDisplay from "../components/ItineraryDisplay.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };

const STATUS_LABEL = {
  pending:          { text:"Received",          bg:"#EAE4DA", color:"#4A3F35" },
  generating:       { text:"Being prepared",    bg:"#EAE4DA", color:"#4A3F35" },
  ai_ready:         { text:"Being reviewed",    bg:"#EAE4DA", color:"#4A3F35" },
  wants_to_proceed: { text:"Awaiting payment",  bg:"#EAE4DA", color:"#4A3F35" },
  published:        { text:"Ready to view",     bg:"#B8962E", color:"#FDFBF8" },
};

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}

export default async function PortalPage() {
  const session = await getSession();
  if (!session || session.role !== "user") redirect("/portal/login");

  const enquiries = await listEnquiriesByEmail(session.email);

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <div style={{ maxWidth:860, margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:"1.5rem", borderBottom:`1px solid ${C.stone}`, marginBottom:"2.5rem" }}>
          <Link href="/" style={{ ...sans, fontSize:"0.85rem", letterSpacing:"0.35em", textTransform:"uppercase", color:C.gold, textDecoration:"none" }}>Jen Voyage</Link>
          <form action="/api/auth/logout" method="POST">
            <button style={{ ...sans, background:"none", border:"none", fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, cursor:"pointer" }}>Sign out</button>
          </form>
        </div>

        <h1 style={{ fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:300, lineHeight:1.1, marginBottom:"0.5rem" }}>Your trips</h1>
        <p style={{ ...sans, fontSize:"0.88rem", color:C.dusk, fontWeight:300, marginBottom:"2.5rem" }}>{session.email}</p>

        {!enquiries?.length && (
          <p style={{ ...sans, color:C.dusk }}>No enquiries found. <Link href="/" style={{ color:C.gold }}>Start planning</Link></p>
        )}

        {enquiries?.map(enquiry => {
          const badge = STATUS_LABEL[enquiry.status] || STATUS_LABEL.pending;
          const isReady = enquiry.status === "published" && enquiry.published_content;
          return (
            <div key={enquiry.id} style={{ border:`1px solid ${C.stone}`, background:C.white, marginBottom:"1.5rem", padding:"1.75rem" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.75rem", marginBottom:"1rem" }}>
                <div>
                  <h3 style={{ fontSize:"1.4rem", fontWeight:400, margin:0 }}>{enquiry.destination_name}</h3>
                  <div style={{ ...sans, fontSize:"0.75rem", color:C.stone, marginTop:"0.25rem" }}>Submitted {fmtDate(enquiry.created_at)}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                  <span style={{ ...sans, fontSize:"0.65rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", background:badge.bg, color:badge.color, padding:"0.3rem 0.7rem" }}>{badge.text}</span>
                  {isReady && (
                    <a href={`/api/portal/download/${enquiry.id}`} style={{ ...sans, background:C.ink, color:C.white, fontSize:"0.72rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.5rem 1rem", textDecoration:"none" }}>
                      Download PDF
                    </a>
                  )}
                </div>
              </div>

              {!isReady && (
                <p style={{ ...sans, fontSize:"0.85rem", color:C.dusk, fontWeight:300, lineHeight:1.75, margin:0 }}>
                  {enquiry.status === "published"
                    ? "Your itinerary is being finalised."
                    : "Your bespoke itinerary is being prepared. You'll receive an email as soon as it's ready."}
                </p>
              )}

              {isReady && (
                <div style={{ marginTop:"2.5rem" }}>
                  <ItineraryDisplay itinerary={enquiry.published_content} collapsible defaultOpen />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
