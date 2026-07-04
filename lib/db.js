import { createClient } from "@supabase/supabase-js";

// Lazily instantiated so importing this module never requires the env vars
// to be present — only calling getDb() at request time does. Without this,
// Next.js's build-time page-data-collection step (which evaluates the route
// module graph) fails if the vars aren't visible in that build environment,
// even though no request has actually happened yet.
let client;

export function getDb() {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  }
  return client;
}
