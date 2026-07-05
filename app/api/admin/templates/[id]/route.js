import { getTemplate, deleteTemplate } from "../../../../../lib/storage.js";

export async function GET(request, { params }) {
  const { id } = await params;
  const template = await getTemplate(id);
  if (!template) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(template);
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
