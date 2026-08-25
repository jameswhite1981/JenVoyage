import { buildQuickLinks, normalizeItinerary, parseItineraryJSON, linkifySegments, starStates, STAR_PATH, STAR_PATH_LEFT_HALF } from "../../lib/itinerary.js";
import Accordion from "./Accordion.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };

// Renders as a collapsible accordion (admin preview + customer portal) or a
// plain labelled section when collapsible is false entirely.
function Section({ collapsible, defaultOpen, title, subtitle, children }) {
  if (collapsible) {
    return <Accordion title={title} subtitle={subtitle} defaultOpen={defaultOpen}>{children}</Accordion>;
  }
  return (
    <>
      <div style={sectionLabel}>{title}</div>
      {children}
    </>
  );
}

const sectionLabel = { ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.gold, margin:"2rem 0 0.75rem", paddingBottom:"0.35rem", borderBottom:`1px solid ${C.stone}` };
const body = { ...sans, fontSize:"0.85rem", color:C.dusk, fontWeight:300, lineHeight:1.8 };

function BookLink({ href }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ ...sans, fontSize:"0.72rem", fontWeight:500, color:C.gold, textDecoration:"none", whiteSpace:"nowrap" }}>
      Book →
    </a>
  );
}

function LegRow({ leg, internal }) {
  if (!leg) return null;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem 1.25rem", padding:"0.75rem 0", borderBottom:`1px solid ${C.mist}`, alignItems:"center" }}>
      <div style={{ ...sans, fontSize:"0.78rem", fontWeight:500, color:C.ink, minWidth:110 }}>{internal ? "Internal flight" : leg.label}</div>
      {leg.date  && <div style={{ ...sans, fontSize:"0.78rem", color:C.dusk }}>{leg.date}</div>}
      {leg.route && <div style={{ ...sans, fontSize:"0.78rem", color:C.dusk, flex:1 }}>{leg.route}</div>}
      {leg.cost  && <div style={{ ...sans, fontSize:"0.78rem", color:C.ink, fontWeight:500 }}>{leg.cost}</div>}
      <BookLink href={leg.link} />
    </div>
  );
}

// Renders free text with any [label](https://...) markdown-style links as
// real clickable <a> tags, and **text** as bold — lets narrative fields
// (whyHere, day descriptions, pre-trip notes, etc.) reference a link or
// emphasise something without a separate structured field.
function LinkedText({ text }) {
  return linkifySegments(text).map((seg, i) => {
    if (seg.type === "link") return <a key={i} href={seg.url} target="_blank" rel="noopener noreferrer" style={{ color:"inherit", textDecoration:"underline" }}>{seg.label}</a>;
    if (seg.type === "bold") return <strong key={i}>{seg.value}</strong>;
    return <span key={i}>{seg.value}</span>;
  });
}

// Draws real vector stars (not text glyphs) so the same icon renders
// identically here and in the PDF, regardless of font glyph coverage. Half
// stars are a literal half-shaped path painted over a full one, rather than
// an SVG clipPath — react-pdf accepts a clipPath prop without error but
// doesn't actually apply it, so this keeps both renderers on the same
// plain-fill mechanism that's known to work in both.
function StarRating({ value }) {
  const states = starStates(value);
  if (!states.length) return null;
  return (
    <span style={{ display:"inline-flex", gap:1, verticalAlign:"middle", marginLeft:"0.4rem" }}>
      {states.map((state, i) => (
        <svg key={i} width={13} height={13} viewBox="0 0 24 24">
          <path d={STAR_PATH} fill={C.mist} />
          {state !== "empty" && <path d={state === "half" ? STAR_PATH_LEFT_HALF : STAR_PATH} fill={C.gold} />}
        </svg>
      ))}
    </span>
  );
}

function OptionRow({ opt }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", gap:"1rem", padding:"0.5rem 0", borderBottom:`1px solid ${C.mist}`, alignItems:"center" }}>
      <div style={{ ...sans, fontSize:"0.8rem", color:C.ink, display:"flex", alignItems:"center" }}>
        {opt.label}{opt.name ? `: ${opt.name}` : ""}
        <StarRating value={opt.rating} />
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", flexShrink:0 }}>
        {opt.cost && <span style={{ ...sans, fontSize:"0.8rem", color:C.dusk, whiteSpace:"nowrap" }}>{opt.cost}</span>}
        <BookLink href={opt.link} />
      </div>
    </div>
  );
}

export default function ItineraryDisplay({ itinerary, collapsible = false, defaultOpen = false }) {
  const raw = typeof itinerary === "string" ? parseItineraryJSON(itinerary) : itinerary;
  const d = normalizeItinerary(raw);
  if (!d) return null;
  const quickLinks = buildQuickLinks(d);

  return (
    <div>
      <h2 style={{ fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:300, marginBottom:"0.5rem" }}>{d.title}</h2>
      {d.intro && <p style={{ ...body, marginBottom:"1rem" }}><LinkedText text={d.intro} /></p>}

      {d.preTripNotes?.length > 0 && (
        <div style={{ background:C.mist, border:`1px solid ${C.stone}`, padding:"1rem 1.25rem", marginBottom:"1rem" }}>
          {d.preTripNotes.map((n, i) => <p key={i} style={{ ...sans, fontSize:"0.8rem", color:C.dusk, margin:i ? "0.4rem 0 0" : 0 }}><LinkedText text={n} /></p>)}
        </div>
      )}

      {(d.flights?.outbound?.route || d.flights?.return?.route || d.flights?.internal?.length > 0) && (
        <Section collapsible={collapsible} defaultOpen={defaultOpen} title="Flights">
          <LegRow leg={d.flights.outbound} />
          {d.flights.internal?.map((leg, i) => <LegRow key={i} leg={leg} internal />)}
          <LegRow leg={d.flights.return} />
        </Section>
      )}

      {d.regions?.map((region, ri) => (
        <Section
          key={ri}
          collapsible={collapsible}
          defaultOpen={defaultOpen}
          title={region.name}
          subtitle={collapsible ? `${region.days?.length || 0} day${(region.days?.length || 0) === 1 ? "" : "s"}` : undefined}
        >
          {region.whyHere && <p style={{ ...body, marginBottom:"1rem" }}><LinkedText text={region.whyHere} /></p>}

          {region.accommodation?.options?.length > 0 && (
            <div style={{ marginBottom:"1.25rem" }}>
              <div style={{ fontSize:"0.95rem", fontWeight:400, marginBottom:"0.25rem" }}>
                Accommodation {region.accommodation.nights ? `: ${region.accommodation.nights}` : ""}
              </div>
              {region.accommodation.note && <p style={{ ...sans, fontSize:"0.78rem", color:C.stone, fontStyle:"italic", marginBottom:"0.5rem" }}><LinkedText text={region.accommodation.note} /></p>}
              {region.accommodation.options.map((opt, i) => <OptionRow key={i} opt={opt} />)}
              <p style={{ ...sans, fontSize:"0.68rem", color:C.stone, fontStyle:"italic", marginTop:"0.4rem" }}>
                Prices shown are subject to change and should be confirmed before booking.
              </p>
              {region.accommodation.options.some(o => Number(o.rating) > 0) && (
                <p style={{ ...sans, fontSize:"0.68rem", color:C.stone, fontStyle:"italic", marginTop:"0.2rem" }}>
                  Ratings shown are based on reviews, sourced from online travel websites - not given by Jen Voyage.
                </p>
              )}
            </div>
          )}

          {region.gettingThereNote && (
            <p style={{ ...sans, fontSize:"0.8rem", color:C.dusk, fontStyle:"italic", marginBottom:"1rem" }}><LinkedText text={region.gettingThereNote} /></p>
          )}

          {region.days?.map((day) => (
            <div key={day.day} style={{ marginBottom:"1.5rem", paddingLeft:"1.25rem", borderLeft:`2px solid ${C.stone}`, position:"relative" }}>
              <div style={{ position:"absolute", left:-5, top:"0.4rem", width:8, height:8, background:C.gold, borderRadius:"50%" }} />
              {day.bookInAdvance && (
                <div style={{ ...sans, fontSize:"0.62rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.gold, marginBottom:"0.2rem" }}>
                  ⚠️ Book in advance
                </div>
              )}
              {day.title && <div style={{ fontSize:"1.05rem", fontWeight:400, marginBottom:"0.4rem" }}>{day.title}</div>}
              {day.description && <p style={{ ...body, margin:0 }}><LinkedText text={day.description} /></p>}
              {day.options?.length > 0 && (
                <div style={{ marginTop:"0.5rem" }}>
                  {day.options.map((opt, i) => <OptionRow key={i} opt={opt} />)}
                </div>
              )}
            </div>
          ))}
        </Section>
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
            {d.alternativeOperators.map((op, i) => <li key={i} style={{ ...sans, fontSize:"0.82rem", color:C.dusk, padding:"0.2rem 0" }}>• <LinkedText text={op} /></li>)}
          </ul>
        </div>
      )}

      {d.goodToKnow?.length > 0 && (
        <div>
          <div style={sectionLabel}>Good to know before you go</div>
          <ul style={{ listStyle:"none", padding:0, margin:0 }}>
            {d.goodToKnow.map((tip, i) => <li key={i} style={{ ...sans, fontSize:"0.82rem", color:C.dusk, padding:"0.2rem 0" }}>• <LinkedText text={tip} /></li>)}
          </ul>
        </div>
      )}

      {quickLinks.length > 0 && (
        <div>
          <div style={sectionLabel}>Quick reference: all links</div>
          {quickLinks.map((g, i) => (
            <div key={i} style={{ marginBottom:"1rem" }}>
              <div style={{ ...sans, fontSize:"0.75rem", fontWeight:500, color:C.ink, marginBottom:"0.3rem" }}>{g.group}</div>
              {g.items.map((item, j) => (
                <div key={j} style={{ ...sans, fontSize:"0.78rem", color:C.dusk, padding:"0.15rem 0" }}>
                  {item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color:C.gold, textDecoration:"underline" }}>{item.label}</a> : item.label}
                  {item.note ? `: ${item.note}` : ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
