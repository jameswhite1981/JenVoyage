import { buildQuickLinks, normalizeItinerary, parseItineraryJSON } from "../../lib/itinerary.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };

const sectionLabel = { ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.gold, margin:"2rem 0 0.75rem", paddingBottom:"0.35rem", borderBottom:`1px solid ${C.stone}` };
const body = { ...sans, fontSize:"0.85rem", color:C.dusk, fontWeight:300, lineHeight:1.8 };

function LegRow({ leg }) {
  if (!leg) return null;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem 1.25rem", padding:"0.75rem 0", borderBottom:`1px solid ${C.mist}` }}>
      <div style={{ ...sans, fontSize:"0.78rem", fontWeight:500, color:C.ink, minWidth:110 }}>{leg.label}</div>
      {leg.date  && <div style={{ ...sans, fontSize:"0.78rem", color:C.dusk }}>{leg.date}</div>}
      {leg.route && <div style={{ ...sans, fontSize:"0.78rem", color:C.dusk, flex:1 }}>{leg.route}</div>}
      {leg.cost  && <div style={{ ...sans, fontSize:"0.78rem", color:C.ink, fontWeight:500 }}>{leg.cost}</div>}
    </div>
  );
}

function OptionRow({ opt, recommended }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", gap:"1rem", padding:"0.5rem 0", borderBottom:`1px solid ${C.mist}` }}>
      <div style={{ ...sans, fontSize:"0.8rem", color:C.ink }}>
        {opt.label}{opt.name ? ` — ${opt.name}` : ""}{recommended && opt.recommended ? <span style={{ color:C.gold, fontWeight:500 }}> ★ Recommended</span> : null}
      </div>
      {opt.cost && <div style={{ ...sans, fontSize:"0.8rem", color:C.dusk, whiteSpace:"nowrap" }}>{opt.cost}</div>}
    </div>
  );
}

export default function ItineraryDisplay({ itinerary }) {
  const raw = typeof itinerary === "string" ? parseItineraryJSON(itinerary) : itinerary;
  const d = normalizeItinerary(raw);
  if (!d) return null;
  const quickLinks = buildQuickLinks(d);

  return (
    <div>
      <h2 style={{ fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:300, marginBottom:"0.5rem" }}>{d.title}</h2>
      {d.intro && <p style={{ ...body, marginBottom:"1rem" }}>{d.intro}</p>}

      {d.preTripNotes?.length > 0 && (
        <div style={{ background:C.mist, border:`1px solid ${C.stone}`, padding:"1rem 1.25rem", marginBottom:"1rem" }}>
          {d.preTripNotes.map((n, i) => <p key={i} style={{ ...sans, fontSize:"0.8rem", color:C.dusk, margin:i ? "0.4rem 0 0" : 0 }}>{n}</p>)}
        </div>
      )}

      {(d.flights?.outbound || d.flights?.return || d.flights?.internal?.length > 0) && (
        <>
          <div style={sectionLabel}>Flights</div>
          <LegRow leg={d.flights.outbound} />
          {d.flights.internal?.map((leg, i) => <LegRow key={i} leg={leg} />)}
          <LegRow leg={d.flights.return} />
        </>
      )}

      {d.regions?.map((region, ri) => (
        <div key={ri}>
          <div style={sectionLabel}>{region.name}</div>
          {region.whyHere && <p style={{ ...body, marginBottom:"1rem" }}>{region.whyHere}</p>}

          {region.accommodation?.options?.length > 0 && (
            <div style={{ marginBottom:"1.25rem" }}>
              <div style={{ fontSize:"0.95rem", fontWeight:400, marginBottom:"0.25rem" }}>
                Accommodation {region.accommodation.nights ? `— ${region.accommodation.nights}` : ""}
              </div>
              {region.accommodation.note && <p style={{ ...sans, fontSize:"0.78rem", color:C.stone, fontStyle:"italic", marginBottom:"0.5rem" }}>{region.accommodation.note}</p>}
              {region.accommodation.options.map((opt, i) => <OptionRow key={i} opt={opt} recommended />)}
            </div>
          )}

          {region.gettingThereNote && (
            <p style={{ ...sans, fontSize:"0.8rem", color:C.dusk, fontStyle:"italic", marginBottom:"1rem" }}>{region.gettingThereNote}</p>
          )}

          {region.days?.map((day) => (
            <div key={day.day} style={{ marginBottom:"1.5rem", paddingLeft:"1.25rem", borderLeft:`2px solid ${C.stone}`, position:"relative" }}>
              <div style={{ position:"absolute", left:-5, top:"0.4rem", width:8, height:8, background:C.gold, borderRadius:"50%" }} />
              <div style={{ ...sans, fontSize:"0.62rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, marginBottom:"0.2rem" }}>
                Day {day.day}{day.dateLabel ? ` — ${day.dateLabel}` : ""}{day.bookInAdvance ? " ⚠️ Book in advance" : ""}
              </div>
              <div style={{ fontSize:"1.05rem", fontWeight:400, marginBottom:"0.4rem" }}>{day.title}</div>
              {day.description && <p style={{ ...body, margin:0 }}>{day.description}</p>}
              {day.options?.length > 0 && (
                <div style={{ marginTop:"0.5rem" }}>
                  {day.options.map((opt, i) => <OptionRow key={i} opt={opt} />)}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {d.costSummary?.length > 0 && (
        <div style={{ background:C.mist, border:`1px solid ${C.stone}`, padding:"1.5rem", marginTop:"1.5rem" }}>
          <h4 style={{ fontSize:"1rem", fontWeight:400, marginBottom:"0.75rem" }}>Cost summary</h4>
          {d.costSummary.map((row, i) => (
            <div key={i} style={{ display:"flex", gap:"1rem", marginBottom:"0.4rem" }}>
              <span style={{ ...sans, fontSize:"0.78rem", fontWeight:500, color:C.dusk, width:220 }}>{row.label}</span>
              <span style={{ ...sans, fontSize:"0.78rem", color:C.ink }}>{row.value}</span>
            </div>
          ))}
        </div>
      )}

      {d.alternativeOperators?.length > 0 && (
        <div>
          <div style={sectionLabel}>Similar packages from other operators</div>
          <ul style={{ listStyle:"none", padding:0, margin:0 }}>
            {d.alternativeOperators.map((op, i) => <li key={i} style={{ ...sans, fontSize:"0.82rem", color:C.dusk, padding:"0.2rem 0" }}>— {op}</li>)}
          </ul>
        </div>
      )}

      {d.goodToKnow?.length > 0 && (
        <div>
          <div style={sectionLabel}>Good to know before you go</div>
          <ul style={{ listStyle:"none", padding:0, margin:0 }}>
            {d.goodToKnow.map((tip, i) => <li key={i} style={{ ...sans, fontSize:"0.82rem", color:C.dusk, padding:"0.2rem 0" }}>— {tip}</li>)}
          </ul>
        </div>
      )}

      {quickLinks.length > 0 && (
        <div>
          <div style={sectionLabel}>Quick reference — all links</div>
          {quickLinks.map((g, i) => (
            <div key={i} style={{ marginBottom:"1rem" }}>
              <div style={{ ...sans, fontSize:"0.75rem", fontWeight:500, color:C.ink, marginBottom:"0.3rem" }}>{g.group}</div>
              {g.items.map((item, j) => (
                <div key={j} style={{ ...sans, fontSize:"0.78rem", color:C.dusk, padding:"0.15rem 0" }}>
                  {item.recommended && <span style={{ color:C.gold }}>★ </span>}
                  {item.link ? <a href={item.link} style={{ color:C.dusk }}>{item.label}</a> : item.label}
                  {item.note ? ` — ${item.note}` : ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
