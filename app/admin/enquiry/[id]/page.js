"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { saveDraft, publishEnquiry } from "./actions.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };
const inp = { width:"100%", background:C.white, border:`1.5px solid ${C.stone}`, color:C.ink, fontFamily:"system-ui", fontSize:"0.88rem", padding:"0.65rem 0.85rem", outline:"none", boxSizing:"border-box", borderRadius:0 };
const ta  = { ...inp, resize:"vertical", lineHeight:1.7 };
const lbl = { ...sans, display:"block", fontSize:"0.72rem", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:C.dusk, marginBottom:"0.4rem" };

export default function EnquiryEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [enquiry, setEnquiry] = useState(null);
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("edit"); // edit | preview
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/admin/enquiry/${id}`)
      .then(r => r.json())
      .then(data => {
        setEnquiry(data);
        // Use published_content if it exists, otherwise fall back to ai_draft
        const raw = data.published_content || data.ai_draft || "";
        try { setDraft(JSON.parse(raw)); } catch { setDraft(null); }
      });
  }, [id]);

  const upd = (path, val) => setDraft(prev => {
    const next = structuredClone(prev);
    const keys = path.split(".");
    let cur = next;
    for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
    cur[keys[keys.length - 1]] = val;
    return next;
  });

  const updDay = (dayIdx, field, val) => setDraft(prev => {
    const next = structuredClone(prev);
    next.days[dayIdx][field] = val;
    return next;
  });

  const handleSave = async () => {
    setSaving(true); setMsg("");
    try {
      await saveDraft(id, JSON.stringify(draft));
      setMsg("Saved.");
    } catch (e) { setMsg(`Error: ${e.message}`); }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!confirm(`Publish this itinerary and email ${enquiry.email}?`)) return;
    setPublishing(true); setMsg("");
    try {
      await publishEnquiry(id, JSON.stringify(draft), enquiry.email, enquiry.first_name, enquiry.destination_name);
      setMsg("Published! Customer has been emailed.");
      router.refresh();
    } catch (e) { setMsg(`Error: ${e.message}`); }
    setPublishing(false);
  };

  if (!enquiry) return <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:C.stone }}>Loading…</div>;

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem", paddingBottom:"1.5rem", borderBottom:`1px solid ${C.stone}`, marginBottom:"2rem" }}>
          <div>
            <Link href="/admin" style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, textDecoration:"none" }}>← All enquiries</Link>
            <h1 style={{ fontSize:"1.6rem", fontWeight:300, margin:"0.4rem 0 0.2rem" }}>{enquiry.first_name} {enquiry.last_name || ""} — {enquiry.destination_name}</h1>
            <div style={{ ...sans, fontSize:"0.78rem", color:C.stone }}>{enquiry.email} · {enquiry.status}</div>
          </div>
          <div style={{ display:"flex", gap:"0.75rem", alignItems:"center", flexWrap:"wrap" }}>
            {msg && <span style={{ ...sans, fontSize:"0.78rem", color: msg.startsWith("Error") ? "#9B3A2A" : C.dusk }}>{msg}</span>}
            <button onClick={handleSave} disabled={saving || !draft} style={{ ...sans, background:"none", border:`1.5px solid ${C.stone}`, color:C.dusk, fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.6rem 1.2rem", cursor:"pointer" }}>
              {saving ? "Saving…" : "Save draft"}
            </button>
            <button onClick={handlePublish} disabled={publishing || !draft || enquiry.status === "published"} style={{ ...sans, background:C.ink, color:C.white, border:"none", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.65rem 1.4rem", cursor:"pointer", opacity: enquiry.status === "published" ? 0.5 : 1 }}>
              {publishing ? "Publishing…" : enquiry.status === "published" ? "Published ✓" : "Publish to customer →"}
            </button>
          </div>
        </div>

        {/* Customer brief summary */}
        {enquiry.brief && (
          <div style={{ background:C.mist, border:`1px solid ${C.stone}`, padding:"1.25rem 1.5rem", marginBottom:"2rem", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"1rem" }}>
            {[
              ["Dates", `${enquiry.brief.departDate || "—"} → ${enquiry.brief.returnDate || "—"}`],
              ["Party", `${enquiry.brief.adults} adults, ${enquiry.brief.children || 0} children`],
              ["Budget", `£${Number(enquiry.brief.budget) >= 10000 ? "10,000+" : Number(enquiry.brief.budget).toLocaleString()} pp`],
              ["Pace", enquiry.brief.pace || "—"],
              ["Accommodation", enquiry.brief.accom || "—"],
            ].map(([k,v]) => (
              <div key={k}>
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.gold }}>{k}</div>
                <div style={{ ...sans, fontSize:"0.84rem", color:C.ink, marginTop:"0.2rem" }}>{v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:"flex", gap:"0", borderBottom:`1px solid ${C.stone}`, marginBottom:"2rem" }}>
          {["edit","preview"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...sans, background:"none", border:"none", borderBottom: tab===t ? `2px solid ${C.gold}` : "2px solid transparent", fontSize:"0.78rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color: tab===t ? C.ink : C.dusk, padding:"0.75rem 1.25rem", cursor:"pointer", marginBottom:"-1px" }}>
              {t === "edit" ? "Edit" : "Preview"}
            </button>
          ))}
        </div>

        {!draft && (
          <div style={{ ...sans, background:"#fdf0ee", border:"1px solid #e8c4bb", color:"#9B3A2A", padding:"1rem 1.5rem", fontSize:"0.84rem" }}>
            {enquiry.ai_draft ? "AI draft could not be parsed." : "AI draft not yet generated. Status: " + enquiry.status}
          </div>
        )}

        {draft && tab === "edit" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem" }}>
            {/* Left: overview + cost summary */}
            <div>
              <div style={{ marginBottom:"1.5rem" }}>
                <label style={lbl}>Title</label>
                <input style={inp} value={draft.title || ""} onChange={e => upd("title", e.target.value)} />
              </div>
              <div style={{ marginBottom:"1.5rem" }}>
                <label style={lbl}>Overview</label>
                <textarea style={{ ...ta, minHeight:100 }} value={draft.overview || ""} onChange={e => upd("overview", e.target.value)} />
              </div>

              <div style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.gold, marginBottom:"0.75rem", paddingBottom:"0.35rem", borderBottom:`1px solid ${C.stone}` }}>Cost summary</div>
              {["flights","accommodation","excursions","totalPerPerson"].map(field => (
                <div key={field} style={{ marginBottom:"1rem" }}>
                  <label style={lbl}>{field === "totalPerPerson" ? "Total per person" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input style={inp} value={draft.costSummary?.[field] || ""} onChange={e => upd(`costSummary.${field}`, e.target.value)} />
                </div>
              ))}
            </div>

            {/* Right: per-day accommodation */}
            <div>
              <div style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.gold, marginBottom:"0.75rem", paddingBottom:"0.35rem", borderBottom:`1px solid ${C.stone}` }}>Accommodation per day</div>
              {draft.days?.map((day, i) => (
                <div key={i} style={{ marginBottom:"1rem" }}>
                  <label style={lbl}>Day {day.day} — {day.title}</label>
                  <input style={inp} value={day.stay || ""} onChange={e => updDay(i, "stay", e.target.value)} placeholder="Hotel name, area" />
                </div>
              ))}
            </div>
          </div>
        )}

        {draft && tab === "preview" && (
          <div style={{ maxWidth:700 }}>
            <h2 style={{ fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:300, marginBottom:"0.5rem" }}>{draft.title}</h2>
            <p style={{ ...sans, fontSize:"0.85rem", color:C.dusk, lineHeight:1.8, marginBottom:"2rem" }}>{draft.overview}</p>
            {draft.days?.map(day => (
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
            {draft.costSummary && (
              <div style={{ background:C.mist, border:`1px solid ${C.stone}`, padding:"1.5rem", marginTop:"2rem" }}>
                <h4 style={{ fontSize:"1rem", fontWeight:400, marginBottom:"0.75rem" }}>Cost summary</h4>
                {[["Flights",draft.costSummary.flights],["Accommodation",draft.costSummary.accommodation],["Excursions",draft.costSummary.excursions],["Total per person",draft.costSummary.totalPerPerson]].map(([l,v]) => v && (
                  <div key={l} style={{ display:"flex", gap:"1rem", marginBottom:"0.4rem" }}>
                    <span style={{ ...sans, fontSize:"0.78rem", fontWeight:500, color:C.dusk, width:160 }}>{l}</span>
                    <span style={{ ...sans, fontSize:"0.78rem", color:C.ink }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
