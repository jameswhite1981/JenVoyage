import { getEnquiry, updateEnquiry } from "../../../../../lib/storage.js";

const METHODS = ["call", "whatsapp", "email"];

export async function POST(request, { params }) {
  const { id } = await params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) return Response.json({ error: "Not found" }, { status: 404 });

  const { method } = await request.json();
  if (!METHODS.includes(method)) return Response.json({ error: "Invalid method" }, { status: 400 });

  await updateEnquiry(id, {
    unsure_contact_method: method,
    unsure_requested_at: new Date().toISOString(),
  });

  return Response.json({ ok: true });
}
