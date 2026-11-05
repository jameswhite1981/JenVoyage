import { markDealCheckHandled } from "../../../../../lib/storage.js";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const { handled } = await request.json();
  try {
    const dealCheck = await markDealCheckHandled(id, handled);
    return Response.json(dealCheck);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
