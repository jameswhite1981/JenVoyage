import Anthropic from "@anthropic-ai/sdk";

// Lazy so importing this module never requires ANTHROPIC_API_KEY to be
// present — see lib/db.js for why (Next.js build-time page-data-collection).
let client;
function getClient() {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

function fmtDate(s) {
  if (!s) return "N/A";
  return new Date(s + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export async function generateItinerary(destinationName, brief) {
  const n =
    brief.departDate && brief.returnDate
      ? Math.round((new Date(brief.returnDate) - new Date(brief.departDate)) / 86400000)
      : null;
  const durStr = n ? `${n} nights` : "duration not specified";
  const allSelected = [
    ...(brief.activities || []),
    ...(brief.landmarks || []),
    ...(brief.regions || []),
  ];

  const prompt = `You are an expert travel planner for Jen Voyage, a premium bespoke holiday itinerary service. Your tone is warm, knowledgeable and personal. You are drafting a first pass that a human consultant (Jen) will refine with real flight/hotel research before it reaches the customer, so give concrete, plausible flight routes, hotel/villa-style options and costs in GBP, not vague placeholders.

CUSTOMER BRIEF:
- Destination: ${destinationName}
- Travel dates: ${fmtDate(brief.departDate)} to ${fmtDate(brief.returnDate)} (${durStr})
- Party: ${brief.adults} adult(s), ${brief.children} child(ren)
- Budget per person: £${Number(brief.budget) >= 10000 ? "10,000+" : Number(brief.budget).toLocaleString()}
- Accommodation style: ${brief.accom || "mid-range"}
- Pace preference: ${brief.pace || "balanced"}
- Dietary requirements: ${(brief.dietary || []).join(", ") || "none"}
- Accessibility needs: ${brief.accessibility || "none"}
- Additional notes: ${brief.notes || "none"}

SELECTED INTERESTS:
${allSelected.length > 0 ? allSelected.join("\n") : "No specific items selected, use your expertise"}

RULES:
1. Split the trip into 2-4 geographic regions/bases. Group activities GEOGRAPHICALLY to minimise travel.
2. Give each region 2-3 accommodation OPTIONS (mix of hotel and villa/apartment style where sensible), one marked "recommended": true. Use plausible property names and per-stay costs in GBP, not just a type/area.
3. Give real, plausible flight legs: an outbound leg, any internal/domestic legs between regions, and a return leg, each with a route, date (based on the travel dates given), and an estimated GBP cost. Leave "link" as an empty string (Jen fills in real booking links).
4. Match day density to pace: relaxed=1-2 activities, balanced=2-3, packed=3-4. Total days across all regions must equal the trip duration exactly (${n || 10} days).
5. Each day is a short narrative (2-4 sentences), not a rigid morning/afternoon/evening split. Where there's a genuine choice (e.g. two tour options, or ticket tiers), list them under that day's "options" with a cost each; otherwise leave options empty.
6. Set "bookInAdvance": true on any day where the main activity should be booked ahead (e.g. a popular sanctuary, island-hopping tour).
7. If moving between sub-locations within a region requires a ferry/transfer, note it in that region's "gettingThereNote".
8. Add "preTripNotes" only where genuinely useful for this destination (vaccinations, visas, dress codes for religious sites), omit if not relevant.
9. The "costSummary" must contain EXACTLY these six line items, in this order, and no others: "Total flights" (sum of all flight legs), "Total accommodation" (sum of the RECOMMENDED accommodation option in each region — not the other options), "Total recommended activities" (sum of the day-by-day options/excursion costs), "Total transfers" (ferries/private transfers not already counted as flights — use "£0" if none), "Overall total" (sum of the previous four), "Total per person" (overall total divided by adults + children). Every value should be a total for the whole party, not per night.
10. Suggest 2-4 "alternativeOperators": real-sounding named package tours from other operators for this destination, for comparison.
11. Write whyHere region intros in a personal, opinionated tone.
12. Never use em dashes (—) anywhere in your output. Use commas, colons, semicolons, or separate sentences instead.

Respond ONLY with this JSON, no markdown, no preamble:
{
  "title": "evocative itinerary title",
  "intro": "2-3 sentence recap of the brief addressing the customer directly, e.g. 'You asked for a trip that included X, Y, Z...'",
  "preTripNotes": ["optional note, omit array entries if not relevant"],
  "flights": {
    "outbound": {"label":"Outbound","date":"DD/MM/YYYY","route":"Origin → Destination (N stops)","cost":"£X,XXX, subject to change","link":""},
    "internal": [{"label":"Internal flight","date":"DD/MM/YYYY","route":"A → B","cost":"£XXX","link":""}],
    "return": {"label":"Return","date":"DD/MM/YYYY","route":"Destination → Origin","cost":"","link":""}
  },
  "regions": [{
    "name": "Region name",
    "whyHere": "2-3 sentence personal explanation",
    "accommodation": {
      "nights": "N nights",
      "note": "guidance on choosing between the options",
      "options": [{"label":"Option 1: Hotel","name":"Property name","cost":"£XXX","link":"","recommended":true}]
    },
    "gettingThereNote": "",
    "days": [{"day":1,"dateLabel":"1st Jan","title":"Day title","description":"2-4 sentence narrative","bookInAdvance":false,"options":[{"label":"Option name","cost":"£XX pp","link":""}]}]
  }],
  "costSummary": [
    {"label":"Total flights","value":"£X,XXX"},
    {"label":"Total accommodation","value":"£X,XXX"},
    {"label":"Total recommended activities","value":"£X,XXX"},
    {"label":"Total transfers","value":"£X,XXX"},
    {"label":"Overall total","value":"£X,XXX"},
    {"label":"Total per person","value":"£X,XXX"}
  ],
  "alternativeOperators": ["Operator: package name / description"],
  "goodToKnow": ["tip 1","tip 2","tip 3","tip 4","tip 5"]
}`;

  const stream = getClient().messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    messages: [{ role: "user", content: prompt }],
  });
  const message = await stream.finalMessage();

  if (message.stop_reason === "max_tokens") {
    throw new Error("AI response was truncated (hit max_tokens) before completing the itinerary JSON.");
  }

  return message.content.find((b) => b.type === "text")?.text || "";
}

// A short, fast teaser shown to the customer while the full itinerary above
// keeps generating in the background. Small output on a fast model — this
// should reliably complete in a few seconds, not the ~1-2 minutes the full
// itinerary takes.
export async function generateTeaser(destinationName, brief) {
  const n =
    brief.departDate && brief.returnDate
      ? Math.round((new Date(brief.returnDate) - new Date(brief.departDate)) / 86400000)
      : null;
  const durStr = n ? `${n} nights` : "duration not specified";

  const prompt = `You are an expert travel planner for Jen Voyage, a premium bespoke holiday itinerary service. Your tone is warm, knowledgeable and personal.

A customer has just submitted a brief for a trip to ${destinationName} (${fmtDate(brief.departDate)} to ${fmtDate(brief.returnDate)}, ${durStr}, ${brief.adults} adult(s) and ${brief.children || 0} child(ren), ${brief.pace || "balanced"} pace). Their full bespoke itinerary is still being prepared, your job right now is ONLY to write a short, exciting teaser to show them while they wait: a title, a 2-3 sentence personal recap of their brief, and a taste of day one.

Never use em dashes (—) anywhere in your output. Use commas, colons, semicolons, or separate sentences instead.

Respond ONLY with this JSON, no markdown, no preamble:
{
  "title": "evocative itinerary title",
  "intro": "2-3 sentence recap of the brief addressing the customer directly, e.g. 'You asked for a trip that included X, Y, Z...'",
  "day1": {"title":"Day 1 title","description":"2-3 sentence taste of day one"}
}`;

  const message = await getClient().messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 700,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content.find((b) => b.type === "text")?.text || "";
}
