// Fictional example itinerary used purely to showcase the finished product on
// the public /sample-itinerary page. Follows the same schema as a real,
// AI-generated + Jen-edited itinerary (see lib/itinerary.js) so it renders
// through the identical ItineraryDisplay component customers eventually see.
// Costs, hotel names and booking links are illustrative only — no real
// availability or pricing is implied.

export const SAMPLE_ITINERARY = {
  title: "Thailand: Islands, Jungle & Old City",
  intro: "Ten nights across three very different sides of Thailand — the temples and street food of Bangkok, the cooking classes and elephant sanctuaries of Chiang Mai, and the quieter islands of the Andaman coast. This is a sample itinerary built to show the format every Jen Voyage trip follows; your own would be shaped around your dates, group and pace.",
  preTripNotes: [
    "This is an illustrative example — costs, hotel names and booking links below are for demonstration only.",
    "A real itinerary is fully costed and includes live, working booking links for every flight, hotel and activity.",
  ],
  flights: {
    outbound: { label: "Outbound", date: "Fri 12 Jun", route: "London Heathrow (LHR) → Bangkok (BKK), direct overnight", cost: "£620pp", link: "" },
    internal: [
      { label: "Internal — Bangkok to Chiang Mai", date: "Mon 15 Jun", route: "Bangkok (DMK) → Chiang Mai (CNX)", cost: "£45pp", link: "" },
      { label: "Internal — Chiang Mai to Krabi", date: "Fri 19 Jun", route: "Chiang Mai (CNX) → Krabi (KBV), via Bangkok", cost: "£85pp", link: "" },
    ],
    return: { label: "Return", date: "Mon 22 Jun", route: "Krabi (KBV) → London Heathrow (LHR), via Bangkok", cost: "£640pp", link: "" },
  },
  regions: [
    {
      name: "Bangkok",
      whyHere: "Three nights to land, adjust, and dive into the chaos and colour of the capital — golden temples one hour, hawker-stall noodles the next.",
      accommodation: {
        nights: "3 nights",
        note: "A calm riverside base makes the heat and traffic much easier to handle.",
        options: [
          { label: "Recommended", name: "Riverside Boutique Hotel, Chao Phraya", cost: "£95/night", link: "", recommended: true },
          { label: "Alternative", name: "Old Town Heritage Guesthouse", cost: "£58/night", link: "", recommended: false },
        ],
      },
      gettingThereNote: "Private airport transfer arranged on arrival — around 45 minutes from Suvarnabhumi depending on traffic.",
      days: [
        { day: 1, dateLabel: "Fri 12 Jun", title: "Arrival & Old City orientation", description: "Land, transfer, and settle in. An easy first evening exploring the streets around your hotel and a riverside dinner to shake off the flight.", bookInAdvance: false, options: [] },
        { day: 2, dateLabel: "Sat 13 Jun", title: "Grand Palace & Wat Pho", description: "The unmissable pair — the dazzling Grand Palace complex followed by Wat Pho's Reclining Buddha. Finish with a Chao Phraya river cruise as the sun sets.", bookInAdvance: true, options: [
          { label: "Grand Palace & Wat Pho guided tour", cost: "£28pp", link: "" },
          { label: "Sunset dinner cruise, Chao Phraya", cost: "£45pp", link: "" },
        ] },
        { day: 3, dateLabel: "Sun 14 Jun", title: "Street food & Chatuchak Market", description: "A guided street-food trail through Chinatown, then the sprawling stalls of Chatuchak Weekend Market for the afternoon.", bookInAdvance: false, options: [
          { label: "Chinatown street food walking tour", cost: "£32pp", link: "" },
        ] },
      ],
    },
    {
      name: "Chiang Mai & North",
      whyHere: "A slower four nights in the north — cooking classes, an ethical elephant sanctuary, and the old walled city's temple-dense streets.",
      accommodation: {
        nights: "4 nights",
        note: "A quiet boutique stay just inside the old city walls, walkable to everything.",
        options: [
          { label: "Recommended", name: "Lanna Teak Boutique Hotel", cost: "£72/night", link: "", recommended: true },
          { label: "Alternative", name: "Riverside Eco Lodge", cost: "£54/night", link: "", recommended: false },
        ],
      },
      gettingThereNote: "Short 1hr10 domestic flight from Bangkok — internal flight details above.",
      days: [
        { day: 4, dateLabel: "Mon 15 Jun", title: "Old City temples", description: "An easy first day — Wat Chedi Luang and Wat Phra Singh, then a wander through the Sunday-style night bazaar streets.", bookInAdvance: false, options: [] },
        { day: 5, dateLabel: "Tue 16 Jun", title: "Ethical elephant sanctuary", description: "A full day at an ethical, no-riding elephant sanctuary — feeding, bathing and walking alongside rescued elephants in the jungle.", bookInAdvance: true, options: [
          { label: "Elephant sanctuary day visit", cost: "£65pp", link: "" },
        ] },
        { day: 6, dateLabel: "Wed 17 Jun", title: "Thai cooking class & local market", description: "Morning market visit to choose your own ingredients, then a hands-on Thai cooking class over a family-style lunch.", bookInAdvance: false, options: [
          { label: "Market & cooking class", cost: "£38pp", link: "" },
        ] },
        { day: 7, dateLabel: "Thu 18 Jun", title: "Doi Suthep & mountain villages", description: "Morning at the mountaintop temple of Doi Suthep for sweeping views over the city, afternoon free to relax before the flight south.", bookInAdvance: false, options: [
          { label: "Doi Suthep half-day tour", cost: "£24pp", link: "" },
        ] },
      ],
    },
    {
      name: "Andaman Coast (Koh Lanta)",
      whyHere: "Three nights to unwind before flying home — quieter and less developed than Phuket or Krabi Town, with long, near-empty beaches.",
      accommodation: {
        nights: "3 nights",
        note: "Beachfront, adults-friendly, with a strong on-site restaurant for lazy dinners.",
        options: [
          { label: "Recommended", name: "Long Beach Resort, Koh Lanta", cost: "£110/night", link: "", recommended: true },
          { label: "Alternative", name: "Old Town Seaview Bungalows", cost: "£62/night", link: "", recommended: false },
        ],
      },
      gettingThereNote: "Flight into Krabi, followed by a 2hr private transfer (including a short car ferry crossing) to Koh Lanta.",
      days: [
        { day: 8, dateLabel: "Fri 19 Jun", title: "Arrival & beach time", description: "Transfer from Krabi airport, then nothing on the agenda but the beach and the sunset.", bookInAdvance: false, options: [] },
        { day: 9, dateLabel: "Sat 20 Jun", title: "Four Islands snorkelling trip", description: "A full-day longtail boat trip to four islands around Koh Lanta — snorkelling, a lunch stop on the beach, and Emerald Cave.", bookInAdvance: true, options: [
          { label: "Four Islands boat & snorkelling tour", cost: "£42pp", link: "" },
        ] },
        { day: 10, dateLabel: "Sun 21 Jun", title: "Old Town & free day", description: "A gentle wander through Koh Lanta Old Town's stilted wooden buildings, then a free afternoon before the last night.", bookInAdvance: false, options: [] },
      ],
    },
  ],
  costSummary: [
    { label: "Total flights", value: "£1,390 (2 people)" },
    { label: "Total accommodation", value: "£1,830 (10 nights, 2 people)" },
    { label: "Total recommended activities", value: "£454 (2 people)" },
    { label: "Total transfers", value: "£180 (2 people)" },
    { label: "Overall total", value: "£3,854" },
    { label: "Total per person", value: "£1,927" },
  ],
  alternativeOperators: [
    "Trailfinders — similar Thailand multi-centre itineraries from £1,850pp",
    "Audley Travel — tailor-made Thailand trips from £2,400pp",
  ],
  goodToKnow: [
    "Visa: UK passport holders can enter Thailand visa-free for stays up to 30 days.",
    "Best time to visit: November to March is coolest and driest; June still falls before peak monsoon in most regions.",
    "Not included: travel insurance, meals outside of those listed, and personal spending.",
  ],
};
