import { getSession } from "../../lib/session.js";
import { db } from "../../lib/db.js";
import { redirect } from "next/navigation";
import Link from "next/link";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };

const STATUS_LABEL = {
  pending:    { text:"Received",          bg:"#EAE4DA", color:"#4A3F35" },
  generating: { text:"Being prepared",    bg:"#EAE4DA", color:"#4A3F35" },
  ai_ready:   { text:"Being reviewed",    bg:"#EAE4DA", color:"#4A3F35" },
  published:  { text:"Ready to view",     bg:"#B8962E", color:"#FDFBF8" },
};

function fmtDate(s) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}

function ItineraryView({ enquiry }) {
  const d = JSON.parse(enquiry.published_content);
  return (
    <div style={{ marginTop:"2.5rem" }}>
      <h2 style={{ fontSize:"clamp(1.6rem,3.5vw,2.6rem)", fontWeight:300, lineHeight:1.1, marginBottom:"0.5rem" }}>{d.title}</h2>
      <p style={{ ...sans, fontSize:"0.88rem", color:C.dusk, fontWeight:300, lineHeight:1.8, marginBottom:"2rem" }}>{d.overview}</p>

      {d.days?.map(day => (
        <div key={day.day} style={{ marginBottom:"1.75rem", paddingLeft:"1.25rem", borderLeft:`2px solid ${C.stone}`, position:"relative" }}>
          <div style={{ position:"absolute", left:-5, top:"0.4rem", width:8, height:8, background:C.gold, borderRadius:"50%" }} />
          <div style={{ ...sans, fontSize:"0.62rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, marginBottom:"0.2rem" }}>Day {day.day}</div>
          <div style={{ fontSize:"1.1rem", fontWeight:400, marginBottom:"0.4rem" }}>{day.title}</div>
          <div style={{ ...sans, fontSize:"0.84rem", color:C.dusk, fontWeight:300, lineHeight:1.75 }}>
            {day.morning   && <p><strong>Morning</strong> — {day.morning}</p>}
            {day.afternoon && <p><strong>Afternoon</strong> — {day.afternoon}</p>}
            {day.evening   && <p><strong>Evening</strong> — {day.evening}</p>}
          </div>
          {day.stay && <div style={{ ...sans, fontSize:"0.72rem", color:C.stone, fontStyle:"italic", marginTop:"0.4rem" }}>🛏️ {day.stay}</div>}
        </div>
      ))}

      {d.costSummary && (
        <div style={{ background:C.mist, border:`1px solid ${C.stone}`, padding:"1.5rem", marginTop:"2rem" }}>
          <h4 style={{ fontSize:"1rem", fontWeight:400, marginBottom:"0.75rem" }}>Cost summary</h4>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"0.5rem 1rem" }}>
            {[["✈️ Flights",d.costSummary.flights],["🛏️ Accommodation",d.costSummary.accommodation],["🎯 Excursions",d.costSummary.excursions],["👤 Total per person",d.costSummary.totalPerPerson]].map(([lbl,val]) => val && (
              <div key={lbl} style={{ display:"contents" }}>
                <div style={{ ...sans, fontSize:"0.78rem", fontWeight:500, color:C.dusk }}>{lbl}</div>
                <div style={{ ...sans, fontSize:"0.78rem", color:C.ink }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {d.practicalTips?.length > 0 && (
        <div style={{ marginTop:"1.5rem" }}>
          <h4 style={{ fontSize:"1rem", fontWeight:400, marginBottom:"0.5rem" }}>Good to know</h4>
          <ul style={{ listStyle:"none", padding:0 }}>
            {d.practicalTips.map((t,i) => <li key={i} style={{ ...sans, fontSize:"0.82rem", color:C.dusk, padding:"0.2rem 0" }}>— {t}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default async function PortalPage() {
  const session = await getSession();
  if (!session || session.role !== "user") redirect("/portal/login");

  const { data: enquiries } = await db
    .from("enquiries")
    .select("id, created_at, destination_name, status, published_content, published_at")
    .eq("email", session.email)
    .order("created_at", { ascending: false });

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

              {isReady && <ItineraryView enquiry={enquiry} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
