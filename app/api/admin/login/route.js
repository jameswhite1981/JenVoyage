import { createSession } from "../../../../lib/session.js";

export async function POST(request) {
  const { password } = await request.json();
  const base = process.env.NEXT_PUBLIC_BASE_URL;

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  await createSession("admin", "admin");
  return Response.json({ ok: true });
}
