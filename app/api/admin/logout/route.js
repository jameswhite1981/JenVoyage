import { clearSession } from "../../../../lib/session.js";

export async function POST() {
  await clearSession();
  return Response.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL));
}
