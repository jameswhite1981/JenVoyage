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
                   CHECK (status IN ('pending', 'generating', 'ai_ready', 'published')),

  -- AI output (raw JSON string)
  ai_draft         TEXT,
  ai_generated_at  TIMESTAMPTZ,

  -- Jen's customised version (raw JSON string — same schema as ai_draft)
  published_content TEXT,
  published_at      TIMESTAMPTZ
);

CREATE INDEX enquiries_email_idx   ON enquiries (email);
CREATE INDEX enquiries_status_idx  ON enquiries (status);

-- Magic link tokens (single-use, 7-day expiry)
CREATE TABLE magic_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX magic_links_token_idx ON magic_links (token);

-- Revoke anonymous access — all DB access goes through the service role key on the server
REVOKE ALL ON enquiries   FROM anon, authenticated;
REVOKE ALL ON magic_links FROM anon, authenticated;
