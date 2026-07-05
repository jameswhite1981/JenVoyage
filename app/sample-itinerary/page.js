import Link from "next/link";
import Nav from "../components/Nav";
import ItineraryDisplay from "../components/ItineraryDisplay.js";
import { SAMPLE_ITINERARY } from "../../lib/sampleItinerary.js";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8" };
const sans = { fontFamily:"system-ui,sans-serif" };

export const metadata = {
  title: "Sample Itinerary | Jen Voyage",
  description: "See an example of the fully personalised, day-by-day itinerary Jen Voyage builds for every trip.",
};

export default function SampleItineraryPage() {
  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <Nav />
      <div style={{ maxWidth:860, margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>
        <div style={{ ...sans, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", color:C.gold, marginBottom:"1rem" }}>Sample itinerary</div>
        <p style={{ ...sans, fontSize:"0.88rem", color:C.dusk, fontWeight:300, lineHeight:1.8, marginBottom:"2.5rem", maxWidth:"64ch" }}>
          This is a worked example of what you receive after payment — fully personalised, day by day, with accommodation and activity options and a direct booking link on every flight, hotel and activity. Costs and links below are illustrative only.
        </p>

        <div style={{ border:`1px solid ${C.stone}`, background:C.white, padding:"1.75rem" }}>
          <ItineraryDisplay itinerary={SAMPLE_ITINERARY} collapsible defaultOpen />
        </div>

        <div style={{ textAlign:"center", marginTop:"3rem" }}>
          <Link href="/" style={{ ...sans, background:C.ink, color:C.white, fontSize:"0.78rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.95rem 2.25rem", textDecoration:"none" }}>
            Begin Planning
          </Link>
        </div>
      </div>
    </div>
  );
}
