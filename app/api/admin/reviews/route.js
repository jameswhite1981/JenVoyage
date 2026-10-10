import { listAllReviews } from "../../../../lib/storage.js";

export async function GET() {
  const reviews = await listAllReviews();
  return Response.json(reviews);
}
