"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8" };
const sans = { fontFamily:"system-ui,sans-serif" };
const inp = { width:"100%", background:C.white, border:`1.5px solid ${C.stone}`, color:C.ink, fontFamily:"system-ui", fontSize:"0.92rem", padding:"0.75rem 0.9rem", outline:"none", boxSizing:"border-box", borderRadius:0, marginBottom:"1rem" };
const btn = { ...sans, background:C.ink, color:C.white, border:"none", fontSize:"0.82rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.95rem 2rem", cursor:"pointer", width:"100%" };
const label = { ...sans, display:"block", fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:C.dusk, marginBottom:"0.5rem" };

export default function AdminLogin() {
  // password -> verify (MFA already set up) | setup (first-time enrollment) -> backupCodes -> done
  const [step, setStep] = useState("password");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [setupData, setSetupData] = useState(null); // { secret, qr }
  const [backupCodes, setBackupCodes] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitPassword = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");

      if (data.mfaEnabled) {
        setStep("verify");
      } else {
        const setupRes = await fetch("/api/admin/mfa/setup");
        const setup = await setupRes.json();
        if (!setupRes.ok) throw new Error(setup.error || "Could not start MFA setup.");
        setSetupData(setup);
        setStep("setup");
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      router.push("/admin"); router.refresh();
    } catch (e) { setError(e.message); setLoading(false); }
  };

  const submitSetupConfirm = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/mfa/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed.");
      setBackupCodes(data.backupCodes);
      setStep("backupCodes");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"center", padding:"2rem" }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ ...sans, fontSize:"0.75rem", letterSpacing:"0.3em", textTransform:"uppercase", color:C.gold, marginBottom:"0.5rem" }}>Jen Voyage</div>
        <div style={{ ...sans, fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.stone, marginBottom:"2rem" }}>Admin</div>

        {step === "password" && (
          <form onSubmit={submitPassword}>
            <label style={label}>Password</label>
            <input type="password" required autoFocus value={password} onChange={e => setPassword(e.target.value)} style={inp} />
            {error && <p style={{ ...sans, color:"#9B3A2A", fontSize:"0.82rem", marginBottom:"0.75rem" }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.6 : 1 }}>
              {loading ? "Checking…" : "Continue →"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={submitVerify}>
            <p style={{ ...sans, fontSize:"0.85rem", color:C.dusk, lineHeight:1.6, marginBottom:"1.25rem" }}>
              Enter the 6-digit code from your authenticator app, or one of your backup codes.
            </p>
            <label style={label}>Code</label>
            <input
              type="text" required autoFocus value={code} onChange={e => setCode(e.target.value)}
              placeholder="123456" style={inp}
            />
            {error && <p style={{ ...sans, color:"#9B3A2A", fontSize:"0.82rem", marginBottom:"0.75rem" }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.6 : 1 }}>
              {loading ? "Verifying…" : "Sign in →"}
            </button>
          </form>
        )}

        {step === "setup" && setupData && (
          <form onSubmit={submitSetupConfirm}>
            <p style={{ ...sans, fontSize:"0.85rem", color:C.dusk, lineHeight:1.6, marginBottom:"1.25rem" }}>
              First time signing in — set up two-factor authentication. Scan this QR code with Google Authenticator, Authy, or similar, then enter the 6-digit code it shows.
            </p>
            <div style={{ textAlign:"center", marginBottom:"1.25rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={setupData.qr} alt="MFA QR code" style={{ width:200, height:200 }} />
            </div>
            <p style={{ ...sans, fontSize:"0.72rem", color:C.stone, marginBottom:"1.25rem", wordBreak:"break-all" }}>
              Can&apos;t scan? Enter this key manually: <code>{setupData.secret}</code>
            </p>
            <label style={label}>6-digit code</label>
            <input
              type="text" required autoFocus value={code} onChange={e => setCode(e.target.value)}
              placeholder="123456" style={inp}
            />
            {error && <p style={{ ...sans, color:"#9B3A2A", fontSize:"0.82rem", marginBottom:"0.75rem" }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ ...btn, opacity: loading ? 0.6 : 1 }}>
              {loading ? "Confirming…" : "Confirm & finish setup →"}
            </button>
          </form>
        )}

        {step === "backupCodes" && backupCodes && (
          <div>
            <p style={{ ...sans, fontSize:"0.85rem", color:C.dusk, lineHeight:1.6, marginBottom:"1.25rem" }}>
              Save these backup codes somewhere safe — each works once, as a way back in if you ever lose access to your authenticator app. They won&apos;t be shown again.
            </p>
            <div style={{ background:C.white, border:`1.5px solid ${C.stone}`, padding:"1rem 1.25rem", marginBottom:"1.25rem", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.5rem" }}>
              {backupCodes.map(c => (
                <code key={c} style={{ ...sans, fontSize:"0.82rem", color:C.ink }}>{c}</code>
              ))}
            </div>
            <button
              onClick={() => { router.push("/admin"); router.refresh(); }}
              style={btn}
            >
              I&apos;ve saved these — continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
