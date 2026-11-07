"use client";
import { useState } from "react";

const COLORS = {
  sand: "#F2EDE4", stone: "#C8BFB0", ink: "#1C1A17", dusk: "#4A3F35",
  gold: "#B8962E", mist: "#EAE4DA", white: "#FDFBF8",
};
const sans = { fontFamily: "system-ui,sans-serif" };
const inp = { width:"100%", background:COLORS.white, border:`1.5px solid ${COLORS.stone}`, color:COLORS.ink, fontFamily:"system-ui", fontSize:"0.88rem", padding:"0.65rem 0.85rem", outline:"none", boxSizing:"border-box" };
const lbl = { ...sans, display:"block", fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", color:COLORS.dusk, marginBottom:"0.4rem" };

export default function DealCheckForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [adults, setAdults] = useState("2");
  const [childrenUnder16, setChildrenUnder16] = useState("0");
  const [transferIncluded, setTransferIncluded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }
    if (!description.trim() && !link.trim()) {
      setError("Please add a description or a link to the deal.");
      return;
    }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/deal-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, description, link,
          totalCost, adults, childrenUnder16, transferIncluded,
        }),
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
          Thanks, {name}! Jen will take a look and get back to you at {email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth:560, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        <div>
          <label style={lbl}>Your name</label>
          <input style={inp} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sophie" />
        </div>
        <div>
          <label style={lbl}>Email</label>
          <input type="email" style={inp} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
      </div>
      <div style={{ marginBottom:"1rem" }}>
        <label style={lbl}>Link to the deal (optional)</label>
        <input style={inp} value={link} onChange={e=>setLink(e.target.value)} placeholder="https://…" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1rem", marginBottom:"1rem" }}>
        <div>
          <label style={lbl}>Total cost quoted</label>
          <input style={inp} value={totalCost} onChange={e=>setTotalCost(e.target.value)} placeholder="£XXX" />
        </div>
        <div>
          <label style={lbl}>Adults</label>
          <input type="number" min="0" style={inp} value={adults} onChange={e=>setAdults(e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Children under 16</label>
          <input type="number" min="0" style={inp} value={childrenUnder16} onChange={e=>setChildrenUnder16(e.target.value)} />
        </div>
      </div>
      <label style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem", cursor:"pointer" }}>
        <input type="checkbox" checked={transferIncluded} onChange={e=>setTransferIncluded(e.target.checked)} />
        <span style={{ ...sans, fontSize:"0.82rem", color:COLORS.dusk }}>Transfer included in the quote</span>
      </label>
      <div style={{ marginBottom:"1.25rem" }}>
        <label style={lbl}>Tell us about the deal (optional if you&apos;ve added a link above)</label>
        <textarea
          style={{ ...inp, minHeight:140, resize:"vertical" }}
          value={description}
          onChange={e=>setDescription(e.target.value)}
          placeholder="Where, when, what's included, and what you're being quoted — the more detail, the better the check."
        />
      </div>
      {error && <p style={{ ...sans, fontSize:"0.8rem", color:"#9B3A2A", marginBottom:"1rem" }}>{error}</p>}
      <button type="submit" disabled={submitting} style={{ ...sans, background:COLORS.ink, color:COLORS.white, border:"none", fontSize:"0.82rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.95rem 2.25rem", cursor:"pointer" }}>
        {submitting ? "Submitting…" : "Check my deal"}
      </button>
      <p style={{ ...sans, fontSize:"0.72rem", color:COLORS.stone, marginTop:"0.9rem" }}>
        Free, no obligation. Jen reviews each request personally and replies by email.
      </p>
    </form>
  );
}
