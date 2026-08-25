// Shared shape helpers for the itinerary JSON produced by the AI, edited by
// Jen in the admin screen, and rendered to customers (portal + PDF).
//
// Schema:
// {
//   title, intro, preTripNotes: string[],
//   flights: { outbound: Leg, internal: Leg[], return: Leg },
//   regions: [{
//     name, whyHere,
//     accommodation: { nights, note, options: [{ label, name, cost, link, rating }] },
//     gettingThereNote,
//     days: [{ day, dateLabel, title, description, bookInAdvance, options: [{ label, cost, link }] }]
//   }],
//   costSummary: [{ label, value }],
//   alternativeOperators: string[],
//   goodToKnow: string[],
// }
// Leg = { label, date, route, cost, link }

// Shared star-icon path (Material Design's "star", 24x24 viewBox) and rating
// helper, used to draw identical vector star icons on both the web itinerary
// and the PDF — avoids relying on any font's glyph coverage (Helvetica, the
// PDF's base font, has no ★ character at all).
export const STAR_PATH = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

// Just the left half of the same star (traced along its vertical axis of
// symmetry, x=12), painted over a full STAR_PATH to render a "half" star.
// Deliberately not using SVG clipPath for this: react-pdf accepts a
// clipPath prop without error, but doesn't actually apply it — verified by
// inspecting a generated PDF's content stream, which had zero clip regions
// sized for it. A literal half-shaped path uses the same plain fill
// mechanism that already works for the full/empty stars.
export const STAR_PATH_LEFT_HALF = "M12 17.27L5.82 21L7.46 13.97L2 9.24L9.19 8.63L12 2Z";

// Returns 5 entries of "full" | "half" | "empty" for a 0-5 rating, or an
// empty array if there's no valid rating to show.
export function starStates(value, max = 5) {
  const v = Number(value);
  if (!Number.isFinite(v) || v <= 0) return [];
  const clamped = Math.min(v, max);
  const states = [];
  for (let i = 1; i <= max; i++) {
    if (clamped >= i) states.push("full");
    else if (clamped >= i - 0.5) states.push("half");
    else states.push("empty");
  }
  return states;
}

// The model is instructed to respond with raw JSON, but occasionally wraps it
// in a markdown code fence (```json ... ```) anyway — strip that before parsing.
export function parseItineraryJSON(raw) {
  const text = String(raw ?? "").trim();
  const stripped = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(stripped);
}

// Splits free text on markdown-style links — [label](https://...) — and
// bold — **text** — so narrative fields (whyHere, day descriptions, intro,
// pre-trip notes, etc.) can contain a clickable link or emphasis without
// needing separate structured fields. Returns a list of
// { type: "text", value } / { type: "link", label, url } / { type: "bold", value }
// segments; callers render each segment for their target (DOM vs react-pdf).
export function linkifySegments(text) {
  if (!text) return [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*/g;
  const segments = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    if (match[1] !== undefined) {
      segments.push({ type: "link", label: match[1], url: match[2] });
    } else {
      segments.push({ type: "bold", value: match[3] });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) segments.push({ type: "text", value: text.slice(lastIndex) });
  return segments;
}

export function emptyLeg() {
  return { label: "", date: "", route: "", cost: "", link: "" };
}

export function emptyItinerary() {
  return {
    title: "",
    intro: "",
    preTripNotes: ["Visa requirements: ", "Vaccinations: ", "Dress code for religious sites: "],
    flights: { outbound: emptyLeg(), internal: [], return: emptyLeg() },
    regions: [],
    costSummary: [],
    alternativeOperators: [],
    goodToKnow: [],
  };
}

const OLD_COST_LABELS = {
  flights: "Flights (estimated)",
  accommodation: "Accommodation (estimated)",
  excursions: "Excursions (estimated)",
  totalPerPerson: "Total per person (estimated)",
};

// Older drafts (generated before the flights/regions/day-by-day rewrite) used
// a flatter shape: top-level `days`, `overview` instead of `intro`, and a
// `costSummary` object instead of an ordered list. Detect that shape and
// migrate it into the current schema so existing drafts don't crash the
// editor or silently lose content.
function isOldSchema(raw) {
  return Array.isArray(raw?.days) || (raw?.costSummary && !Array.isArray(raw.costSummary));
}

export function normalizeItinerary(raw) {
  if (!raw) return null;

  if (!isOldSchema(raw)) {
    return {
      title: raw.title || "",
      intro: raw.intro || raw.overview || "",
      preTripNotes: Array.isArray(raw.preTripNotes) ? raw.preTripNotes : [],
      // null means "explicitly removed" (e.g. a trip that doesn't need
      // flights) and must stay null — only a genuinely missing/undefined
      // flights key gets the empty-leg placeholders, so a brand new or
      // AI-generated draft still has fields for Jen to fill in.
      flights: raw.flights === null ? null : {
        outbound: raw.flights?.outbound || emptyLeg(),
        internal: Array.isArray(raw.flights?.internal) ? raw.flights.internal : [],
        return: raw.flights?.return || emptyLeg(),
      },
      regions: Array.isArray(raw.regions) ? raw.regions.map((r) => ({
        name: r.name || "",
        whyHere: r.whyHere || "",
        accommodation: {
          nights: r.accommodation?.nights || "",
          note: r.accommodation?.note || "",
          options: Array.isArray(r.accommodation?.options) ? r.accommodation.options : [],
        },
        gettingThereNote: r.gettingThereNote || "",
        days: Array.isArray(r.days) ? r.days : [],
      })) : [],
      costSummary: Array.isArray(raw.costSummary) ? raw.costSummary : [],
      alternativeOperators: Array.isArray(raw.alternativeOperators) ? raw.alternativeOperators : [],
      goodToKnow: Array.isArray(raw.goodToKnow) ? raw.goodToKnow : [],
    };
  }

  const days = (raw.days || []).map((d) => {
    const parts = [];
    if (d.isTravel && d.travelNote) parts.push(d.travelNote);
    if (d.morning) parts.push(`Morning: ${d.morning}`);
    if (d.afternoon) parts.push(`Afternoon: ${d.afternoon}`);
    if (d.evening) parts.push(`Evening: ${d.evening}`);
    return {
      day: d.day,
      dateLabel: "",
      title: d.title || "",
      description: parts.join(" "),
      bookInAdvance: (d.excursions || []).some((e) => e.bookInAdvance),
      options: (d.excursions || []).map((e) => ({ label: e.name || "", cost: e.cost || "", link: "" })),
    };
  });

  const regions = (raw.regions || []).map((r) => ({
    name: r.name || "",
    whyHere: r.whyHere || "",
    accommodation: { nights: "", note: "", options: [] },
    gettingThereNote: "",
    days: [],
  }));
  // The old schema never linked a day to a specific region, so the migrated
  // day-by-day goes into one trailing region rather than being guessed at.
  if (days.length) {
    regions.push({
      name: regions.length ? "Day by day" : (raw.title || "Your trip"),
      whyHere: "",
      accommodation: { nights: "", note: "", options: [] },
      gettingThereNote: "",
      days,
    });
  }

  const costSummary = raw.costSummary && typeof raw.costSummary === "object"
    ? Object.entries(raw.costSummary)
        .filter(([, v]) => v)
        .map(([k, v]) => ({ label: OLD_COST_LABELS[k] || k, value: v }))
    : [];

  const goodToKnow = [
    ...(raw.practicalTips || []),
    ...(raw.bookingFlags || []),
    ...(raw.notIncluded || []).map((n) => `Not included: ${n}`),
  ];

  return {
    title: raw.title || "",
    intro: raw.overview || raw.intro || "",
    preTripNotes: [],
    flights: { outbound: emptyLeg(), internal: [], return: emptyLeg() },
    regions,
    costSummary,
    alternativeOperators: Array.isArray(raw.alternativeOperators) ? raw.alternativeOperators : [],
    goodToKnow,
  };
}

// Rolls up every link-bearing item (flights, accommodation, excursions) into
// grouped sections for the "Quick Reference" appendix, so Jen only has to
// enter each link once and it's reused everywhere it's shown.
export function buildQuickLinks(d) {
  if (!d) return [];
  const groups = [];

  const flightItems = [];
  const legLabel = (leg, fallback) => leg?.label || fallback;
  if (d.flights?.outbound?.link || d.flights?.outbound?.cost) {
    flightItems.push({ label: legLabel(d.flights.outbound, "Outbound"), link: d.flights.outbound.link, note: d.flights.outbound.cost });
  }
  (d.flights?.internal || []).filter((leg) => leg.link || leg.cost).forEach((leg) => {
    flightItems.push({ label: "Internal flight", link: leg.link, note: leg.cost });
  });
  if (d.flights?.return?.link || d.flights?.return?.cost) {
    flightItems.push({ label: legLabel(d.flights.return, "Return"), link: d.flights.return.link, note: d.flights.return.cost });
  }
  if (flightItems.length) groups.push({ group: "Flights", items: flightItems });

  (d.regions || []).forEach((region) => {
    const accomItems = (region.accommodation?.options || [])
      .filter((o) => o.link || o.cost)
      .map((o) => ({ label: `${o.label}: ${o.name}`, link: o.link, note: o.cost }));
    if (accomItems.length) groups.push({ group: `${region.name}: Accommodation`, items: accomItems });

    const excursionItems = (region.days || [])
      .flatMap((day) => day.options || [])
      .filter((o) => o.link || o.cost)
      .map((o) => ({ label: o.label, link: o.link, note: o.cost }));
    if (excursionItems.length) groups.push({ group: `${region.name}: Excursions`, items: excursionItems });
  });

  return groups;
}
