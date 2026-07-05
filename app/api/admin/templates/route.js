import { createTemplate, listTemplates } from "../../../../lib/storage.js";

export async function GET() {
  const templates = await listTemplates();
  return Response.json(templates);
}

export async function POST(request) {
  const body = await request.json();
  const { name, destinationName, content } = body;
  if (!name || !content) return Response.json({ error: "Missing name or content" }, { status: 400 });
  try {
    const template = await createTemplate({ name, destination_name: destinationName || null, content });
    return Response.json(template);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
