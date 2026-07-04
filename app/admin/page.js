import { listEnquiries } from "../../lib/storage.js";
import Link from "next/link";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };

const STATUS_BADGE = {
  pending:          { text:"Pending",           bg:"#EAE4DA", color:"#4A3F35" },
  generating:       { text:"Generating",        bg:"#EAE4DA", color:"#4A3F35" },
  ai_ready:         { text:"Ready to review",   bg:"#B8962E", color:"#FDFBF8" },
  wants_to_proceed: { text:"Wants to proceed!", bg:"#2F6B3A", color:"#FDFBF8" },
  published:        { text:"Published",         bg:"#1C1A17", color:"#FDFBF8" },
};

function fmtDate(s) {
  return new Date(s).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}

export default async function AdminDashboard() {
  const enquiries = await listEnquiries();

  const counts = { pending:0, generating:0, ai_ready:0, wants_to_proceed:0, published:0 };
  enquiries?.forEach(e => { if (counts[e.status] !== undefined) counts[e.status]++; });

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:"1.5rem", borderBottom:`1px solid ${C.stone}`, marginBottom:"2.5rem" }}>
          <div>
            <div style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold }}>Jen Voyage</div>
            <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.stone }}>Admin</div>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button style={{ ...sans, background:"none", border:"none", fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, cursor:"pointer" }}>Sign out</button>
          </form>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"1px", background:C.stone, border:`1px solid ${C.stone}`, marginBottom:"2.5rem" }}>
          {[["Pending",counts.pending],["Generating",counts.generating],["Awaiting review",counts.ai_ready],["Wants to proceed",counts.wants_to_proceed],["Published",counts.published]].map(([lbl,n]) => (
            <div key={lbl} style={{ background:C.white, padding:"1.25rem", textAlign:"center" }}>
              <div style={{ fontSize:"2rem", fontWeight:300 }}>{n}</div>
              <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, marginTop:"0.25rem" }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Enquiry table */}
        <h2 style={{ fontSize:"1.4rem", fontWeight:300, marginBottom:"1.25rem" }}>All enquiries</h2>
        {!enquiries?.length && <p style={{ ...sans, color:C.dusk }}>No enquiries yet.</p>}
        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {enquiries?.map(e => {
            const badge = STATUS_BADGE[e.status] || STATUS_BADGE.pending;
            return (
              <Link key={e.id} href={`/admin/enquiry/${e.id}`} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"0.75rem", background:C.white, border:`1px solid ${C.stone}`, padding:"1.1rem 1.5rem", textDecoration:"none", color:C.ink, transition:"border-color 0.15s" }}>
                <div>
                  <div style={{ fontSize:"1rem", fontWeight:400 }}>{e.first_name} {e.last_name || ""}</div>
                  <div style={{ ...sans, fontSize:"0.75rem", color:C.stone }}>{e.email}</div>
                </div>
                <div style={{ ...sans, fontSize:"0.88rem", color:C.dusk }}>{e.destination_name}</div>
                <div style={{ ...sans, fontSize:"0.75rem", color:C.stone }}>{fmtDate(e.created_at)}</div>
                <span style={{ ...sans, fontSize:"0.65rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", background:badge.bg, color:badge.color, padding:"0.3rem 0.7rem" }}>{badge.text}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
