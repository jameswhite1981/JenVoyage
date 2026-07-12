"use client";
import { useState } from "react";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };

export default function Accordion({ title, subtitle, defaultOpen = false, onRemove, headerExtra, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ border:`1px solid ${C.stone}`, marginBottom:"1.25rem", background:C.white }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.9rem 1.25rem", cursor:"pointer", userSelect:"none" }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", minWidth:0 }}>
          <span style={{ ...sans, fontSize:"1.1rem", fontWeight:600, color:C.gold, width:16, textAlign:"center", lineHeight:1, flexShrink:0 }}>
            {open ? "−" : "+"}
          </span>
          <div style={{ minWidth:0 }}>
            <div style={{ ...sans, fontSize:"0.78rem", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", color:C.ink }}>{title}</div>
            {subtitle && <div style={{ ...sans, fontSize:"0.72rem", color:C.stone, marginTop:"0.15rem" }}>{subtitle}</div>}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", flexShrink:0 }} onClick={(e) => e.stopPropagation()}>
          {headerExtra}
          {onRemove && (
            <button
              onClick={() => onRemove()}
              style={{ ...sans, background:"none", border:"none", color:"#9B3A2A", fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", cursor:"pointer", padding:"0.2rem 0.4rem" }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {open && <div style={{ padding:"0 1.25rem 1.25rem" }}>{children}</div>}
    </div>
  );
}
