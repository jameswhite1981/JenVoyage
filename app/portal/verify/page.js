"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8" };
const sans = { fontFamily:"system-ui,sans-serif" };

export default function VerifyPage({ searchParams }) {
  const router = useRouter();
  const token = searchParams?.token;
  const [status, setStatus] = useState("idle"); // idle | loading | error

  const confirm = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) { setStatus("error"); return; }
      router.push("/portal");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"2rem" }}>
      <div style={{ width:"100%", maxWidth:400, textAlign:"center" }}>
        <div style={{ ...sans, fontSize:"0.85rem", letterSpacing:"0.35em", textTransform:"uppercase", color:C.gold, marginBottom:"2rem" }}>Jen Voyage</div>

        {!token || status === "error" ? (
          <>
            <h1 style={{ fontSize:"1.6rem", fontWeight:300, marginBottom:"0.75rem" }}>This link has expired.</h1>
            <p style={{ ...sans, fontSize:"0.9rem", color:C.dusk, lineHeight:1.75, marginBottom:"1.5rem" }}>
              It may have already been used, or it's more than 7 days old.
            </p>
            <Link href="/portal/login" style={{ ...sans, color:C.ink, fontSize:"0.82rem", textDecoration:"underline" }}>Request a new link</Link>
          </>
        ) : (
          <>
            <h1 style={{ fontSize:"1.6rem", fontWeight:300, marginBottom:"0.75rem" }}>Access your itinerary</h1>
            <p style={{ ...sans, fontSize:"0.9rem", color:C.dusk, lineHeight:1.75, marginBottom:"1.5rem" }}>
              Click below to securely log in.
            </p>
            <button
              onClick={confirm} disabled={status === "loading"}
              style={{ ...sans, background:C.ink, color:C.white, border:"none", fontSize:"0.82rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.95rem 2rem", cursor:"pointer", width:"100%", opacity: status === "loading" ? 0.6 : 1 }}
            >
              {status === "loading" ? "Verifying…" : "Continue →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
