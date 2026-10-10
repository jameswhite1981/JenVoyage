import { approveReview, deleteReview } from "../../../../../lib/storage.js";

export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const review = await approveReview(id);
    return Response.json(review);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await deleteReview(id);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
