import { getDealCheck, markDealCheckHandled, updateDealCheck, deleteDealCheck } from "../../../../../lib/storage.js";

export async function GET(request, { params }) {
  const { id } = await params;
  const dealCheck = await getDealCheck(id);
  if (!dealCheck) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(dealCheck);
}

// Used both by the list page's quick "Mark handled" toggle ({ handled }) and
// the response editor's "Save draft" ({ response_links, response_message }),
// so the editor can be saved without publishing/emailing the customer yet.
export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  try {
    if (typeof body.handled === "boolean" && Object.keys(body).length === 1) {
      const dealCheck = await markDealCheckHandled(id, body.handled);
      return Response.json(dealCheck);
    }
    const allowed = ["response_links", "response_message", "response_total_cost", "response_per_person_cost", "response_amount_saved", "response_verdict"];
    const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
    const dealCheck = await updateDealCheck(id, updates);
    return Response.json(dealCheck);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await deleteDealCheck(id);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
