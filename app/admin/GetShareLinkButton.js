"use client";
import { useState } from "react";
import { getShareableLink } from "./actions.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35" };
const sans = { fontFamily:"system-ui,sans-serif" };

export default function GetShareLinkButton({ email }) {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      const url = await getShareableLink(email);
      setLink(url);
      try { await navigator.clipboard.writeText(url); } catch {}
    } catch {
      alert("Couldn't generate a link, please try again.");
    }
    setLoading(false);
  };

  if (link) {
    return (
      <code style={{ ...sans, fontSize:"0.65rem", background:C.sand, border:`1px solid ${C.stone}`, padding:"0.4rem 0.5rem", maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }} title={link}>
        {link}
      </code>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{ ...sans, background:"none", border:"none", color:C.dusk, fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer", padding:"0.5rem 0.25rem", opacity: loading ? 0.5 : 1 }}
    >
      {loading ? "Generating…" : "Get shareable link"}
    </button>
  );
}
