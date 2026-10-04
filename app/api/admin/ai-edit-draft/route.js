import { editItinerary } from "../../../../lib/ai.js";
import { normalizeItinerary, parseItineraryJSON } from "../../../../lib/itinerary.js";

export async function POST(request) {
  const { draft, instruction } = await request.json();
  if (!draft || !instruction?.trim()) {
    return Response.json({ error: "Missing draft or instruction." }, { status: 400 });
  }

  try {
    const raw = await editItinerary(draft, instruction.trim());
    const revised = normalizeItinerary(parseItineraryJSON(raw));
    return Response.json({ ok: true, draft: revised });
  } catch (err) {
    console.error("[ai-edit-draft] failed —", err?.message || err);
    return Response.json({ error: "Could not apply that edit. Try rephrasing the instruction." }, { status: 500 });
  }
}
