-- ============================================================
-- Portfolio Supabase Schema  (with RBAC)
-- Run this ONCE in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Profiles ────────────────────────────────────────────────
-- Stores a role for every auth.users entry.
-- Trigger auto-creates a row on sign-up with role = 'viewer'.
-- Must be created BEFORE is_admin() which references it.
CREATE TABLE IF NOT EXISTS public.profiles (
  id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role  TEXT NOT NULL DEFAULT 'viewer'
    CHECK (role IN ('admin', 'editor', 'viewer'))
);

-- ── Helper: is_admin() ──────────────────────────────────────
-- Returns TRUE when the current JWT user has role = 'admin'.
-- Defined AFTER profiles so the relation exists.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- Authenticated users can insert their OWN profile row with role = 'viewer' only
-- (cannot self-promote to admin/editor)
CREATE POLICY "Users insert own viewer profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() AND role = 'viewer');

-- Only admins can update any profile (role assignment)
CREATE POLICY "Admins update profiles"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Auto-create profile on new user sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'viewer');
  RETURN NEW;
END;
$$;

-- Only create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;

-- ── Projects ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT        UNIQUE NOT NULL,
  number      TEXT        DEFAULT '',
  title       TEXT        NOT NULL,
  description TEXT        DEFAULT '',
  tags        TEXT[]      DEFAULT '{}',
  problem     TEXT        DEFAULT '',
  approach    TEXT        DEFAULT '',
  outcome     TEXT        DEFAULT '',
  links       JSONB       DEFAULT '{"github":"","live":""}',
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Blogs ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT        UNIQUE NOT NULL,
  date        TEXT        DEFAULT '',
  read_time   TEXT        DEFAULT '5 min read',
  title       TEXT        NOT NULL,
  excerpt     TEXT        DEFAULT '',
  content     JSONB       DEFAULT '[]',
  sort_order  INTEGER     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs    ENABLE ROW LEVEL SECURITY;

-- Anyone can read (portfolio visitors) — drop first so re-runs are idempotent
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
DROP POLICY IF EXISTS "Public read blogs"    ON public.blogs;

CREATE POLICY "Public read projects"
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Public read blogs"
  ON public.blogs FOR SELECT USING (true);

-- Drop old write policies before re-creating (idempotent)
DROP POLICY IF EXISTS "Admin insert projects"  ON public.projects;
DROP POLICY IF EXISTS "Admin update projects"  ON public.projects;
DROP POLICY IF EXISTS "Admin delete projects"  ON public.projects;
DROP POLICY IF EXISTS "Admin insert blogs"     ON public.blogs;
DROP POLICY IF EXISTS "Admin update blogs"     ON public.blogs;
DROP POLICY IF EXISTS "Admin delete blogs"     ON public.blogs;

-- Only admins can write
CREATE POLICY "Admin insert projects"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update projects"
  ON public.projects FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin delete projects"
  ON public.projects FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin insert blogs"
  ON public.blogs FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update blogs"
  ON public.blogs FOR UPDATE TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin delete blogs"
  ON public.blogs FOR DELETE TO authenticated
  USING (public.is_admin());


-- ── Seed data ───────────────────────────────────────────────
INSERT INTO public.projects (slug, number, title, description, tags, problem, approach, outcome, links, sort_order)
VALUES
  (
    'coming-soon-1', '01', 'Coming Soon',
    'A detailed case study of a project highlighting the problem, process, and solution.',
    ARRAY['Spring Boot', 'Angular'], '', '', '',
    '{"github":"","live":""}', 1
  ),
  (
    'coming-soon-2', '02', 'Coming Soon',
    'Another project showcasing full-stack skills and design thinking approach.',
    ARRAY['React', 'Node.js'], '', '', '',
    '{"github":"","live":""}', 2
  ),
  (
    'coming-soon-3', '03', 'Coming Soon',
    'A personal side project exploring interaction design and user experience.',
    ARRAY['Next.js', 'UX Design'], '', '', '',
    '{"github":"","live":""}', 3
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blogs (slug, date, read_time, title, excerpt, content, sort_order)
VALUES
  (
    'good-enough-ux', 'Coming Soon', '5 min read',
    'Why "Good Enough" UX Isn''t Good Enough',
    'Thoughts on why settling for functional-but-forgettable interfaces is a missed opportunity...',
    '[
      {"type":"heading","text":"Introduction"},
      {"type":"paragraph","text":"This is a placeholder for the full blog post. The complete article will explore this topic in depth, sharing insights from real-world experience and practical examples."},
      {"type":"heading","text":"Key Insights"},
      {"type":"paragraph","text":"Coming soon — this section will dive into the core ideas, backed by examples and lessons learned from building real products."},
      {"type":"quote","text":"\"Good design is obvious. Great design is transparent.\" — Joe Sparano"},
      {"type":"heading","text":"Conclusion"},
      {"type":"paragraph","text":"The full article will wrap up with actionable takeaways and reflections. Stay tuned for the complete piece."}
    ]'::jsonb,
    1
  ),
  (
    'backend-to-frontend-journey', 'Coming Soon', '4 min read',
    'From Spring Boot to Next.js: A Backend Dev''s Frontend Journey',
    'What happens when a Java developer falls in love with the frontend ecosystem...',
    '[
      {"type":"heading","text":"Introduction"},
      {"type":"paragraph","text":"This is a placeholder for the full blog post. The complete article will explore this topic in depth, sharing insights from real-world experience and practical examples."},
      {"type":"heading","text":"Key Insights"},
      {"type":"paragraph","text":"Coming soon — this section will dive into the core ideas, backed by examples and lessons learned from building real products."},
      {"type":"quote","text":"\"Good design is obvious. Great design is transparent.\" — Joe Sparano"},
      {"type":"heading","text":"Conclusion"},
      {"type":"paragraph","text":"The full article will wrap up with actionable takeaways and reflections. Stay tuned for the complete piece."}
    ]'::jsonb,
    2
  ),
  (
    'design-school-never-attended', 'Coming Soon', '6 min read',
    'The Design School I Never Attended',
    'How an almost-decision shaped my approach to building software...',
    '[
      {"type":"heading","text":"Introduction"},
      {"type":"paragraph","text":"This is a placeholder for the full blog post. The complete article will explore this topic in depth, sharing insights from real-world experience and practical examples."},
      {"type":"heading","text":"Key Insights"},
      {"type":"paragraph","text":"Coming soon — this section will dive into the core ideas, backed by examples and lessons learned from building real products."},
      {"type":"quote","text":"\"Good design is obvious. Great design is transparent.\" — Joe Sparano"},
      {"type":"heading","text":"Conclusion"},
      {"type":"paragraph","text":"The full article will wrap up with actionable takeaways and reflections. Stay tuned for the complete piece."}
    ]'::jsonb,
    3
  )
ON CONFLICT (slug) DO NOTHING;


-- ════════════════════════════════════════════════════════════
-- MANUAL STEPS AFTER RUNNING THIS SQL:
-- ════════════════════════════════════════════════════════════
--
-- 1. Log in to the app at /admin. Login will succeed. You will
--    see an "Admin role required" screen that shows your UUID
--    and a pre-filled SQL snippet. Copy that SQL and run it here
--    OR run the INSERT below manually:
--
--    INSERT INTO public.profiles (id, role)
--    VALUES ('<YOUR_USER_UUID>', 'admin')
--    ON CONFLICT (id) DO UPDATE SET role = 'admin';
--
--    Find your UUID in:
--    Supabase Dashboard → Authentication → Users → click user → copy UUID
--
-- 2. Refresh the /admin page — you will now have full access.
--
-- 3. If you already ran a previous version of this schema,
--    also apply the patch below (adds the missing INSERT policy):
--
--    CREATE POLICY "Users insert own viewer profile"
--      ON public.profiles FOR INSERT TO authenticated
--      WITH CHECK (id = auth.uid() AND role = 'viewer');
--
-- ════════════════════════════════════════════════════════════


-- ════════════════════════════════════════════════════════════
-- USER MANAGEMENT MIGRATION
-- Run this AFTER the initial schema above.
-- Adds columns/ policies/ functions needed by the Admin → Users page.
-- ════════════════════════════════════════════════════════════

-- 1. Add new columns to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email        TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS permissions  JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at   TIMESTAMPTZ DEFAULT now();

-- 2. Back-fill email for existing rows from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- 3. Update trigger to also copy email on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer');
  RETURN NEW;
END;
$$;

-- 4. Admin can read ALL profiles (existing policy only allows own row)
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;
CREATE POLICY "Admins read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- 5. Admin can delete any profile
DROP POLICY IF EXISTS "Admins delete profiles" ON public.profiles;
CREATE POLICY "Admins delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

-- 6. RPC: Create a new user (admin only)
--    Inserts into auth.users + auth.identities, then updates the profile.
CREATE OR REPLACE FUNCTION public.admin_create_user(
  p_email        TEXT,
  p_password     TEXT,
  p_display_name TEXT DEFAULT '',
  p_role         TEXT DEFAULT 'viewer',
  p_permissions  JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  new_id UUID;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  new_id := gen_random_uuid();

  -- Create auth user
  INSERT INTO auth.users (
    id, instance_id, aud, role,
    email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    new_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('display_name', p_display_name),
    NOW(), NOW()
  );

  -- Create email identity (required for email/password login)
  INSERT INTO auth.identities (
    id, user_id, provider_id, identity_data,
    provider, last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_id, p_email,
    jsonb_build_object('sub', new_id::text, 'email', p_email),
    'email', NOW(), NOW(), NOW()
  );

  -- The trigger auto-creates a profile row; now update it
  UPDATE public.profiles
  SET role         = p_role,
      display_name = COALESCE(p_display_name, ''),
      permissions  = COALESCE(p_permissions, '{}'::jsonb)
  WHERE id = new_id;

  RETURN new_id;
END;
$$;

-- 7. RPC: Delete a user (admin only, cascades from auth → profiles)
CREATE OR REPLACE FUNCTION public.admin_delete_user(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;

  DELETE FROM auth.users WHERE id = p_user_id;
END;
$$;
