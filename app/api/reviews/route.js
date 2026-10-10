import { createReview } from "../../../lib/storage.js";

export async function POST(request) {
  const { name, quote, rating, trip } = await request.json().catch(() => ({}));

  if (!name?.trim() || !quote?.trim()) {
    return Response.json({ error: "Please fill in your name and review." }, { status: 400 });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return Response.json({ error: "Please choose a rating from 1 to 5." }, { status: 400 });
  }

  try {
    // approved_at stays null — a human (Jen) approves it from /admin/reviews
    // before it's shown publicly.
    await createReview({ name: name.trim(), quote: quote.trim(), rating: ratingNum, trip: trip?.trim() || null });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[reviews] failed to save submission —", err?.message || err);
    return Response.json({ error: "Could not submit your review. Please try again." }, { status: 500 });
  }
}
