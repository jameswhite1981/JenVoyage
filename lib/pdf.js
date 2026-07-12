import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { renderToBuffer } from "@react-pdf/renderer";
import { buildQuickLinks, normalizeItinerary, parseItineraryJSON, linkifySegments } from "./itinerary.js";

const C = { gold: "#B8962E", ink: "#1C1A17", dusk: "#4A3F35", stone: "#C8BFB0", mist: "#EAE4DA", sand: "#F2EDE4" };

const s = StyleSheet.create({
  page:       { padding: 48, fontFamily: "Helvetica", backgroundColor: C.sand, color: C.ink },
  logo:       { fontSize: 7, letterSpacing: 3, color: C.gold, textTransform: "uppercase" },
  rule:       { borderBottomWidth: 0.5, borderBottomColor: C.stone, marginVertical: 12 },
  title:      { fontSize: 24, marginBottom: 4 },
  meta:       { fontSize: 8, color: C.stone, marginBottom: 16 },
  overview:   { fontSize: 9, lineHeight: 1.75, color: C.dusk, marginBottom: 12 },
  noteBox:    { backgroundColor: C.mist, padding: 10, marginBottom: 16 },
  noteText:   { fontSize: 8, color: C.dusk, lineHeight: 1.6, marginBottom: 3 },
  secLabel:   { fontSize: 6.5, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", marginTop: 18, marginBottom: 8 },
  regionName: { fontSize: 15, marginBottom: 4 },
  whyHere:    { fontSize: 8.5, lineHeight: 1.7, color: C.dusk, marginBottom: 10 },
  legRow:     { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: C.mist },
  legLabel:   { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.ink, width: 90 },
  legDate:    { fontSize: 8, color: C.dusk, width: 65 },
  legRoute:   { fontSize: 8, color: C.dusk, flex: 1 },
  legCost:    { fontSize: 8, color: C.ink, fontFamily: "Helvetica-Bold", width: 90, textAlign: "right" },
  legLink:    { fontSize: 8, color: C.gold, fontFamily: "Helvetica-Bold", width: 45, textAlign: "right" },
  accomHead:  { fontSize: 10, marginBottom: 2 },
  accomNote:  { fontSize: 7.5, color: C.stone, fontStyle: "italic", marginBottom: 5 },
  optRow:     { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: C.mist },
  optLabel:   { fontSize: 8, color: C.ink, flex: 1 },
  optCost:    { fontSize: 8, color: C.dusk },
  optLink:    { fontSize: 8, color: C.gold, fontFamily: "Helvetica-Bold", marginLeft: 8 },
  gettingThere: { fontSize: 8, color: C.dusk, fontStyle: "italic", marginTop: 6, marginBottom: 6 },
  dayNum:     { fontSize: 6.5, letterSpacing: 2, color: C.gold, textTransform: "uppercase", marginBottom: 3 },
  body:       { fontSize: 8.5, lineHeight: 1.7, color: C.dusk },
  bold:       { fontFamily: "Helvetica-Bold" },
  dayWrap:    { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: C.stone },
  costBox:    { backgroundColor: C.mist, padding: 12, marginTop: 10 },
  costRow:    { flexDirection: "row", marginBottom: 4 },
  costLabel:  { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: C.dusk, width: 200 },
  costValue:  { fontSize: 8.5, color: C.ink, flex: 1 },
  tip:        { fontSize: 8.5, color: C.dusk, lineHeight: 1.7 },
  linkGroup:  { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: C.ink, marginTop: 8, marginBottom: 3 },
  linkItem:   { fontSize: 7.5, color: C.dusk, lineHeight: 1.6 },
  footer:     { position: "absolute", bottom: 32, left: 48, right: 48 },
  footerText: { fontSize: 7, color: C.stone, textAlign: "center" },
});

// Turns [label](https://...) markdown-style links and **text** bold in free
// text into real react-pdf <Link>/<Text> nodes, for use as <Text> children.
function linkedNodes(text) {
  return linkifySegments(text).map((seg, i) => {
    if (seg.type === "link") return <Link key={i} src={seg.url}>{seg.label}</Link>;
    if (seg.type === "bold") return <Text key={i} style={s.bold}>{seg.value}</Text>;
    return seg.value;
  });
}

function LegRow({ leg }) {
  if (!leg || (!leg.date && !leg.route && !leg.cost)) return null;
  return (
    <View style={s.legRow}>
      <Text style={s.legLabel}>{leg.label}</Text>
      <Text style={s.legDate}>{leg.date}</Text>
      <Text style={s.legRoute}>{leg.route}</Text>
      <Text style={s.legCost}>{leg.cost}</Text>
      {leg.link ? <Link src={leg.link} style={s.legLink}>Book →</Link> : null}
    </View>
  );
}

function OptionRow({ opt, recommended }) {
  return (
    <View style={s.optRow}>
      <Text style={s.optLabel}>
        {opt.label}{opt.name ? `: ${opt.name}` : ""}{recommended && opt.recommended ? " ★ Recommended" : ""}
      </Text>
      {opt.cost ? <Text style={s.optCost}>{opt.cost}</Text> : null}
      {opt.link ? <Link src={opt.link} style={s.optLink}>Book →</Link> : null}
    </View>
  );
}

function ItineraryPDF({ itinerary, firstName }) {
  const raw = typeof itinerary === "string" ? parseItineraryJSON(itinerary) : itinerary;
  const d = normalizeItinerary(raw);
  const quickLinks = buildQuickLinks(d);
  const hasFlights = d.flights?.outbound?.route || d.flights?.return?.route || d.flights?.internal?.length > 0;

  return (
    <Document>
      <Page size="A4" style={s.page} wrap>
        <Text style={s.logo}>Jen Voyage</Text>
        <View style={s.rule} />
        <Text style={s.title}>{d.title || "Your Bespoke Itinerary"}</Text>
        <Text style={s.meta}>Prepared exclusively for {firstName}</Text>

        {d.intro ? <Text style={s.overview}>{linkedNodes(d.intro)}</Text> : null}

        {d.preTripNotes?.length > 0 && (
          <View style={s.noteBox}>
            {d.preTripNotes.map((n, i) => <Text key={i} style={s.noteText}>{linkedNodes(n)}</Text>)}
          </View>
        )}

        {hasFlights && (
          <View>
            <Text style={s.secLabel}>Flights</Text>
            <LegRow leg={d.flights.outbound} />
            {d.flights.internal?.map((leg, i) => <LegRow key={i} leg={leg} />)}
            <LegRow leg={d.flights.return} />
          </View>
        )}

        {d.regions?.map((region, ri) => (
          <View key={ri} wrap={false}>
            <Text style={s.secLabel}>{region.name}</Text>
            <Text style={s.regionName}>{region.name}</Text>
            {region.whyHere ? <Text style={s.whyHere}>{linkedNodes(region.whyHere)}</Text> : null}

            {region.accommodation?.options?.length > 0 && (
              <View style={{ marginBottom: 8 }}>
                <Text style={s.accomHead}>Accommodation{region.accommodation.nights ? `: ${region.accommodation.nights}` : ""}</Text>
                {region.accommodation.note ? <Text style={s.accomNote}>{linkedNodes(region.accommodation.note)}</Text> : null}
                {region.accommodation.options.map((opt, i) => <OptionRow key={i} opt={opt} recommended />)}
              </View>
            )}

            {region.gettingThereNote ? <Text style={s.gettingThere}>{linkedNodes(region.gettingThereNote)}</Text> : null}

            {region.days?.map((day) => (
              <View key={day.day} style={s.dayWrap}>
                {day.bookInAdvance ? <Text style={s.dayNum}>⚠ Book in advance</Text> : null}
                {day.description ? <Text style={s.body}>{linkedNodes(day.description)}</Text> : null}
                {day.options?.map((opt, i) => <OptionRow key={i} opt={opt} />)}
              </View>
            ))}
          </View>
        ))}

        {d.costSummary?.length > 0 && (
          <View style={s.costBox}>
            <Text style={s.secLabel}>Cost Summary</Text>
            {d.costSummary.map((row, i) => (
              <View key={i} style={s.costRow}>
                <Text style={s.costLabel}>{row.label}</Text>
                <Text style={s.costValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}

        {d.alternativeOperators?.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={s.secLabel}>Similar Packages from Other Operators</Text>
            {d.alternativeOperators.map((op, i) => <Text key={i} style={s.tip}>• {linkedNodes(op)}</Text>)}
          </View>
        )}

        {d.goodToKnow?.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={s.secLabel}>Good to Know Before You Go</Text>
            {d.goodToKnow.map((tip, i) => <Text key={i} style={s.tip}>• {linkedNodes(tip)}</Text>)}
          </View>
        )}

        {quickLinks.length > 0 && (
          <View style={{ marginTop: 16 }} break>
            <Text style={s.secLabel}>Quick Reference: All Links</Text>
            {quickLinks.map((g, i) => (
              <View key={i}>
                <Text style={s.linkGroup}>{g.group}</Text>
                {g.items.map((item, j) => (
                  <Text key={j} style={s.linkItem}>
                    {item.recommended ? "★ " : ""}{item.label}{item.note ? `: ${item.note}` : ""}{item.link ? ` (${item.link})` : ""}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={s.footer} fixed>
          <View style={s.rule} />
          <Text style={s.footerText}>
            Prepared exclusively for {firstName} by Jen Voyage. All costs are indicative and subject to change.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function generatePdf(itinerary, firstName) {
  return await renderToBuffer(<ItineraryPDF itinerary={itinerary} firstName={firstName} />);
}
