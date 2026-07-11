import Link from "next/link";
import { listTemplates } from "../../../lib/storage.js";
import { normalizeItinerary, parseItineraryJSON } from "../../../lib/itinerary.js";
import ItineraryDisplay from "../../components/ItineraryDisplay.js";
import Accordion from "../../components/Accordion.js";
import DeleteTemplateButton from "./DeleteTemplateButton.js";

// Shows live template data behind auth middleware — must never be statically
// prerendered/cached, or it would freeze on whatever existed at build time.
export const dynamic = "force-dynamic";

const C = { sand:"#F2EDE4", stone:"#C8BFB0", ink:"#1C1A17", dusk:"#4A3F35", gold:"#B8962E", white:"#FDFBF8", mist:"#EAE4DA" };
const sans = { fontFamily:"system-ui,sans-serif" };

function fmtDate(s) {
  return new Date(s).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}

export default async function TemplatesPage() {
  const templates = await listTemplates();

  return (
    <div style={{ fontFamily:"Georgia,serif", background:C.sand, minHeight:"100vh", color:C.ink }}>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"3rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem", paddingBottom:"1.5rem", borderBottom:`1px solid ${C.stone}`, marginBottom:"2rem" }}>
          <div>
            <Link href="/admin" style={{ ...sans, fontSize:"0.72rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.dusk, textDecoration:"none" }}>← All enquiries</Link>
            <h1 style={{ fontSize:"1.6rem", fontWeight:300, margin:"0.4rem 0 0" }}>Itinerary templates</h1>
          </div>
          <Link href="/admin/templates/new" style={{ ...sans, background:C.ink, color:C.white, fontSize:"0.75rem", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.65rem 1.4rem", textDecoration:"none" }}>
            + Create new template
          </Link>
        </div>

        <p style={{ ...sans, fontSize:"0.84rem", color:C.dusk, fontWeight:300, lineHeight:1.7, marginBottom:"2rem", maxWidth:"60ch" }}>
          Saved from any published enquiry via "Save as template" on its editor page, or built from scratch with "Create new template". Open an enquiry and use "Load from template" to start its draft from one of these instead of blank.
        </p>

        {!templates?.length && <p style={{ ...sans, color:C.dusk }}>No templates saved yet.</p>}

        <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
          {templates?.map(t => {
            let preview = null;
            try { preview = normalizeItinerary(parseItineraryJSON(t.content)); } catch {}
            return (
              <Accordion
                key={t.id}
                title={t.name}
                subtitle={`${t.destination_name || "N/A"} · saved ${fmtDate(t.created_at)}`}
              >
                <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"1rem" }}>
                  <DeleteTemplateButton id={t.id} name={t.name} />
                </div>
                {preview ? <ItineraryDisplay itinerary={preview} collapsible /> : <p style={{ ...sans, color:"#9B3A2A" }}>Could not parse this template's content.</p>}
              </Accordion>
            );
          })}
        </div>
      </div>
    </div>
  );
}
