"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };
const inp = { width:"100%", background:C.white, border:`1.5px solid ${C.stone}`, color:C.ink, fontFamily:"system-ui", fontSize:"0.88rem", padding:"0.65rem 0.85rem", outline:"none", boxSizing:"border-box" };
const lbl = { ...sans, display:"block", fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:C.dusk, marginBottom:"0.4rem" };
const smallBtn = { ...sans, background:"none", border:`1.5px solid ${C.stone}`, color:C.dusk, fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.4rem 0.8rem", cursor:"pointer" };
const removeBtn = { ...sans, background:"none", border:"none", color:"#9B3A2A", fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", cursor:"pointer", padding:"0.2rem 0" };
const groupBox = { border:`1px solid ${C.stone}`, padding:"1rem 1.25rem", marginBottom:"0.9rem", background:C.white };
const LINK_TYPES = ["Flight", "Hotel", "Other"];

function fmtDate(s) {
  return new Date(s).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

function emptyLink() { return { type: "Flight", label: "", url: "", price: "" }; }

export default function DealCheckEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [dealCheck, setDealCheck] = useState(null);
  const [links, setLinks] = useState([]);
  const [message, setMessage] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [perPersonCost, setPerPersonCost] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/admin/deal-checks/${id}`)
      .then(r => r.json())
      .then(data => {
        setDealCheck(data);
        setLinks(data.response_links?.length ? data.response_links : [emptyLink()]);
        setMessage(data.response_message || "");
        setTotalCost(data.response_total_cost || "");
        setPerPersonCost(data.response_per_person_cost || "");
      });
  }, [id]);

  const updateLink = (i, field, value) => setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  const addLink = () => setLinks(prev => [...prev, emptyLink()]);
  const removeLink = (i) => setLinks(prev => prev.filter((_, idx) => idx !== i));

  const cleanLinks = () => links.filter(l => l.url?.trim() || l.label?.trim());

  const handleSaveDraft = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch(`/api/admin/deal-checks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response_links: cleanLinks(), response_message: message, response_total_cost: totalCost, response_per_person_cost: perPersonCost }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMsg("Draft saved.");
    } catch (e) { setMsg(`Error: ${e.message}`); }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!confirm(`Send this Deal Check response to ${dealCheck.email}?`)) return;
    setPublishing(true); setMsg("");
    try {
      const res = await fetch(`/api/admin/deal-checks/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response_links: cleanLinks(), response_message: message, response_total_cost: totalCost, response_per_person_cost: perPersonCost }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publish failed");
      setMsg("Sent! The customer has been emailed a link to view it.");
      router.refresh();
      const refreshed = await fetch(`/api/admin/deal-checks/${id}`).then(r => r.json());
      setDealCheck(refreshed);
    } catch (e) { setMsg(`Error: ${e.message}`); }
    setPublishing(false);
  };

  if (!dealCheck) return <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:C.stone }}>Loading…</div>;

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <div style={{ maxWidth:820, margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem", paddingBottom:"1.5rem", borderBottom:`1px solid ${C.stone}`, marginBottom:"2rem" }}>
          <div>
            <Link href="/admin/deal-checks" style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, textDecoration:"none" }}>← All Deal Checks</Link>
            <h1 style={{ fontSize:"1.6rem", fontWeight:300, margin:"0.4rem 0 0.2rem" }}>{dealCheck.name}</h1>
            <div style={{ ...sans, fontSize:"0.78rem", color:C.stone }}>{dealCheck.email} · Submitted {fmtDate(dealCheck.created_at)}</div>
          </div>
          <div style={{ display:"flex", gap:"0.75rem", alignItems:"center", flexWrap:"wrap" }}>
            {msg && <span style={{ ...sans, fontSize:"0.78rem", color: msg.startsWith("Error") ? "#9B3A2A" : C.dusk }}>{msg}</span>}
            <button onClick={handleSaveDraft} disabled={saving} style={smallBtn}>{saving ? "Saving…" : "Save draft"}</button>
            <button onClick={handlePublish} disabled={publishing} style={{ ...sans, background:C.ink, color:C.white, border:"none", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.65rem 1.4rem", cursor:"pointer" }}>
              {publishing ? "Sending…" : dealCheck.published_at ? "Re-send →" : "Publish & send →"}
            </button>
          </div>
        </div>

        {dealCheck.published_at && (
          <div style={{ ...sans, background:"#e9f3ea", border:"1px solid #b7d6ba", color:"#2F6B3A", padding:"1rem 1.5rem", fontSize:"0.84rem", marginBottom:"1.5rem" }}>
            Sent to the customer on {fmtDate(dealCheck.published_at)}. View as they would see it: <a href={`/deal-check/view/${dealCheck.response_token}`} target="_blank" rel="noopener noreferrer" style={{ color:"#2F6B3A" }}>/deal-check/view/{dealCheck.response_token}</a>
          </div>
        )}

        {/* Original submission */}
        <div style={{ background:C.mist, border:`1px solid ${C.stone}`, padding:"1.25rem 1.5rem", marginBottom:"2rem" }}>
          <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.15em", textTransform:"uppercase", color:C.gold, marginBottom:"0.75rem" }}>
            What they submitted
          </div>
          {dealCheck.link && (
            <div style={{ marginBottom:"0.6rem" }}>
              <a href={dealCheck.link} target="_blank" rel="noopener noreferrer" style={{ ...sans, fontSize:"0.84rem", color:C.gold }}>{dealCheck.link}</a>
            </div>
          )}
          {dealCheck.description && (
            <p style={{ ...sans, fontSize:"0.88rem", color:C.ink, lineHeight:1.7, margin:0, whiteSpace:"pre-wrap" }}>{dealCheck.description}</p>
          )}
        </div>

        {/* Suggested alternatives */}
        <div style={{ ...sans, fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, margin:"0 0 1rem" }}>
          Suggested alternatives
        </div>
        {links.map((l, i) => (
          <div key={i} style={groupBox}>
            <div style={{ display:"grid", gridTemplateColumns:"110px 1fr 110px 40px", gap:"0.75rem", marginBottom:"0.75rem", alignItems:"end" }}>
              <div>
                <label style={lbl}>Type</label>
                <select style={{ ...inp, appearance:"none" }} value={l.type} onChange={e => updateLink(i, "type", e.target.value)}>
                  {LINK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Label</label>
                <input style={inp} value={l.label} onChange={e => updateLink(i, "label", e.target.value)} placeholder="e.g. Same hotel, £140 cheaper on Booking.com" />
              </div>
              <div>
                <label style={lbl}>Price</label>
                <input style={inp} value={l.price || ""} onChange={e => updateLink(i, "price", e.target.value)} placeholder="£XXX" />
              </div>
              <button onClick={() => removeLink(i)} style={{ ...removeBtn, justifySelf:"start" }}>✕</button>
            </div>
            <label style={lbl}>Link</label>
            <input style={inp} value={l.url} onChange={e => updateLink(i, "url", e.target.value)} placeholder="https://…" />
          </div>
        ))}
        <button onClick={addLink} style={{ ...smallBtn, marginBottom:"2rem" }}>+ Add alternative</button>

        {/* Cost summary */}
        <div style={{ ...sans, fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, margin:"0 0 1rem" }}>
          Cost summary
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2rem" }}>
          <div>
            <label style={lbl}>Total cost</label>
            <input style={inp} value={totalCost} onChange={e => setTotalCost(e.target.value)} placeholder="£XXX" />
          </div>
          <div>
            <label style={lbl}>Per person cost</label>
            <input style={inp} value={perPersonCost} onChange={e => setPerPersonCost(e.target.value)} placeholder="£XXX" />
          </div>
        </div>

        {/* Message to customer */}
        <div style={{ marginBottom:"1.5rem" }}>
          <label style={lbl}>Message to customer (your overall verdict)</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="e.g. This is a fair price for what's included, but I'd skip the airport transfer add-on — it's cheaper booked separately. See the alternative hotel link above for a better-located option at a similar price."
            style={{ width:"100%", minHeight:140, background:C.white, border:`1.5px solid ${C.stone}`, color:C.ink, fontFamily:"system-ui", fontSize:"0.85rem", padding:"0.75rem 0.9rem", boxSizing:"border-box", resize:"vertical" }}
          />
        </div>
      </div>
    </div>
  );
}
