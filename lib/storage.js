import crypto from "node:crypto";
import { getDb } from "./db.js";

// ── Enquiries ────────────────────────────────────────────────────────────────

export async function createEnquiry(fields) {
  const { data, error } = await getDb().from("enquiries").insert(fields).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getEnquiry(id) {
  const { data, error } = await getDb().from("enquiries").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateEnquiry(id, updates) {
  const { data, error } = await getDb().from("enquiries").update(updates).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEnquiry(id) {
  const { error } = await getDb().from("enquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function listEnquiries() {
  const { data, error } = await getDb().from("enquiries").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function listEnquiriesByEmail(email) {
  const { data, error } = await getDb()
    .from("enquiries")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

// Redacts personal data (contact details + the raw brief, which can include
// dietary/accessibility special category data) on enquiries published more
// than 30 days ago, per the privacy policy. Deliberately keyed off
// published_at, not created_at — an enquiry still being worked on must never
// have its contact details wiped out from under Jen. Keeps destination_name
// and published_content/ai_draft (the finished itinerary "template") intact,
// and revokes portal access by deleting associated magic_links — redacting
// email alone already makes listEnquiriesByEmail unable to find the
// enquiry, but removing the tokens too closes any still-valid ones.
export async function purgeExpiredPersonalData() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: expired, error } = await getDb()
    .from("enquiries")
    .select("id")
    .eq("status", "published")
    .lt("published_at", cutoff)
    .is("personal_data_purged_at", null);
  if (error) throw new Error(error.message);
  if (!expired?.length) return { purged: 0, ids: [] };

  const purgedAt = new Date().toISOString();
  for (const { id } of expired) {
    const { error: updateError } = await getDb().from("enquiries").update({
      first_name: "[redacted]",
      last_name: null,
      email: `redacted-${id}@deleted.invalid`,
      phone: null,
      referral: null,
      brief: { redacted: true },
      personal_message: null,
      unsure_contact_method: null,
      personal_data_purged_at: purgedAt,
    }).eq("id", id);
    if (updateError) throw new Error(updateError.message);

    const { error: linksError } = await getDb().from("magic_links").delete().eq("enquiry_id", id);
    if (linksError) throw new Error(linksError.message);
  }
  return { purged: expired.length, ids: expired.map((e) => e.id) };
}

// ── Itinerary templates ──────────────────────────────────────────────────────

export async function createTemplate(fields) {
  const { data, error } = await getDb().from("itinerary_templates").insert(fields).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listTemplates() {
  const { data, error } = await getDb().from("itinerary_templates").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getTemplate(id) {
  const { data, error } = await getDb().from("itinerary_templates").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTemplate(id, updates) {
  const { data, error } = await getDb().from("itinerary_templates").update(updates).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTemplate(id) {
  const { error } = await getDb().from("itinerary_templates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Magic links ──────────────────────────────────────────────────────────────

export async function createMagicLink(email, enquiryId = null) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await getDb().from("magic_links").insert({ email, token, enquiry_id: enquiryId, expires_at: expiresAt });
  if (error) throw new Error(error.message);
  return token;
}

// Best-effort lookup of which enquiry an already-used/expired token was for,
// ignoring the used_at/expires_at checks that claimMagicLink enforces — used
// only to carry trip context into a fresh "request a new link" attempt, not
// to grant access.
export async function getMagicLinkEnquiryId(token) {
  const { data, error } = await getDb().from("magic_links").select("enquiry_id").eq("token", token).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.enquiry_id ?? null;
}

export async function claimMagicLink(token) {
  const nowIso = new Date().toISOString();
  const { data, error } = await getDb()
    .from("magic_links")
    .select("*")
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", nowIso)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const { error: claimError } = await getDb().from("magic_links").update({ used_at: nowIso }).eq("id", data.id);
  if (claimError) throw new Error(claimError.message);
  return data;
}
