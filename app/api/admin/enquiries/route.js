import { listEnquiries } from "../../../../lib/storage.js";

export async function GET() {
  try {
    const enquiries = listEnquiries().map(({ id, created_at, first_name, last_name, email, destination_name, status, published_at }) =>
      ({ id, created_at, first_name, last_name, email, destination_name, status, published_at })
    );
    return Response.json(enquiries);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
