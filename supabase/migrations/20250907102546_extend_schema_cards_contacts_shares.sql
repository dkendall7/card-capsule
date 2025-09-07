-- Extend schema: cards, contacts, share_links, storage policies, optional app_events

BEGIN;

-- Ensure required extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) Extend public.cards with flexible fields (idempotent)
ALTER TABLE IF EXISTS public.cards
  ADD COLUMN IF NOT EXISTS ocr_text        text,
  ADD COLUMN IF NOT EXISTS ocr_confidence  real,
  ADD COLUMN IF NOT EXISTS tags            text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS images          jsonb  DEFAULT '[]'::jsonb;

-- 3) RLS policies on public.cards (drop/recreate by stable names)
ALTER TABLE IF EXISTS public.cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cards select own or public" ON public.cards;
CREATE POLICY "cards select own or public"
  ON public.cards
  FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "cards insert own" ON public.cards;
CREATE POLICY "cards insert own"
  ON public.cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cards update own" ON public.cards;
CREATE POLICY "cards update own"
  ON public.cards
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cards delete own" ON public.cards;
CREATE POLICY "cards delete own"
  ON public.cards
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4) Create public.contacts with owner-only RLS
CREATE TABLE IF NOT EXISTS public.contacts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text        NOT NULL,
  relationship text,
  email        text,
  phone        text,
  avatar_url   text,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE IF EXISTS public.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "contacts select own" ON public.contacts;
CREATE POLICY "contacts select own"
  ON public.contacts
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "contacts insert own" ON public.contacts;
CREATE POLICY "contacts insert own"
  ON public.contacts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "contacts update own" ON public.contacts;
CREATE POLICY "contacts update own"
  ON public.contacts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "contacts delete own" ON public.contacts;
CREATE POLICY "contacts delete own"
  ON public.contacts
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5) Create public.share_links with owner-only RLS
CREATE TABLE IF NOT EXISTS public.share_links (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type  text        NOT NULL CHECK (resource_type IN ('card', 'album')),
  resource_id    uuid        NOT NULL,
  token          text        NOT NULL UNIQUE,
  created_at     timestamptz DEFAULT now(),
  expires_at     timestamptz,
  is_active      boolean     DEFAULT true
);

ALTER TABLE IF EXISTS public.share_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "share_links select own" ON public.share_links;
CREATE POLICY "share_links select own"
  ON public.share_links
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "share_links insert own" ON public.share_links;
CREATE POLICY "share_links insert own"
  ON public.share_links
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "share_links update own" ON public.share_links;
CREATE POLICY "share_links update own"
  ON public.share_links
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6) Ensure storage RLS policies for 'cards' bucket (idempotent)
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "storage list own" ON storage.objects;
CREATE POLICY "storage list own"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'cards'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "storage upload own" ON storage.objects;
CREATE POLICY "storage upload own"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'cards'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "storage modify own" ON storage.objects;
CREATE POLICY "storage modify own"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'cards'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'cards'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 7) Optional: app_events (insert-only logging with optional user_id)
CREATE TABLE IF NOT EXISTS public.app_events (
  user_id    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  name       text,
  props      jsonb       DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE IF EXISTS public.app_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_events insert own" ON public.app_events;
CREATE POLICY "app_events insert own"
  ON public.app_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

COMMIT;
