import { listDealChecks } from "../../../../lib/storage.js";

export async function GET() {
  const dealChecks = await listDealChecks();
  return Response.json(dealChecks);
}
