import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_DIR       = path.join(process.cwd(), "data");
const ENQUIRIES_DIR  = path.join(DATA_DIR, "enquiries");
const LINKS_FILE     = path.join(DATA_DIR, "magic_links.json");

function ensureDirs() {
  fs.mkdirSync(ENQUIRIES_DIR, { recursive: true });
  if (!fs.existsSync(LINKS_FILE)) fs.writeFileSync(LINKS_FILE, "[]");
}

// ── Enquiries ────────────────────────────────────────────────────────────────

export function createEnquiry(fields) {
  ensureDirs();
  const enquiry = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...fields };
  fs.writeFileSync(path.join(ENQUIRIES_DIR, `${enquiry.id}.json`), JSON.stringify(enquiry, null, 2));
  return enquiry;
}

export function getEnquiry(id) {
  const file = path.join(ENQUIRIES_DIR, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    const content = fs.readFileSync(file, "utf8");
    return content.trim() ? JSON.parse(content) : null;
  } catch { return null; }
}

export function updateEnquiry(id, updates) {
  const enquiry = getEnquiry(id);
  if (!enquiry) throw new Error("Enquiry not found");
  const updated = { ...enquiry, ...updates };
  fs.writeFileSync(path.join(ENQUIRIES_DIR, `${enquiry.id}.json`), JSON.stringify(updated, null, 2));
  return updated;
}

export function listEnquiries() {
  ensureDirs();
  return fs
    .readdirSync(ENQUIRIES_DIR)
    .filter(f => f.endsWith(".json"))
    .flatMap(f => {
      try {
        const content = fs.readFileSync(path.join(ENQUIRIES_DIR, f), "utf8");
        return content.trim() ? [JSON.parse(content)] : [];
      } catch { return []; }
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

// ── Magic links ──────────────────────────────────────────────────────────────

function readLinks() {
  ensureDirs();
  try { return JSON.parse(fs.readFileSync(LINKS_FILE, "utf8")); }
  catch { return []; }
}

function writeLinks(links) {
  fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));
}

export function createMagicLink(email) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const links = readLinks();
  links.push({ email, token, expires_at: expiresAt, used_at: null, created_at: new Date().toISOString() });
  writeLinks(links);
  return token;
}

export function claimMagicLink(token) {
  const links = readLinks();
  const now = new Date().toISOString();
  const idx = links.findIndex(l => l.token === token && !l.used_at && l.expires_at > now);
  if (idx === -1) return null;
  links[idx].used_at = now;
  writeLinks(links);
  return links[idx];
}
