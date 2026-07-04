import { getEnquiry, updateEnquiry } from "../../../../../lib/storage.js";

export async function POST(request, { params }) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) return Response.json({ error: "Not found" }, { status: 404 });

  await updateEnquiry(id, {
    status: "wants_to_proceed",
    proceed_requested_at: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
