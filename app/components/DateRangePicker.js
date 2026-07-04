"use client";
import { useState, useRef, useEffect } from "react";

const COLORS = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", mist:"#EAE4DA", white:"#FDFBF8" };
const sans = { fontFamily:"system-ui,sans-serif" };

const WEEKDAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function toISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}
function fromISO(iso) {
  if (!iso) return null;
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(y, m-1, d);
}
function fmtDisplay(iso) {
  const d = fromISO(iso);
  if (!d) return null;
  return d.toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}
function sameDay(a, b) {
  return a && b && a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function buildMonthGrid(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = (firstOfMonth.getDay() + 6) % 7; // Monday-first
  const gridStart = new Date(year, month, 1 - startOffset);
  const days = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return days;
}

export default function DateRangePicker({ startDate, endDate, onChange, label = "Travel dates" }) {
  const [open, setOpen] = useState(false);
  const start = fromISO(startDate);
  const end = fromISO(endDate);
  const [viewDate, setViewDate] = useState(start || new Date());
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const inp = { width:"100%", background:COLORS.white, border:`1.5px solid ${COLORS.stone}`, color:COLORS.ink, fontFamily:"system-ui", fontSize:"0.92rem", padding:"0.75rem 0.9rem", outline:"none", boxSizing:"border-box", borderRadius:0, cursor:"pointer", textAlign:"left" };
  const label_ = { ...sans, display:"block", fontSize:"0.78rem", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:COLORS.dusk, marginBottom:"0.5rem" };

  const handleDayClick = (day) => {
    if (!start || (start && end)) {
      onChange({ start: toISO(day), end: "" });
    } else if (day < start) {
      onChange({ start: toISO(day), end: "" });
    } else {
      onChange({ start: toISO(start), end: toISO(day) });
      setOpen(false);
    }
  };

  const days = buildMonthGrid(viewDate);
  const displayText = start && end ? `${fmtDisplay(startDate)} — ${fmtDisplay(endDate)}` : start ? `${fmtDisplay(startDate)} — select return date` : "Select dates";

  return (
    <div style={{ position:"relative" }} ref={wrapRef}>
      <label style={label_}>{label}</label>
      <div style={inp} onClick={() => setOpen(o => !o)}>
        <span style={{ color: start ? COLORS.ink : COLORS.stone }}>{displayText}</span>
      </div>

      {open && (
        <div style={{ position:"absolute", top:"100%", left:0, marginTop:4, zIndex:20, background:COLORS.white, border:`1.5px solid ${COLORS.stone}`, padding:"1rem", boxShadow:"0 8px 24px rgba(28,26,23,0.12)", width:300 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.75rem" }}>
            <button type="button" onClick={() => setViewDate(v => new Date(v.getFullYear(), v.getMonth()-1, 1))} style={{ ...sans, background:"none", border:"none", cursor:"pointer", fontSize:"1rem", color:COLORS.dusk, padding:"0.2rem 0.5rem" }}>‹</button>
            <span style={{ ...sans, fontSize:"0.82rem", fontWeight:500, color:COLORS.ink }}>{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
            <button type="button" onClick={() => setViewDate(v => new Date(v.getFullYear(), v.getMonth()+1, 1))} style={{ ...sans, background:"none", border:"none", cursor:"pointer", fontSize:"1rem", color:COLORS.dusk, padding:"0.2rem 0.5rem" }}>›</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:"0.3rem" }}>
            {WEEKDAYS.map(w => (
              <div key={w} style={{ ...sans, fontSize:"0.65rem", color:COLORS.stone, textAlign:"center", padding:"0.2rem 0" }}>{w}</div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
            {days.map((day, i) => {
              const inMonth = day.getMonth() === viewDate.getMonth();
              const isStart = sameDay(day, start);
              const isEnd = sameDay(day, end);
              const inRange = start && end && day > start && day < end;
              const selected = isStart || isEnd;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  style={{
                    ...sans, fontSize:"0.78rem", padding:"0.4rem 0", border:"none", cursor:"pointer",
                    background: selected ? COLORS.gold : inRange ? COLORS.mist : "transparent",
                    color: selected ? COLORS.white : inMonth ? COLORS.ink : COLORS.stone,
                    fontWeight: selected ? 500 : 400,
                  }}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
          {start && (
            <button type="button" onClick={() => { onChange({ start:"", end:"" }); }} style={{ ...sans, background:"none", border:"none", color:COLORS.dusk, fontSize:"0.7rem", textDecoration:"underline", cursor:"pointer", marginTop:"0.6rem", padding:0 }}>
              Clear dates
            </button>
          )}
        </div>
      )}
    </div>
  );
}
