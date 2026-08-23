import { purgeExpiredPersonalData } from "../../../../lib/storage.js";

// Triggered daily by Vercel Cron (see vercel.json). Vercel automatically
// sends `Authorization: Bearer $CRON_SECRET` on cron-triggered requests when
// that env var is set — checked here so this endpoint can't be used to
// force a purge run from outside Vercel's scheduler.
export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await purgeExpiredPersonalData();
  return Response.json(result);
}
