import { getRouteMapBuffer } from "../../../lib/map.js";

export const runtime = "nodejs";
export const maxDuration = 45;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination") || "";
  const regions = (searchParams.get("regions") || "").split("|").map((s) => s.trim()).filter(Boolean);

  if (!regions.length && !destination) return new Response(null, { status: 400 });

  const buf = await getRouteMapBuffer(regions, destination);
  if (!buf) return new Response(null, { status: 404 });

  return new Response(buf, {
    headers: {
      "Content-Type": "image/png",
      // Route names for a given itinerary don't change once generated, so
      // this can be cached hard — avoids re-geocoding/re-fetching tiles on
      // every page view.
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
}
