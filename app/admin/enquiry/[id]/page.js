"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { saveDraft, publishEnquiry } from "./actions.js";
import { resendItineraryEmail } from "../../actions.js";
import { emptyItinerary, normalizeItinerary, parseItineraryJSON } from "../../../../lib/itinerary.js";
import ItineraryDisplay from "../../../components/ItineraryDisplay.js";
import ItineraryEditor from "../../ItineraryEditor.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };
const smallBtn = { ...sans, background:"none", border:`1.5px solid ${C.stone}`, color:C.dusk, fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.4rem 0.8rem", cursor:"pointer" };

export default function EnquiryEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [enquiry, setEnquiry] = useState(null);
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("edit"); // edit | preview
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState("");
  const [templates, setTemplates] = useState([]);
  const [savingTemplate, setSavingTemplate] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/enquiry/${id}`)
      .then(r => r.json())
      .then(data => {
        setEnquiry(data);
        const raw = data.published_content || data.ai_draft || "";
        try { setDraft(normalizeItinerary(parseItineraryJSON(raw))); } catch { setDraft(null); }
      });
    fetch("/api/admin/templates").then(r => r.json()).then(setTemplates).catch(() => {});
  }, [id]);

  const handleBlankTemplate = () => {
    if (draft && !confirm("Replace the current draft with a blank template? This discards everything currently entered (not yet saved unless you already clicked Save draft).")) return;
    setDraft(emptyItinerary());
    setMsg("");
  };

  const handleSaveAsTemplate = async () => {
    if (!draft) return;
    const suggested = `${enquiry.destination_name || ""}${draft.title ? " · " + draft.title : ""}`.trim() || "Untitled template";
    const name = prompt("Save this itinerary as a template named:", suggested);
    if (!name) return;
    setSavingTemplate(true); setMsg("");
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, destinationName: enquiry.destination_name, content: JSON.stringify(draft) }),
      });
      if (!res.ok) throw new Error("Save failed");
      const template = await res.json();
      setTemplates(prev => [template, ...prev]);
      setMsg("Saved as template.");
    } catch (e) { setMsg(`Error: ${e.message}`); }
    setSavingTemplate(false);
  };

  const handleLoadTemplate = async (templateId) => {
    if (!templateId) return;
    if (draft && !confirm("Replace the current draft with this template? This discards everything currently entered (not yet saved unless you already clicked Save draft).")) return;
    try {
      const res = await fetch(`/api/admin/templates/${templateId}`);
      if (!res.ok) throw new Error("Load failed");
      const template = await res.json();
      setDraft(normalizeItinerary(parseItineraryJSON(template.content)));
      setMsg("Template loaded.");
    } catch (e) { setMsg(`Error: ${e.message}`); }
  };

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

  const handleResend = async () => {
    if (!confirm(`Re-send the itinerary-ready email to ${enquiry.email}?`)) return;
    setResending(true); setMsg("");
    try {
      await resendItineraryEmail(enquiry.email, enquiry.first_name, enquiry.destination_name);
      setMsg("Email re-sent.");
    } catch (e) { setMsg(`Error: ${e.message}`); }
    setResending(false);
  };

  if (!enquiry) return <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:C.stone }}>Loading…</div>;

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem", paddingBottom:"1.5rem", borderBottom:`1px solid ${C.stone}`, marginBottom:"2rem" }}>
          <div>
            <Link href="/admin" style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, textDecoration:"none" }}>← All enquiries</Link>
            <h1 style={{ fontSize:"1.6rem", fontWeight:300, margin:"0.4rem 0 0.2rem" }}>{enquiry.first_name} {enquiry.last_name || ""} · {enquiry.destination_name}</h1>
            <div style={{ ...sans, fontSize:"0.78rem", color:C.stone }}>{enquiry.email}{enquiry.phone ? ` · ${enquiry.phone}` : ""} · {enquiry.status}</div>
          </div>
          <div style={{ display:"flex", gap:"0.75rem", alignItems:"center", flexWrap:"wrap" }}>
            {msg && <span style={{ ...sans, fontSize:"0.78rem", color: msg.startsWith("Error") ? "#9B3A2A" : C.dusk }}>{msg}</span>}
            <select
              value=""
              onChange={e => handleLoadTemplate(e.target.value)}
              disabled={enquiry.status === "published" || !templates.length}
              style={{ ...sans, background:C.white, border:`1.5px solid ${C.stone}`, color:C.dusk, fontSize:"0.72rem", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", padding:"0.55rem 0.7rem", cursor:"pointer" }}
            >
              <option value="">{templates.length ? "Load from template…" : "No templates saved"}</option>
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button onClick={handleBlankTemplate} disabled={enquiry.status === "published"} style={smallBtn}>
              Blank template
            </button>
            <button onClick={handleSaveAsTemplate} disabled={savingTemplate || !draft} style={smallBtn}>
              {savingTemplate ? "Saving…" : "Save as template"}
            </button>
            <button onClick={handleSave} disabled={saving || !draft} style={{ ...sans, background:"none", border:`1.5px solid ${C.stone}`, color:C.dusk, fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.6rem 1.2rem", cursor:"pointer" }}>
              {saving ? "Saving…" : "Save draft"}
            </button>
            <button onClick={handlePublish} disabled={publishing || !draft || enquiry.status === "published"} style={{ ...sans, background:C.ink, color:C.white, border:"none", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.65rem 1.4rem", cursor:"pointer", opacity: enquiry.status === "published" ? 0.5 : 1 }}>
              {publishing ? "Publishing…" : enquiry.status === "published" ? "Published ✓" : "Publish to customer →"}
            </button>
            {enquiry.status === "published" && (
              <button onClick={handleResend} disabled={resending} style={smallBtn}>
                {resending ? "Sending…" : "Re-send email"}
              </button>
            )}
          </div>
        </div>

        {enquiry.status === "wants_to_proceed" && (
          <div style={{ ...sans, background:"#e9f3ea", border:"1px solid #b7d6ba", color:"#2F6B3A", padding:"1rem 1.5rem", fontSize:"0.84rem", marginBottom:"1.5rem" }}>
            This customer has seen their preview and wants to proceed with personalisation & payment, reach out to take payment and start the full itinerary.
          </div>
        )}

        {enquiry.unsure_contact_method && (
          <div style={{ ...sans, background:"#fdf3e3", border:"1px solid #e8d3a0", color:"#8a6416", padding:"1rem 1.5rem", fontSize:"0.84rem", marginBottom:"1.5rem" }}>
            This customer wasn&apos;t sure about the process and asked Jen to reach out by <strong>{enquiry.unsure_contact_method}</strong>, using the phone/email shown above.
          </div>
        )}

        {/* Customer brief summary — everything the customer originally submitted.
            Admin-only reference: nothing in enquiry.brief is ever read by
            ItineraryDisplay, the customer portal or the PDF, so none of this
            reaches the customer-facing itinerary. */}
        {enquiry.brief && (
          <div style={{ background:C.mist, border:`1px solid ${C.stone}`, padding:"1.25rem 1.5rem", marginBottom:"2rem" }}>
            <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:C.gold, marginBottom:"1rem" }}>
              Original booking brief (admin reference only, not shown to customer)
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"1rem", marginBottom: (enquiry.brief.notes || enquiry.brief.accomNotes || [...(enquiry.brief.activities||[]),...(enquiry.brief.landmarks||[]),...(enquiry.brief.regions||[])].length) ? "1.25rem" : 0 }}>
              {[
                ["Dates", `${enquiry.brief.departDate || "N/A"} → ${enquiry.brief.returnDate || "N/A"}`],
                ["Departure", `${enquiry.brief.departCountry || "N/A"}${enquiry.brief.preferredAirport ? `, ${enquiry.brief.preferredAirport}` : ""}`],
                ["Party", `${enquiry.brief.adults} adults, ${enquiry.brief.children || 0} children${enquiry.brief.childrenAges ? ` (ages ${enquiry.brief.childrenAges})` : ""}`],
                ["Budget", `£${Number(enquiry.brief.budget) >= 10000 ? "10,000+" : Number(enquiry.brief.budget).toLocaleString()} pp`],
                ["Pace", enquiry.brief.pace || "N/A"],
                ["Accommodation", enquiry.brief.accom || "N/A"],
                ["Rooms / beds", `${enquiry.brief.rooms || "N/A"} room(s), ${enquiry.brief.beds || "N/A"} bed(s)`],
                ["Dietary", (enquiry.brief.dietary || []).join(", ") || "None specified"],
                ["Accessibility", enquiry.brief.accessibility || "None specified"],
              ].map(([k,v]) => (
                <div key={k}>
                  <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.gold }}>{k}</div>
                  <div style={{ ...sans, fontSize:"0.84rem", color:C.ink, marginTop:"0.2rem" }}>{v}</div>
                </div>
              ))}
            </div>

            {enquiry.brief.accomNotes && (
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.gold }}>Accommodation notes</div>
                <div style={{ ...sans, fontSize:"0.84rem", color:C.ink, marginTop:"0.2rem" }}>{enquiry.brief.accomNotes}</div>
              </div>
            )}

            {enquiry.brief.specificRegions && (
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.gold }}>Specific regions/states requested</div>
                <div style={{ ...sans, fontSize:"0.84rem", color:C.ink, marginTop:"0.2rem" }}>{enquiry.brief.specificRegions}</div>
              </div>
            )}

            {[...(enquiry.brief.activities||[]), ...(enquiry.brief.landmarks||[]), ...(enquiry.brief.regions||[])].length > 0 && (
              <div style={{ marginBottom: enquiry.brief.notes ? "1rem" : 0 }}>
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.gold, marginBottom:"0.4rem" }}>Selected interests</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem" }}>
                  {[...(enquiry.brief.activities||[]), ...(enquiry.brief.landmarks||[]), ...(enquiry.brief.regions||[])].map((item, i) => (
                    <span key={i} style={{ ...sans, fontSize:"0.75rem", color:C.ink, background:C.white, border:`1px solid ${C.stone}`, padding:"0.25rem 0.6rem" }}>{item}</span>
                  ))}
                </div>
              </div>
            )}

            {enquiry.brief.notes && (
              <div>
                <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.gold }}>Additional notes</div>
                <div style={{ ...sans, fontSize:"0.84rem", color:C.ink, marginTop:"0.2rem" }}>{enquiry.brief.notes}</div>
              </div>
            )}
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
          <div style={{ ...sans, background:"#fdf0ee", border:"1px solid #e8c4bb", color:"#9B3A2A", padding:"1rem 1.5rem", fontSize:"0.84rem", marginBottom:"1.5rem" }}>
            {enquiry.ai_draft ? "AI draft could not be parsed." : "AI draft not yet generated. Status: " + enquiry.status}
          </div>
        )}
        {draft && tab === "edit" && <ItineraryEditor draft={draft} setDraft={setDraft} />}

        {draft && tab === "preview" && (
          <div style={{ maxWidth:700 }}>
            <ItineraryDisplay itinerary={draft} collapsible />
          </div>
        )}
      </div>
    </div>
  );
}
