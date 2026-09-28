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

// Picks a pricing tier from the trip brief. Multi-destination trips are
// always the top tier regardless of length, matching the pricing page's
// "Multi-destination planning" feature under The Epic Adventure; otherwise
// it's purely nights-based. Falls back to the middle tier when dates are
// missing/invalid, rather than guessing wrong in either direction.
export function pickPricingTier(brief = {}) {
  const isMultiDestination = (brief.additionalCountries || []).filter(Boolean).length > 0;
  if (isMultiDestination) return TIERS.epic;

  const nights = nightsBetween(brief.departDate, brief.returnDate);
  if (nights === null) return TIERS.main;
  if (nights <= 4) return TIERS.weekend;
  if (nights <= 14) return TIERS.main;
  return TIERS.epic;
}
