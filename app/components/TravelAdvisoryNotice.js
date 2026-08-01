"use client";
import { useState, useEffect } from "react";

const COLORS = { stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8" };
const sans = { fontFamily:"system-ui,sans-serif" };

function fmtDate(iso) {
  if (!iso) return null;
  try { return new Date(iso).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }); }
  catch { return null; }
}

// Surfaces the live UK government (FCDO) travel advice for a selected
// destination, rather than a hand-maintained "dangerous countries" list that
// would go stale immediately — always links through to the real, current
// page so nobody mistakes this for the full picture.
export default function TravelAdvisoryNotice({ country }) {
  const [advice, setAdvice] = useState(null);

  useEffect(() => {
    setAdvice(null);
    if (!country) return;
    let cancelled = false;
    fetch(`/api/travel-advice?country=${encodeURIComponent(country)}`)
      .then(res => res.json())
      .then(data => { if (!cancelled) setAdvice(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [country]);

  if (!advice?.available) return null;

  if (advice.level === "none") {
    return (
      <p style={{ ...sans, fontSize:"0.72rem", color:COLORS.stone, margin:"0.5rem 0 0" }}>
        No current FCDO travel warnings for {country}. <a href={advice.url} target="_blank" rel="noopener noreferrer" style={{ color:COLORS.dusk }}>Check the latest UK government advice ↗</a>
      </p>
    );
  }

  const severe = advice.level === "severe";
  return (
    <div style={{ marginTop:"0.6rem", border:`1px solid ${severe ? "#9B3A2A" : COLORS.gold}`, background: severe ? "#F7E9E6" : "#FBF3DF", padding:"0.75rem 0.9rem" }}>
      <div style={{ ...sans, fontSize:"0.78rem", fontWeight:600, color: severe ? "#9B3A2A" : COLORS.dusk, marginBottom:"0.3rem" }}>
        ⚠ UK Government travel warning for {country}
      </div>
      {advice.messages.map((m, i) => (
        <p key={i} style={{ ...sans, fontSize:"0.78rem", color:COLORS.dusk, lineHeight:1.6, margin:"0.15rem 0" }}>{m}</p>
      ))}
      <div style={{ ...sans, fontSize:"0.72rem", color:COLORS.dusk, marginTop:"0.35rem" }}>
        <a href={advice.url} target="_blank" rel="noopener noreferrer" style={{ color: severe ? "#9B3A2A" : COLORS.dusk, fontWeight:500 }}>Read the full FCDO advice ↗</a>
        {advice.updatedAt && <span style={{ color:COLORS.stone }}> · updated {fmtDate(advice.updatedAt)}</span>}
      </div>
    </div>
  );
}
