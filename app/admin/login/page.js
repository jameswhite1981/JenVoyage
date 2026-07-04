"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8" };
const sans = { fontFamily:"system-ui,sans-serif" };

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) { router.push("/admin"); router.refresh(); }
    else { const d = await res.json(); setError(d.error || "Login failed."); }
  };

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", padding:"2rem" }}>
      <div style={{ width:"100%", maxWidth:360 }}>
        <div style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:"0.5rem" }}>Jen Voyage</div>
        <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.stone, marginBottom:"2rem" }}>Admin</div>
        <form onSubmit={login}>
          <label style={{ ...sans, display:"block", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:C.dusk, marginBottom:"0.5rem" }}>Password</label>
          <input
            type="password" required value={password} onChange={e => setPassword(e.target.value)}
            style={{ width:"100%", background:C.white, border:`1.5px solid ${C.stone}`, color:C.ink, fontFamily:"system-ui", fontSize:"0.92rem", padding:"0.75rem 0.9rem", outline:"none", boxSizing:"border-box", borderRadius:0, marginBottom:"1rem" }}
          />
          {error && <p style={{ ...sans, color:"#9B3A2A", fontSize:"0.82rem", marginBottom:"0.75rem" }}>{error}</p>}
          <button
            type="submit" disabled={loading}
            style={{ ...sans, background:C.ink, color:C.white, border:"none", fontSize:"0.82rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.95rem 2rem", cursor:"pointer", width:"100%", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>
      </div>
    </div>
  );
}
