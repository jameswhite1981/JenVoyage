"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { emptyItinerary } from "../../../../lib/itinerary.js";
import ItineraryEditor from "../../ItineraryEditor.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };
const inp = { width:"100%", background:C.white, border:`1.5px solid ${C.stone}`, color:C.ink, fontFamily:"system-ui", fontSize:"0.88rem", padding:"0.65rem 0.85rem", outline:"none", boxSizing:"border-box", borderRadius:0 };
const lbl = { ...sans, display:"block", fontSize:"0.72rem", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:C.dusk, marginBottom:"0.4rem" };

const AUTOSAVE_INTERVAL = 10 * 60 * 1000;

async function persistTemplate({ id, name, destinationName, draft }) {
  const res = await fetch(id ? `/api/admin/templates/${id}` : "/api/admin/templates", {
    method: id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, destinationName, content: JSON.stringify(draft) }),
  });
  if (!res.ok) throw new Error("Save failed");
  return res.json();
}

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [draft, setDraft] = useState(emptyItinerary());
  const [templateId, setTemplateId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [lastSaved, setLastSaved] = useState(null);

  // Always holds the latest values so the autosave interval (set up once on
  // mount, below) doesn't need to be torn down and recreated on every
  // keystroke just to see fresh state.
  const latest = useRef({});
  latest.current = { name, destinationName, draft, templateId };

  // Auto-save every 10 minutes so an in-progress template isn't lost. Skips
  // silently if no name has been given yet (nothing to save under), and
  // retries on the next tick if a save fails rather than surfacing an error.
  useEffect(() => {
    const interval = setInterval(async () => {
      const { name, destinationName, draft, templateId } = latest.current;
      if (!name.trim()) return;
      try {
        const template = await persistTemplate({ id: templateId, name, destinationName, draft });
        if (!templateId) setTemplateId(template.id);
        setLastSaved(new Date());
      } catch {}
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const handleSave = async () => {
    if (!name.trim()) { setMsg("Error: give the template a name first."); return; }
    setSaving(true); setMsg("");
    try {
      const template = await persistTemplate({ id: templateId, name, destinationName, draft });
      if (!templateId) setTemplateId(template.id);
      router.push("/admin/templates");
    } catch (e) { setMsg(`Error: ${e.message}`); setSaving(false); }
  };

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem", paddingBottom:"1.5rem", borderBottom:`1px solid ${C.stone}`, marginBottom:"2rem" }}>
          <div>
            <Link href="/admin/templates" style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, textDecoration:"none" }}>← Templates</Link>
            <h1 style={{ fontSize:"1.6rem", fontWeight:300, margin:"0.4rem 0 0.2rem" }}>Create new template</h1>
          </div>
          <div style={{ display:"flex", gap:"0.75rem", alignItems:"center", flexWrap:"wrap" }}>
            {lastSaved && !msg && (
              <span style={{ ...sans, fontSize:"0.72rem", color:C.stone }}>
                Auto-saved at {lastSaved.toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" })}
              </span>
            )}
            {msg && <span style={{ ...sans, fontSize:"0.78rem", color: msg.startsWith("Error") ? "#9B3A2A" : C.dusk }}>{msg}</span>}
            <button onClick={handleSave} disabled={saving} style={{ ...sans, background:C.ink, color:C.white, border:"none", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.65rem 1.4rem", cursor:"pointer" }}>
              {saving ? "Saving…" : "Save template"}
            </button>
          </div>
        </div>

        {/* Template name / destination */}
        <div style={{ background:C.mist, border:`1px solid ${C.stone}`, padding:"1.25rem 1.5rem", marginBottom:"2rem", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1rem" }}>
          <div>
            <label style={lbl}>Template name</label>
            <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Thailand: Islands, Jungle & Old City" />
          </div>
          <div>
            <label style={lbl}>Destination (optional)</label>
            <input style={inp} value={destinationName} onChange={e => setDestinationName(e.target.value)} placeholder="e.g. Thailand" />
          </div>
        </div>

        <ItineraryEditor draft={draft} setDraft={setDraft} />
      </div>
    </div>
  );
}
