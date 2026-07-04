// Shared shape helpers for the itinerary JSON produced by the AI, edited by
// Jen in the admin screen, and rendered to customers (portal + PDF).
//
// Schema:
// {
//   title, intro, preTripNotes: string[],
//   flights: { outbound: Leg, internal: Leg[], return: Leg },
//   regions: [{
//     name, whyHere,
//     accommodation: { nights, note, options: [{ label, name, cost, link, recommended }] },
//     gettingThereNote,
//     days: [{ day, dateLabel, title, description, bookInAdvance, options: [{ label, cost, link }] }]
//   }],
//   costSummary: [{ label, value }],
//   alternativeOperators: string[],
//   goodToKnow: string[],
// }
// Leg = { label, date, route, cost, link }

// The model is instructed to respond with raw JSON, but occasionally wraps it
// in a markdown code fence (```json ... ```) anyway — strip that before parsing.
export function parseItineraryJSON(raw) {
  const text = String(raw ?? "").trim();
  const stripped = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(stripped);
}

// Splits free text on markdown-style links — [label](https://...) — so
// narrative fields (whyHere, day descriptions, intro, etc.) can contain a
// clickable link without needing a separate structured field. Returns a
// list of { type: "text", value } / { type: "link", label, url } segments;
// callers render each segment for their target (DOM <a> vs react-pdf <Link>).
export function linkifySegments(text) {
  if (!text) return [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const segments = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    segments.push({ type: "link", label: match[1], url: match[2] });
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
    preTripNotes: [],
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
      flights: {
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
    if (d.morning) parts.push(`Morning — ${d.morning}`);
    if (d.afternoon) parts.push(`Afternoon — ${d.afternoon}`);
    if (d.evening) parts.push(`Evening — ${d.evening}`);
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
  if (d.flights?.outbound) {
    flightItems.push({ label: legLabel(d.flights.outbound, "Outbound"), link: d.flights.outbound.link, note: d.flights.outbound.cost });
  }
  (d.flights?.internal || []).forEach((leg) => {
    flightItems.push({ label: legLabel(leg, "Internal flight"), link: leg.link, note: leg.cost });
  });
  if (d.flights?.return) {
    flightItems.push({ label: legLabel(d.flights.return, "Return"), link: d.flights.return.link, note: d.flights.return.cost });
  }
  if (flightItems.length) groups.push({ group: "Flights", items: flightItems });

  (d.regions || []).forEach((region) => {
    const accomItems = (region.accommodation?.options || [])
      .filter((o) => o.link || o.cost)
      .map((o) => ({ label: `${o.label} — ${o.name}`, link: o.link, note: o.cost, recommended: o.recommended }));
    if (accomItems.length) groups.push({ group: `${region.name} — Accommodation`, items: accomItems });

    const excursionItems = (region.days || [])
      .flatMap((day) => day.options || [])
      .filter((o) => o.link || o.cost)
      .map((o) => ({ label: o.label, link: o.link, note: o.cost }));
    if (excursionItems.length) groups.push({ group: `${region.name} — Excursions`, items: excursionItems });
  });

  return groups;
}
