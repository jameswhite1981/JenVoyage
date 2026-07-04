"use client";
import { useState } from "react";
import Link from "next/link";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };

export default function PortalLogin({ searchParams }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [err, setErr] = useState("");

  const send = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/portal/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Something went wrong."); setStatus("error"); return; }
      setStatus("sent");
    } catch {
      setErr("Network error. Please try again."); setStatus("error");
    }
  };

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"2rem" }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <Link href="/" style={{ ...sans, fontSize:"0.85rem", letterSpacing:"0.35em", textTransform:"uppercase", color:C.gold, textDecoration:"none" }}>Jen Voyage</Link>
        <div style={{ width:40, height:1, background:C.gold, margin:"0.5rem 0 2.5rem" }} />

        {status === "sent" ? (
          <>
            <h1 style={{ fontSize:"2rem", fontWeight:300, marginBottom:"0.75rem" }}>Check your inbox.</h1>
            <p style={{ ...sans, fontSize:"0.92rem", color:C.dusk, lineHeight:1.75 }}>
              We've sent a login link to <strong>{email}</strong>. Click the link in that email to access your itinerary.
            </p>
            <p style={{ ...sans, fontSize:"0.8rem", color:C.stone, marginTop:"1.5rem" }}>The link expires after 7 days and can only be used once.</p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize:"2rem", fontWeight:300, marginBottom:"0.5rem" }}>Access your itinerary.</h1>
            <p style={{ ...sans, fontSize:"0.92rem", color:C.dusk, lineHeight:1.75, marginBottom:"2rem" }}>
              Enter the email address you used when submitting your brief and we'll send you a login link.
            </p>
            {searchParams?.error && (
              <div style={{ ...sans, background:"#fdf0ee", border:"1px solid #e8c4bb", color:"#9B3A2A", padding:"0.85rem 1rem", fontSize:"0.84rem", marginBottom:"1.25rem" }}>
                {searchParams.error === "invalid" ? "This link has expired or already been used. Please request a new one." : "An error occurred. Please try again."}
              </div>
            )}
            <form onSubmit={send}>
              <label style={{ ...sans, display:"block", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:C.dusk, marginBottom:"0.5rem" }}>Email address</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ width:"100%", background:C.white, border:`1.5px solid ${C.stone}`, color:C.ink, fontFamily:"system-ui", fontSize:"0.92rem", padding:"0.75rem 0.9rem", outline:"none", boxSizing:"border-box", borderRadius:0, marginBottom:"1rem" }}
              />
              {status === "error" && <p style={{ ...sans, color:"#9B3A2A", fontSize:"0.82rem", marginBottom:"0.75rem" }}>{err}</p>}
              <button
                type="submit" disabled={status === "sending"}
                style={{ ...sans, background:C.ink, color:C.white, border:"none", fontSize:"0.82rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.95rem 2rem", cursor:"pointer", width:"100%", opacity: status === "sending" ? 0.6 : 1 }}
              >
                {status === "sending" ? "Sending…" : "Send login link →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
