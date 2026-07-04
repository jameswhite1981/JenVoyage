import { getEnquiry, updateEnquiry } from "../../../../../lib/storage.js";

export async function GET(request, { params }) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(enquiry);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const allowed = ["published_content", "status", "published_at"];
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  try {
    await updateEnquiry(id, updates);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
