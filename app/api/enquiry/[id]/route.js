import { getEnquiry } from "../../../../lib/storage.js";
import { parseItineraryJSON } from "../../../../lib/itinerary.js";

export async function GET(request, { params }) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) return Response.json({ error: "Not found" }, { status: 404 });

  // Prefer the full itinerary once it's ready — richer day1 with real options.
  if (enquiry.status !== "generating") {
    let draft = null;
    try { draft = parseItineraryJSON(enquiry.ai_draft); } catch {}
    if (draft) {
      const totalDays = (draft.regions || []).reduce((sum, r) => sum + (r.days?.length || 0), 0);
      return Response.json({
        status: enquiry.status,
        preview: {
          title: draft.title,
          overview: draft.intro,
          totalDays,
          day1: draft.regions?.[0]?.days?.[0] || null,
        },
      });
    }
  }

  // Full itinerary isn't ready (or failed) yet — fall back to the fast teaser.
  let teaser = null;
  try { teaser = parseItineraryJSON(enquiry.teaser); } catch {}
  if (teaser) {
    return Response.json({
      status: "teaser_ready",
      preview: {
        title: teaser.title,
        overview: teaser.intro,
        totalDays: null,
        day1: teaser.day1 || null,
      },
    });
  }

  if (enquiry.status === "generating") {
    return Response.json({ status: "generating" });
  }

  return Response.json({ status: "failed" });
}
