import { COUNTRY_TO_FCDO_SLUG } from "../../../lib/fcdoCountries.js";

// Known FCDO alert_status codes, phrased in full. Any code we haven't seen
// before still gets shown (humanized from the raw code) rather than dropped,
// since a new/unrecognised code from GOV.UK is exactly the kind of thing
// worth surfacing rather than silently swallowing.
const ALERT_LABELS = {
  avoid_all_travel_to_whole_country: "The FCDO advises against all travel to the whole country.",
  avoid_all_travel_to_parts: "The FCDO advises against all travel to parts of the country.",
  avoid_all_but_essential_travel_to_whole_country: "The FCDO advises against all but essential travel to the whole country.",
  avoid_all_but_essential_travel_to_parts: "The FCDO advises against all but essential travel to parts of the country.",
};

function humanizeAlert(code) {
  return ALERT_LABELS[code] || `FCDO alert: ${code.replace(/_/g, " ")}.`;
}

// Looks up the live UK government (FCDO) travel advice for a destination
// country so the enquiry form can flag current safety/political warnings
// instead of relying on a hand-maintained (and quickly stale) list.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") || "";
  const slug = COUNTRY_TO_FCDO_SLUG[country];

  if (!slug) return Response.json({ available: false });

  try {
    const res = await fetch(`https://www.gov.uk/api/content/foreign-travel-advice/${slug}`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return Response.json({ available: false });

    const data = await res.json();
    const alertStatus = data?.details?.alert_status || [];
    const level = alertStatus.length === 0
      ? "none"
      : alertStatus.some(s => s.includes("avoid_all_travel")) ? "severe" : "caution";

    return Response.json({
      available: true,
      level,
      messages: alertStatus.map(humanizeAlert),
      url: `https://www.gov.uk${data.base_path}`,
      updatedAt: data.public_updated_at || null,
    });
  } catch {
    return Response.json({ available: false });
  }
}
