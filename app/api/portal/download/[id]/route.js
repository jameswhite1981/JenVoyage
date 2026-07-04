import { getSession } from "../../../../../lib/session.js";
import { db } from "../../../../../lib/db.js";
import { generatePdf } from "../../../../../lib/pdf.js";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request, { params }) {
  const session = await getSession();
  if (!session || session.role !== "user") {
    return new Response("Unauthorised", { status: 401 });
  }

  const { id } = await params;
  const { data: enquiry, error } = await db
    .from("enquiries")
    .select("first_name, destination_name, published_content, status, email")
    .eq("id", id)
    .single();

  if (error || !enquiry) return new Response("Not found", { status: 404 });
  if (enquiry.email !== session.email) return new Response("Forbidden", { status: 403 });
  if (enquiry.status !== "published" || !enquiry.published_content) {
    return new Response("Itinerary not yet published", { status: 404 });
  }

  const pdfBuffer = await generatePdf(enquiry.published_content, enquiry.first_name);
  const filename = `${enquiry.destination_name.toLowerCase().replace(/\s+/g, "-")}-itinerary.pdf`;

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
