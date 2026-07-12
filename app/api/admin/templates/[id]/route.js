import { getTemplate, updateTemplate, deleteTemplate } from "../../../../../lib/storage.js";

export async function GET(request, { params }) {
  const { id } = await params;
  const template = await getTemplate(id);
  if (!template) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(template);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const allowed = ["name", "destination_name", "content"];
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  try {
    const template = await updateTemplate(id, updates);
    return Response.json(template);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await deleteTemplate(id);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
