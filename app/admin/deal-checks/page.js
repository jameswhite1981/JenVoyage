"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };
const smallBtn = { ...sans, background:"none", border:`1.5px solid ${C.stone}`, color:C.dusk, fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.4rem 0.8rem", cursor:"pointer" };

function fmtDate(s) {
  return new Date(s).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}

function DealCheckRow({ dealCheck, onToggleHandled }) {
  const [busy, setBusy] = useState(false);
  const toggle = async () => { setBusy(true); await onToggleHandled(dealCheck.id, !dealCheck.handled_at); setBusy(false); };
  return (
    <div style={{ background:C.white, border:`1px solid ${dealCheck.handled_at ? C.stone : C.gold}`, padding:"1.1rem 1.5rem", marginBottom:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.75rem", marginBottom:"0.6rem" }}>
        <div>
          <div style={{ fontSize:"0.95rem", fontWeight:500 }}>{dealCheck.name}</div>
          <div style={{ ...sans, fontSize:"0.72rem", color:C.stone, marginTop:"0.2rem" }}>
            {dealCheck.email} · Submitted {fmtDate(dealCheck.created_at)}
            {dealCheck.handled_at && ` · Handled ${fmtDate(dealCheck.handled_at)}`}
          </div>
        </div>
        <button style={smallBtn} onClick={toggle} disabled={busy}>
          {busy ? "…" : dealCheck.handled_at ? "Mark unhandled" : "Mark handled"}
        </button>
      </div>
      {dealCheck.link && (
        <div style={{ marginBottom:"0.5rem" }}>
          <a href={dealCheck.link} target="_blank" rel="noopener noreferrer" style={{ ...sans, fontSize:"0.8rem", color:C.gold }}>{dealCheck.link}</a>
        </div>
      )}
      {dealCheck.description ? (
        <p style={{ fontSize:"0.9rem", fontWeight:300, lineHeight:1.7, margin:0, color:C.ink, whiteSpace:"pre-wrap" }}>{dealCheck.description}</p>
      ) : (
        <p style={{ ...sans, fontSize:"0.8rem", fontStyle:"italic", margin:0, color:C.stone }}>No description provided — see link above.</p>
      )}
    </div>
  );
}

export default function AdminDealChecksPage() {
  const [dealChecks, setDealChecks] = useState(null);

  const load = () => fetch("/api/admin/deal-checks").then(r => r.json()).then(setDealChecks);
  useEffect(() => { load(); }, []);

  const toggleHandled = async (id, handled) => {
    await fetch(`/api/admin/deal-checks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled }),
    });
    load();
  };

  if (!dealChecks) return <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:C.stone }}>Loading…</div>;

  const outstanding = dealChecks.filter(d => !d.handled_at);
  const handled = dealChecks.filter(d => d.handled_at);

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }}>
        <div style={{ paddingBottom:"1.5rem", borderBottom:`1px solid ${C.stone}`, marginBottom:"2rem" }}>
          <Link href="/admin" style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, textDecoration:"none" }}>← Dashboard</Link>
          <h1 style={{ fontSize:"1.6rem", fontWeight:300, margin:"0.4rem 0 0.2rem" }}>Deal Check</h1>
          <div style={{ ...sans, fontSize:"0.78rem", color:C.stone }}>{outstanding.length} outstanding · {handled.length} handled</div>
        </div>

        <div style={{ ...sans, fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, margin:"0 0 1rem" }}>
          Outstanding
        </div>
        {outstanding.length === 0 && <p style={{ ...sans, fontSize:"0.85rem", color:C.stone, marginBottom:"2rem" }}>Nothing waiting.</p>}
        {outstanding.map(d => <DealCheckRow key={d.id} dealCheck={d} onToggleHandled={toggleHandled} />)}

        <div style={{ ...sans, fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, margin:"2.5rem 0 1rem" }}>
          Handled
        </div>
        {handled.length === 0 && <p style={{ ...sans, fontSize:"0.85rem", color:C.stone }}>None yet.</p>}
        {handled.map(d => <DealCheckRow key={d.id} dealCheck={d} onToggleHandled={toggleHandled} />)}
      </div>
    </div>
  );
}
