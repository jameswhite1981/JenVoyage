"use client";
import { useState } from "react";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};
const sans = { fontFamily: "system-ui,sans-serif" };
const inp = { width:"100%", background:COLORS.white, border:`1.5px solid ${COLORS.stone}`, color:COLORS.ink, fontFamily:"system-ui", fontSize:"0.88rem", padding:"0.65rem 0.85rem", outline:"none", boxSizing:"border-box" };
const lbl = { ...sans, display:"block", fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:COLORS.dusk, marginBottom:"0.4rem" };

function StarPicker({ value, onChange }) {
  return (
    <div style={{ display:"flex", gap:"0.3rem" }}>
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n>1?"s":""}`}
          style={{ background:"none", border:"none", cursor:"pointer", padding:0, fontSize:"1.6rem", lineHeight:1, color: n<=value ? COLORS.gold : COLORS.stone }}
        >★</button>
      ))}
    </div>
  );
}

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [trip, setTrip] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !quote.trim()) { setError("Please fill in your name and review."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, trip, quote, rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
    } catch (e) { setError(e.message); }
    setSubmitting(false);
  };

  if (done) {
    return (
      <div style={{ textAlign:"center", padding:"2rem 1.5rem" }}>
        <p style={{ ...sans, fontSize:"0.92rem", fontWeight:300, color:COLORS.dusk }}>
          Thank you! Your review has been submitted and will appear here once it's been approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth:520, margin:"0 auto" }}>
      <div style={{ marginBottom:"1rem" }}>
        <label style={lbl}>Your name</label>
        <input style={inp} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sophie & Tom" />
      </div>
      <div style={{ marginBottom:"1rem" }}>
        <label style={lbl}>Trip (optional)</label>
        <input style={inp} value={trip} onChange={e=>setTrip(e.target.value)} placeholder="e.g. Tokyo & Kyoto, 12 nights" />
      </div>
      <div style={{ marginBottom:"1rem" }}>
        <label style={lbl}>Rating</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>
      <div style={{ marginBottom:"1.25rem" }}>
        <label style={lbl}>Your review</label>
        <textarea style={{ ...inp, minHeight:110, resize:"vertical" }} value={quote} onChange={e=>setQuote(e.target.value)} placeholder="Tell us about your trip…" />
      </div>
      {error && <p style={{ ...sans, fontSize:"0.8rem", color:"#9B3A2A", marginBottom:"1rem" }}>{error}</p>}
      <button type="submit" disabled={submitting} style={{ ...sans, background:COLORS.ink, color:COLORS.white, border:"none", fontSize:"0.82rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.95rem 2.25rem", cursor:"pointer" }}>
        {submitting ? "Submitting…" : "Submit review"}
      </button>
      <p style={{ ...sans, fontSize:"0.72rem", color:COLORS.stone, marginTop:"0.9rem" }}>
        Reviews are checked before appearing on the site.
      </p>
    </form>
  );
}
