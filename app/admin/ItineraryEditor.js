"use client";
import { emptyLeg } from "../../lib/itinerary.js";
import Accordion from "../components/Accordion.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };
const inp = { width:"100%", background:C.white, border:`1.5px solid ${C.stone}`, color:C.ink, fontFamily:"system-ui", fontSize:"0.88rem", padding:"0.65rem 0.85rem", outline:"none", boxSizing:"border-box", borderRadius:0 };
const ta  = { ...inp, resize:"vertical", lineHeight:1.7 };
const lbl = { ...sans, display:"block", fontSize:"0.72rem", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:C.dusk, marginBottom:"0.4rem" };
const sectionHead = { ...sans, fontSize:"0.7rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, margin:"2rem 0 1rem", paddingBottom:"0.4rem", borderBottom:`1px solid ${C.stone}` };
const smallBtn = { ...sans, background:"none", border:`1.5px solid ${C.stone}`, color:C.dusk, fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.08em", textTransform:"uppercase", padding:"0.4rem 0.8rem", cursor:"pointer" };
const removeBtn = { ...sans, background:"none", border:"none", color:"#9B3A2A", fontSize:"0.68rem", fontWeight:500, letterSpacing:"0.05em", textTransform:"uppercase", cursor:"pointer", padding:"0.2rem 0" };
const moveBtn = { ...sans, background:"none", border:`1px solid ${C.stone}`, color:C.dusk, fontSize:"0.75rem", fontWeight:600, cursor:"pointer", padding:"0.15rem 0.55rem", lineHeight:1.4 };
const groupBox = { border:`1px solid ${C.stone}`, padding:"1.25rem 1.5rem", marginBottom:"1.25rem", background:C.white };
const row2 = { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" };
const field = { marginBottom:"0.9rem" };

const COST_SUMMARY_LABELS = [
  "Total flights",
  "Total accommodation",
  "Total recommended activities",
  "Total transfers",
  "Overall total",
  "Total per person",
];

function Field({ label, value, onChange, textarea, placeholder }) {
  return (
    <div style={field}>
      <label style={lbl}>{label}</label>
      {textarea
        ? <textarea style={{ ...ta, minHeight:70 }} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input style={inp} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}

function StringListEditor({ items, onChange, placeholder }) {
  const list = items || [];
  return (
    <div>
      {list.map((val, i) => (
        <div key={i} style={{ display:"flex", gap:"0.5rem", marginBottom:"0.5rem" }}>
          <input style={inp} value={val} placeholder={placeholder}
            onChange={e => { const next = [...list]; next[i] = e.target.value; onChange(next); }} />
          <button style={removeBtn} onClick={() => onChange(list.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <button style={smallBtn} onClick={() => onChange([...list, ""])}>+ Add</button>
    </div>
  );
}

function LegEditor({ leg, onChange }) {
  const l = leg || emptyLeg();
  const set = (k, v) => onChange({ ...l, [k]: v });
  return (
    <div style={row2}>
      <Field label="Date" value={l.date} onChange={v => set("date", v)} placeholder="DD/MM/YYYY" />
      <Field label="Cost" value={l.cost} onChange={v => set("cost", v)} placeholder="£X,XXX" />
      <div style={{ gridColumn:"1 / -1" }}>
        <Field label="Route" value={l.route} onChange={v => set("route", v)} placeholder="Origin → Destination" />
      </div>
      <div style={{ gridColumn:"1 / -1" }}>
        <Field label="Booking link" value={l.link} onChange={v => set("link", v)} placeholder="https://…" />
      </div>
    </div>
  );
}

// Shared structured-itinerary editor (title, intro, flights, regions/days,
// cost summary, alternative operators, good to know) used by both the
// enquiry editor's Edit tab and the standalone "create new template" page.
export default function ItineraryEditor({ draft, setDraft }) {
  const upd = (path, val) => setDraft(prev => {
    const next = structuredClone(prev);
    const keys = path.split(".");
    let cur = next;
    for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
    cur[keys[keys.length - 1]] = val;
    return next;
  });

  // Day numbers run continuously across the whole trip (region 2 continues
  // where region 1 left off), so they're recomputed from scratch whenever
  // days are added/removed rather than left editable.
  const renumberDays = (itinerary) => {
    const next = structuredClone(itinerary);
    let n = 0;
    (next.regions || []).forEach(region => {
      (region.days || []).forEach(day => { n += 1; day.day = n; });
    });
    return next;
  };

  const addRegion = () => setDraft(prev => ({
    ...prev,
    regions: [...(prev.regions || []), { name:"New region", whyHere:"", accommodation:{ nights:"", note:"", options:[] }, gettingThereNote:"", days:[] }],
  }));
  const removeRegion = (ri) => setDraft(prev => renumberDays({ ...prev, regions: prev.regions.filter((_, i) => i !== ri) }));
  const moveRegion = (ri, dir) => setDraft(prev => {
    const target = ri + dir;
    if (target < 0 || target >= prev.regions.length) return prev;
    const next = structuredClone(prev);
    [next.regions[ri], next.regions[target]] = [next.regions[target], next.regions[ri]];
    return renumberDays(next);
  });

  const addAccomOption = (ri) => setDraft(prev => {
    const next = structuredClone(prev);
    next.regions[ri].accommodation.options.push({ label:"Option", name:"", cost:"", link:"", recommended:false });
    return next;
  });
  const removeAccomOption = (ri, oi) => setDraft(prev => {
    const next = structuredClone(prev);
    next.regions[ri].accommodation.options.splice(oi, 1);
    return next;
  });

  const addDay = (ri) => setDraft(prev => {
    const next = structuredClone(prev);
    next.regions[ri].days.push({ day: 0, description:"", bookInAdvance:false, options:[] });
    return renumberDays(next);
  });
  const removeDay = (ri, di) => setDraft(prev => {
    const next = structuredClone(prev);
    next.regions[ri].days.splice(di, 1);
    return renumberDays(next);
  });
  const moveDay = (ri, di, dir) => setDraft(prev => {
    const target = di + dir;
    if (target < 0 || target >= prev.regions[ri].days.length) return prev;
    const next = structuredClone(prev);
    const days = next.regions[ri].days;
    [days[di], days[target]] = [days[target], days[di]];
    return renumberDays(next);
  });

  const addDayOption = (ri, di) => setDraft(prev => {
    const next = structuredClone(prev);
    next.regions[ri].days[di].options.push({ label:"", cost:"", link:"" });
    return next;
  });
  const removeDayOption = (ri, di, oi) => setDraft(prev => {
    const next = structuredClone(prev);
    next.regions[ri].days[di].options.splice(oi, 1);
    return next;
  });

  const addInternalLeg = () => setDraft(prev => ({ ...prev, flights: { ...prev.flights, internal: [...(prev.flights.internal || []), { ...emptyLeg(), label:"Internal flight" }] } }));
  const removeInternalLeg = (i) => setDraft(prev => ({ ...prev, flights: { ...prev.flights, internal: prev.flights.internal.filter((_, idx) => idx !== i) } }));

  const updCostValue = (label, value) => setDraft(prev => {
    const next = structuredClone(prev);
    const list = next.costSummary || (next.costSummary = []);
    const row = list.find(r => r.label === label);
    if (row) row.value = value;
    else list.push({ label, value });
    return next;
  });

  return (
    <div style={{ maxWidth:820 }}>
      <Field label="Title" value={draft.title} onChange={v => upd("title", v)} />
      <p style={{ ...sans, fontSize:"0.72rem", color:C.stone, margin:"-0.5rem 0 0.9rem" }}>
        Tip: in any text field below, write <code>[link text](https://…)</code> to add a clickable link, or <code>**text**</code> to make it bold.
      </p>
      <Field label="Intro" textarea value={draft.intro} onChange={v => upd("intro", v)} placeholder="You asked for a trip that included…" />

      <div style={field}>
        <label style={lbl}>Optional pre-trip notes (vaccinations, visas, dress codes)</label>
        <StringListEditor items={draft.preTripNotes} onChange={v => upd("preTripNotes", v)} placeholder="e.g. Do I need vaccinations? Yes, ask your GP." />
      </div>

      {/* Flights */}
      <Accordion title="Flights" subtitle={`${2 + (draft.flights?.internal?.length || 0)} legs`}>
        <div style={groupBox}>
          <div style={{ ...sans, fontSize:"0.7rem", fontWeight:500, color:C.gold, textTransform:"uppercase", marginBottom:"0.5rem" }}>Outbound</div>
          <LegEditor leg={draft.flights?.outbound} onChange={v => upd("flights.outbound", v)} />
        </div>
        {(draft.flights?.internal || []).map((leg, i) => (
          <div key={i} style={groupBox}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem" }}>
              <span style={{ ...sans, fontSize:"0.7rem", fontWeight:500, color:C.gold, textTransform:"uppercase" }}>Internal flight {i+1}</span>
              <button style={removeBtn} onClick={() => removeInternalLeg(i)}>Remove</button>
            </div>
            <LegEditor leg={leg} onChange={v => upd(`flights.internal.${i}`, v)} />
          </div>
        ))}
        <button style={{ ...smallBtn, marginBottom:"1.25rem" }} onClick={addInternalLeg}>+ Add internal flight</button>
        <div style={groupBox}>
          <div style={{ ...sans, fontSize:"0.7rem", fontWeight:500, color:C.gold, textTransform:"uppercase", marginBottom:"0.5rem" }}>Return</div>
          <LegEditor leg={draft.flights?.return} onChange={v => upd("flights.return", v)} />
        </div>
      </Accordion>

      {/* Regions */}
      <div style={sectionHead}>Regions & day-by-day</div>
      {(draft.regions || []).map((region, ri) => (
        <Accordion
          key={ri}
          title={region.name || `Region ${ri + 1}`}
          subtitle={`${region.days?.length || 0} day${(region.days?.length || 0) === 1 ? "" : "s"}`}
          onRemove={() => removeRegion(ri)}
          headerExtra={
            <>
              <button style={{ ...moveBtn, opacity: ri === 0 ? 0.35 : 1 }} disabled={ri === 0} onClick={() => moveRegion(ri, -1)} title="Move region up">↑</button>
              <button style={{ ...moveBtn, opacity: ri === draft.regions.length - 1 ? 0.35 : 1 }} disabled={ri === draft.regions.length - 1} onClick={() => moveRegion(ri, 1)} title="Move region down">↓</button>
            </>
          }
        >
          <Field label="Region name" value={region.name} onChange={v => upd(`regions.${ri}.name`, v)} />
          <Field label="Why here" textarea value={region.whyHere} onChange={v => upd(`regions.${ri}.whyHere`, v)} />

          <div style={{ ...sans, fontSize:"0.68rem", fontWeight:500, color:C.dusk, textTransform:"uppercase", margin:"1rem 0 0.5rem" }}>Accommodation</div>
          <div style={row2}>
            <Field label="Nights" value={region.accommodation?.nights} onChange={v => upd(`regions.${ri}.accommodation.nights`, v)} placeholder="4 nights" />
            <Field label="Guidance note" value={region.accommodation?.note} onChange={v => upd(`regions.${ri}.accommodation.note`, v)} />
          </div>
          {(region.accommodation?.options || []).map((opt, oi) => (
            <div key={oi} style={{ border:`1px solid ${C.mist}`, padding:"0.85rem 1rem", marginBottom:"0.6rem" }}>
              <div style={row2}>
                <Field label="Option label" value={opt.label} onChange={v => upd(`regions.${ri}.accommodation.options.${oi}.label`, v)} placeholder="Option 1: Hotel" />
                <Field label="Property name" value={opt.name} onChange={v => upd(`regions.${ri}.accommodation.options.${oi}.name`, v)} />
                <Field label="Cost" value={opt.cost} onChange={v => upd(`regions.${ri}.accommodation.options.${oi}.cost`, v)} placeholder="£XXX" />
                <Field label="Link" value={opt.link} onChange={v => upd(`regions.${ri}.accommodation.options.${oi}.link`, v)} placeholder="https://…" />
              </div>
              <label style={{ ...sans, fontSize:"0.78rem", color:C.dusk, display:"flex", alignItems:"center", gap:"0.4rem" }}>
                <input type="checkbox" checked={!!opt.recommended} onChange={e => upd(`regions.${ri}.accommodation.options.${oi}.recommended`, e.target.checked)} />
                Recommended
              </label>
              <button style={removeBtn} onClick={() => removeAccomOption(ri, oi)}>Remove option</button>
            </div>
          ))}
          <button style={{ ...smallBtn, marginBottom:"1rem" }} onClick={() => addAccomOption(ri)}>+ Add accommodation option</button>

          <Field label="Getting there note (optional, e.g. ferry between sub-locations)" value={region.gettingThereNote} onChange={v => upd(`regions.${ri}.gettingThereNote`, v)} />

          <div style={{ ...sans, fontSize:"0.68rem", fontWeight:500, color:C.dusk, textTransform:"uppercase", margin:"1rem 0 0.5rem" }}>Day by day</div>
          {(region.days || []).map((day, di) => (
            <div key={di} style={{ border:`1px solid ${C.mist}`, padding:"0.85rem 1rem", marginBottom:"0.6rem" }}>
              <Field label="Day notes" textarea value={day.description} onChange={v => upd(`regions.${ri}.days.${di}.description`, v)} placeholder="Write the whole day out freely, e.g. 27th March: arrive Bangkok, transfer to hotel, evening street food walk near Chinatown…" />
              <label style={{ ...sans, fontSize:"0.78rem", color:C.dusk, display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"0.6rem" }}>
                <input type="checkbox" checked={!!day.bookInAdvance} onChange={e => upd(`regions.${ri}.days.${di}.bookInAdvance`, e.target.checked)} />
                ⚠️ Book in advance
              </label>
              {(day.options || []).map((opt, oi) => (
                <div key={oi} style={{ display:"flex", gap:"0.5rem", alignItems:"flex-end", marginBottom:"0.5rem" }}>
                  <div style={{ flex:2 }}><Field label="Option" value={opt.label} onChange={v => upd(`regions.${ri}.days.${di}.options.${oi}.label`, v)} /></div>
                  <div style={{ flex:1 }}><Field label="Cost" value={opt.cost} onChange={v => upd(`regions.${ri}.days.${di}.options.${oi}.cost`, v)} /></div>
                  <div style={{ flex:1 }}><Field label="Link" value={opt.link} onChange={v => upd(`regions.${ri}.days.${di}.options.${oi}.link`, v)} /></div>
                  <button style={{ ...removeBtn, marginBottom:"0.9rem" }} onClick={() => removeDayOption(ri, di, oi)}>✕</button>
                </div>
              ))}
              <button style={smallBtn} onClick={() => addDayOption(ri, di)}>+ Add option/activity</button>
              <div style={{ marginTop:"0.6rem", display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <button style={{ ...moveBtn, opacity: di === 0 ? 0.35 : 1 }} disabled={di === 0} onClick={() => moveDay(ri, di, -1)} title="Move day up">↑</button>
                <button style={{ ...moveBtn, opacity: di === region.days.length - 1 ? 0.35 : 1 }} disabled={di === region.days.length - 1} onClick={() => moveDay(ri, di, 1)} title="Move day down">↓</button>
                <button style={removeBtn} onClick={() => removeDay(ri, di)}>Remove day</button>
              </div>
            </div>
          ))}
          <button style={smallBtn} onClick={() => addDay(ri)}>+ Add day</button>
        </Accordion>
      ))}
      <button style={smallBtn} onClick={addRegion}>+ Add region</button>

      {/* Cost summary — fixed six line items, values only */}
      <div style={sectionHead}>Cost summary</div>
      {COST_SUMMARY_LABELS.map(label => {
        const row = (draft.costSummary || []).find(r => r.label === label);
        return (
          <Field key={label} label={label} value={row?.value} onChange={v => updCostValue(label, v)} placeholder="£X,XXX" />
        );
      })}

      {/* Alternative operators */}
      <div style={sectionHead}>Similar packages from other operators</div>
      <StringListEditor items={draft.alternativeOperators} onChange={v => upd("alternativeOperators", v)} placeholder="Operator: package name" />

      {/* Good to know */}
      <div style={sectionHead}>Good to know before you go</div>
      <StringListEditor items={draft.goodToKnow} onChange={v => upd("goodToKnow", v)} placeholder="Tip for the customer" />
    </div>
  );
}
