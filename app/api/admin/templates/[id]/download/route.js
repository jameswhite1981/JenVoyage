import { getTemplate } from "../../../../../../lib/storage.js";
import { generatePdf } from "../../../../../../lib/pdf.js";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request, { params }) {
  const { id } = await params;
  const template = await getTemplate(id);
  if (!template) return new Response("Not found", { status: 404 });

  const pdfBuffer = await generatePdf(template.content, template.name);
  const filename = `${template.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-template.pdf`;

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
