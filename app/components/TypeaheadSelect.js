"use client";
import { useState, useRef, useEffect } from "react";

const COLORS = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", mist:"#EAE4DA", white:"#FDFBF8" };
const sans = { fontFamily:"system-ui,sans-serif" };

// A searchable dropdown: type to filter a long list of options (e.g. every
// country) instead of scrolling a native <select>. Reverts to the last
// confirmed selection if the user types something and clicks away without
// picking a match from the list.
export default function TypeaheadSelect({ items, value, onChange, placeholder = "Start typing…", disabled = false, wrapStyle }) {
  const selected = items.find(i => i.value === value) || null;
  const [query, setQuery] = useState(selected?.label || "");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => { setQuery(selected?.label || ""); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setQuery(selected?.label || "");
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, selected]);

  const filtered = query
    ? items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  const pick = (item) => { onChange(item.value); setQuery(item.label); setOpen(false); };

  const inp = { width:"100%", background: disabled ? COLORS.mist : COLORS.white, border:`1.5px solid ${COLORS.stone}`, color:COLORS.ink, fontFamily:"system-ui", fontSize:"0.92rem", padding:"0.75rem 0.9rem", outline:"none", boxSizing:"border-box", borderRadius:0 };

  return (
    <div style={{ position:"relative", ...wrapStyle }} ref={wrapRef}>
      <input
        type="text"
        style={inp}
        value={query}
        placeholder={placeholder}
        disabled={disabled}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, marginTop:4, zIndex:20, background:COLORS.white, border:`1.5px solid ${COLORS.stone}`, boxShadow:"0 8px 24px rgba(28,26,23,0.12)", maxHeight:220, overflowY:"auto" }}>
          {filtered.length > 0 ? filtered.map(item => (
            <div
              key={item.value}
              onClick={() => pick(item)}
              style={{ ...sans, fontSize:"0.85rem", padding:"0.6rem 0.9rem", cursor:"pointer", color:COLORS.ink, background: item.value===value ? COLORS.mist : "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.mist; }}
              onMouseLeave={e => { e.currentTarget.style.background = item.value===value ? COLORS.mist : "transparent"; }}
            >
              {item.label}
            </div>
          )) : (
            <div style={{ ...sans, fontSize:"0.8rem", color:COLORS.stone, padding:"0.6rem 0.9rem" }}>No matches</div>
          )}
        </div>
      )}
    </div>
  );
}
