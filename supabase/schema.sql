-- Jen Voyage — Supabase schema
-- Run this in the Supabase SQL editor at: https://supabase.com/dashboard/project/_/sql

CREATE TABLE enquiries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Customer
  first_name       TEXT NOT NULL,
  last_name        TEXT,
  email            TEXT NOT NULL,
  phone            TEXT,
  referral         TEXT,

  -- Trip brief (full form payload stored as JSON)
  brief            JSONB NOT NULL,
  destination_name TEXT NOT NULL,

  -- Workflow
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'generating', 'ai_ready', 'wants_to_proceed', 'published')),

  -- Fast teaser shown to the customer while the full itinerary generates (raw JSON string)
  teaser              TEXT,
  teaser_generated_at TIMESTAMPTZ,

  -- AI output (raw JSON string)
  ai_draft         TEXT,
  ai_generated_at  TIMESTAMPTZ,

  -- Set when the customer clicks "proceed to payment" on the preview
  proceed_requested_at TIMESTAMPTZ,

  -- The customer's required choice, shown before payment, between waiving
  -- their EU 14-day cooling-off/cancellation right (in exchange for
  -- starting work and delivering within 48 hours) or keeping that right
  -- and waiting the full 14 days.
  cancellation_choice    TEXT CHECK (cancellation_choice IN ('waive_48h', 'wait_14_days')),
  cancellation_consent_at TIMESTAMPTZ,

  -- Set when the customer isn't sure and asks Jen to reach out instead —
  -- contacted using the phone/email already given above, not a new address
  unsure_contact_method TEXT CHECK (unsure_contact_method IN ('call', 'whatsapp', 'email')),
  unsure_requested_at   TIMESTAMPTZ,

  -- Jen's customised version (raw JSON string — same schema as ai_draft)
  published_content TEXT,
  published_at      TIMESTAMPTZ,

  -- Personal note from Jen included in the itinerary-ready email, editable
  -- and reused if that email is resent
  personal_message  TEXT,

  -- Set once the 30-day-after-publish purge (see lib/storage.js
  -- purgeExpiredPersonalData) has redacted this enquiry's personal data —
  -- prevents reprocessing and gives an audit trail of when it happened.
  personal_data_purged_at TIMESTAMPTZ,

  -- Set by the Stripe webhook (app/api/stripe/webhook) once Checkout
  -- confirms payment — never by the success page, which isn't a
  -- reliable signal on its own. amount_paid is in pence (Stripe's own unit).
  paid_at           TIMESTAMPTZ,
  stripe_session_id TEXT,
  amount_paid       INTEGER
);

CREATE INDEX enquiries_email_idx   ON enquiries (email);
CREATE INDEX enquiries_status_idx  ON enquiries (status);

-- Magic link tokens (single-use, 7-day expiry)
CREATE TABLE magic_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  -- Which trip this link should open on arrival — a customer can have
  -- several enquiries under one email, so the email address alone isn't
  -- enough to know which itinerary to show. Nullable: the customer's own
  -- "send me a login link" flow doesn't know which trip they mean either,
  -- and just falls back to listing all of them.
  enquiry_id  UUID REFERENCES enquiries(id),
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX magic_links_token_idx ON magic_links (token);

-- Reusable itinerary templates, saved by Jen from a published enquiry so a
-- similar future trip can start from a fleshed-out draft instead of blank.
CREATE TABLE itinerary_templates (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  destination_name TEXT,
  content          TEXT NOT NULL,  -- raw JSON string — same schema as ai_draft/published_content
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customer-submitted reviews, shown on /reviews once Jen approves them —
-- public submission but moderated, so nothing fake or abusive goes live
-- unreviewed. Not linked to an enquiry: review submission has no login, so
-- there's nothing reliable to key it to.
CREATE TABLE reviews (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  name             TEXT NOT NULL,
  quote            TEXT NOT NULL,
  rating           INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  trip             TEXT,  -- optional free text, e.g. "Thailand, family of four, 10 nights"
  approved_at      TIMESTAMPTZ
);

CREATE INDEX reviews_approved_idx ON reviews (approved_at);

-- Revoke anonymous access — all DB access goes through the service role key on the server
REVOKE ALL ON enquiries           FROM anon, authenticated;
REVOKE ALL ON magic_links         FROM anon, authenticated;
REVOKE ALL ON itinerary_templates FROM anon, authenticated;
REVOKE ALL ON reviews             FROM anon, authenticated;

-- Enable RLS with no policies — hard default-deny for anon/authenticated.
-- The server-side service role key bypasses RLS entirely, so the app is
-- unaffected; this only protects against future accidental exposure
-- (e.g. a client-side Supabase call, or a grant added later).
ALTER TABLE enquiries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_links          ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_templates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews              ENABLE ROW LEVEL SECURITY;
