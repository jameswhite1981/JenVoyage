"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };
const smallBtn = { ...sans, background:"none", border:`1.5px solid ${C.stone}`, color:C.dusk, fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.4rem 0.8rem", cursor:"pointer" };

function fmtDate(s) {
  return new Date(s).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}

function Stars({ n }) {
  return <span style={{ color:C.gold, letterSpacing:"1px" }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
}

function ReviewRow({ review, onApprove, onDelete }) {
  const [busy, setBusy] = useState(false);
  const approve = async () => { setBusy(true); await onApprove(review.id); setBusy(false); };
  const remove = async () => {
    if (!confirm(`${review.approved_at ? "Remove" : "Reject"} this review from ${review.name}?`)) return;
    setBusy(true); await onDelete(review.id); setBusy(false);
  };
  return (
    <div style={{ background:C.white, border:`1px solid ${review.approved_at ? C.stone : C.gold}`, padding:"1.1rem 1.5rem", marginBottom:"1rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"0.75rem", marginBottom:"0.6rem" }}>
        <div>
          <div style={{ fontSize:"0.95rem", fontWeight:500 }}>{review.name}{review.trip ? ` · ${review.trip}` : ""}</div>
          <div style={{ ...sans, fontSize:"0.72rem", color:C.stone, marginTop:"0.2rem" }}>
            <Stars n={review.rating} /> · Submitted {fmtDate(review.created_at)}
            {review.approved_at && ` · Approved ${fmtDate(review.approved_at)}`}
          </div>
        </div>
        <div style={{ display:"flex", gap:"0.6rem" }}>
          {!review.approved_at && (
            <button style={smallBtn} onClick={approve} disabled={busy}>{busy ? "…" : "Approve"}</button>
          )}
          <button style={{ ...smallBtn, color:"#9B3A2A", borderColor:"#9B3A2A" }} onClick={remove} disabled={busy}>
            {busy ? "…" : review.approved_at ? "Remove" : "Reject"}
          </button>
        </div>
      </div>
      <p style={{ fontSize:"0.9rem", fontWeight:300, lineHeight:1.7, margin:0, color:C.ink }}>&ldquo;{review.quote}&rdquo;</p>
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(null);

  const load = () => fetch("/api/admin/reviews").then(r => r.json()).then(setReviews);
  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await fetch(`/api/admin/reviews/${id}`, { method: "PATCH" });
    load();
  };
  const remove = async (id) => {
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    load();
  };

  if (!reviews) return <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:C.stone }}>Loading…</div>;

  const pending = reviews.filter(r => !r.approved_at);
  const approved = reviews.filter(r => r.approved_at);

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"2.5rem 1.5rem 5rem" }}>
        <div style={{ paddingBottom:"1.5rem", borderBottom:`1px solid ${C.stone}`, marginBottom:"2rem" }}>
          <Link href="/admin" style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, textDecoration:"none" }}>← Dashboard</Link>
          <h1 style={{ fontSize:"1.6rem", fontWeight:300, margin:"0.4rem 0 0.2rem" }}>Reviews</h1>
          <div style={{ ...sans, fontSize:"0.78rem", color:C.stone }}>{pending.length} awaiting approval · {approved.length} live on the site</div>
        </div>

        <div style={{ ...sans, fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, margin:"0 0 1rem" }}>
          Awaiting approval
        </div>
        {pending.length === 0 && <p style={{ ...sans, fontSize:"0.85rem", color:C.stone, marginBottom:"2rem" }}>Nothing waiting.</p>}
        {pending.map(r => <ReviewRow key={r.id} review={r} onApprove={approve} onDelete={remove} />)}

        <div style={{ ...sans, fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, margin:"2.5rem 0 1rem" }}>
          Live on /reviews
        </div>
        {approved.length === 0 && <p style={{ ...sans, fontSize:"0.85rem", color:C.stone }}>None approved yet.</p>}
        {approved.map(r => <ReviewRow key={r.id} review={r} onApprove={approve} onDelete={remove} />)}
      </div>
    </div>
  );
}
