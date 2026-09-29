// Matches the three tiers described on the pricing screen (app/page.js,
// screen==="pricing"). Kept as a single source of truth so the price
// charged always matches what's advertised.
const TIERS = {
  weekend: { key: "weekend", name: "The Weekend Getaway", amountGBP: 25 },
  main: { key: "main", name: "The Main Holiday", amountGBP: 70 },
  epic: { key: "epic", name: "The Epic Adventure", amountGBP: 120 },
};

function nightsBetween(departDate, returnDate) {
  if (!departDate || !returnDate) return null;
  const ms = new Date(returnDate) - new Date(departDate);
  if (!Number.isFinite(ms) || ms <= 0) return null;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// Picks a pricing tier from the trip brief. Always the top tier, regardless
// of length, for either kind of "multi-stop" trip: more than one country
// (additionalCountries), or more than one named region within a single
// country — counting both the selected region chips (brief.regions) and
// any typed into the free-text fields (brief.specificRegions) together,
// since a customer might name "Tuscany" and "the Amalfi Coast" as free text
// just as easily as ticking two region chips. Matches the pricing page's
// "Multi-destination planning" feature under The Epic Adventure. Otherwise
// it's purely nights-based. Falls back to the middle tier when dates are
// missing/invalid, rather than guessing wrong in either direction.
export function pickPricingTier(brief = {}) {
  // specificRegions used to be a single free-text string (older enquiries,
  // submitted before it became a repeatable list) — only count it when it's
  // actually the array shape, rather than crashing on .filter().
  const specificRegions = Array.isArray(brief.specificRegions) ? brief.specificRegions : [];
  const isMultiCountry = (brief.additionalCountries || []).filter(Boolean).length > 0;
  const regionCount = (brief.regions || []).filter(Boolean).length + specificRegions.filter(Boolean).length;
  if (isMultiCountry || regionCount > 1) return TIERS.epic;

  const nights = nightsBetween(brief.departDate, brief.returnDate);
  if (nights === null) return TIERS.main;
  if (nights <= 4) return TIERS.weekend;
  if (nights <= 14) return TIERS.main;
  return TIERS.epic;
}
