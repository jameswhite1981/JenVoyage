import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { renderToBuffer } from "@react-pdf/renderer";

const C = { gold: "#B8962E", ink: "#1C1A17", dusk: "#4A3F35", stone: "#C8BFB0", mist: "#EAE4DA", sand: "#F2EDE4" };

const s = StyleSheet.create({
  page:       { padding: 48, fontFamily: "Helvetica", backgroundColor: C.sand, color: C.ink },
  logo:       { fontSize: 7, letterSpacing: 3, color: C.gold, textTransform: "uppercase" },
  rule:       { borderBottomWidth: 0.5, borderBottomColor: C.stone, marginVertical: 12 },
  title:      { fontSize: 24, marginBottom: 4 },
  meta:       { fontSize: 8, color: C.stone, marginBottom: 16 },
  overview:   { fontSize: 9, lineHeight: 1.75, color: C.dusk, marginBottom: 20 },
  secLabel:   { fontSize: 6.5, letterSpacing: 2.5, color: C.gold, textTransform: "uppercase", marginBottom: 6 },
  dayNum:     { fontSize: 6.5, letterSpacing: 2, color: C.gold, textTransform: "uppercase", marginBottom: 3 },
  dayTitle:   { fontSize: 12, marginBottom: 5 },
  body:       { fontSize: 8.5, lineHeight: 1.7, color: C.dusk },
  bold:       { fontFamily: "Helvetica-Bold" },
  stay:       { fontSize: 7.5, color: C.stone, fontStyle: "italic", marginTop: 4 },
  dayWrap:    { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 1, borderLeftColor: C.stone },
  costBox:    { backgroundColor: C.mist, padding: 12, marginTop: 16 },
  costRow:    { flexDirection: "row", marginBottom: 4 },
  costLabel:  { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: C.dusk, width: 130 },
  costValue:  { fontSize: 8.5, color: C.ink, flex: 1 },
  tip:        { fontSize: 8.5, color: C.dusk, lineHeight: 1.7 },
  footer:     { position: "absolute", bottom: 32, left: 48, right: 48 },
  footerText: { fontSize: 7, color: C.stone, textAlign: "center" },
});

function ItineraryPDF({ itinerary, firstName }) {
  const d = typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary;
  const costs = d.costSummary || {};

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.logo}>Jen Voyage</Text>
        <View style={s.rule} />
        <Text style={s.title}>{d.title || "Your Bespoke Itinerary"}</Text>
        <Text style={s.meta}>Prepared exclusively for {firstName}</Text>

        <Text style={s.overview}>{d.overview}</Text>

        {d.days?.map((day) => (
          <View key={day.day} style={s.dayWrap}>
            <Text style={s.dayNum}>Day {day.day}</Text>
            <Text style={s.dayTitle}>{day.title}</Text>
            {day.isTravel && day.travelNote ? (
              <Text style={s.body}>✈ {day.travelNote}</Text>
            ) : null}
            {day.morning   ? <Text style={s.body}><Text style={s.bold}>Morning — </Text>{day.morning}</Text>   : null}
            {day.afternoon ? <Text style={s.body}><Text style={s.bold}>Afternoon — </Text>{day.afternoon}</Text> : null}
            {day.evening   ? <Text style={s.body}><Text style={s.bold}>Evening — </Text>{day.evening}</Text>   : null}
            {day.stay      ? <Text style={s.stay}>Stay: {day.stay}</Text> : null}
          </View>
        ))}

        {Object.values(costs).some(Boolean) && (
          <View style={s.costBox}>
            <Text style={s.secLabel}>Cost Summary</Text>
            {[["Flights", costs.flights], ["Accommodation", costs.accommodation], ["Excursions", costs.excursions], ["Total per person", costs.totalPerPerson]].map(([label, val]) =>
              val ? (
                <View key={label} style={s.costRow}>
                  <Text style={s.costLabel}>{label}</Text>
                  <Text style={s.costValue}>{val}</Text>
                </View>
              ) : null
            )}
          </View>
        )}

        {d.practicalTips?.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={s.secLabel}>Good to Know</Text>
            {d.practicalTips.map((tip, i) => <Text key={i} style={s.tip}>— {tip}</Text>)}
          </View>
        )}

        {d.bookingFlags?.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={s.secLabel}>Book in Advance</Text>
            {d.bookingFlags.map((flag, i) => <Text key={i} style={s.tip}>— {flag}</Text>)}
          </View>
        )}

        <View style={s.footer}>
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
