import crypto from "node:crypto";
import { db } from "./db.js";

// ── Enquiries ────────────────────────────────────────────────────────────────

export async function createEnquiry(fields) {
  const { data, error } = await db.from("enquiries").insert(fields).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getEnquiry(id) {
  const { data, error } = await db.from("enquiries").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateEnquiry(id, updates) {
  const { data, error } = await db.from("enquiries").update(updates).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listEnquiries() {
  const { data, error } = await db.from("enquiries").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function listEnquiriesByEmail(email) {
  const { data, error } = await db
    .from("enquiries")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

// ── Magic links ──────────────────────────────────────────────────────────────

export async function createMagicLink(email) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await db.from("magic_links").insert({ email, token, expires_at: expiresAt });
  if (error) throw new Error(error.message);
  return token;
}

export async function claimMagicLink(token) {
  const nowIso = new Date().toISOString();
  const { data, error } = await db
    .from("magic_links")
    .select("*")
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", nowIso)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const { error: claimError } = await db.from("magic_links").update({ used_at: nowIso }).eq("id", data.id);
  if (claimError) throw new Error(claimError.message);
  return data;
}
