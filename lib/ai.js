import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function fmtDate(s) {
  if (!s) return "—";
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

  const prompt = `You are an expert travel planner for Jen Voyage, a premium bespoke holiday itinerary service. Your tone is warm, knowledgeable and personal.

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
${allSelected.length > 0 ? allSelected.join("\n") : "No specific items selected — use your expertise"}

RULES:
1. Group activities GEOGRAPHICALLY to minimise travel. Never put distant locations on consecutive days without a travel day.
2. Insert TRAVEL DAYS explicitly when moving between regions. Set isTravel:true for these days.
3. Match day density to pace: relaxed=1-2 activities, balanced=2-3, packed=3-4.
4. If you cannot fit everything, explain in notIncluded.
5. Suggest accommodation TYPE and area only (not specific hotels).
6. Include approximate excursion costs in GBP where known.
7. Flag advance booking with ⚠️.
8. Number of day objects must match trip duration exactly (${n || 10} days).
9. Keep morning/afternoon/evening to 2 sentences max.
10. Write whyHere region intros in a personal, opinionated tone.

Respond ONLY with this JSON, no markdown, no preamble:
{
  "title": "evocative itinerary title",
  "overview": "2-3 sentence personal trip summary addressing the customer directly",
  "regions": [{"name":"Region name","whyHere":"2-3 sentence personal explanation"}],
  "days": [{"day":1,"title":"Day title","isTravel":false,"travelNote":"","morning":"","afternoon":"","evening":"","stay":"accommodation type and area","excursions":[{"name":"name","cost":"£XX pp","bookInAdvance":false}]}],
  "costSummary": {"flights":"suggested route","accommodation":"estimated range","excursions":"estimated total","totalPerPerson":"estimated total"},
  "notIncluded": ["item — reason"],
  "bookingFlags": ["⚠️ thing to book"],
  "practicalTips": ["tip 1","tip 2","tip 3","tip 4","tip 5"],
  "alternativeOperators": ["Operator — description"]
}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  return message.content.find((b) => b.type === "text")?.text || "";
}
