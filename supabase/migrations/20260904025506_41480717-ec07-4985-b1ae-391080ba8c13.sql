-- Roles infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users can read own roles" ON public.user_roles;
CREATE POLICY "users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;

-- Lock down content tables: public read stays, writes admin-only
DROP POLICY IF EXISTS "site_config public write" ON public.site_config;
DROP POLICY IF EXISTS "services public write" ON public.services;
DROP POLICY IF EXISTS "packages public write" ON public.packages;
DROP POLICY IF EXISTS "gallery public write" ON public.gallery;

CREATE POLICY "site_config admin write" ON public.site_config
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "services admin write" ON public.services
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "packages admin write" ON public.packages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "gallery admin write" ON public.gallery
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

REVOKE INSERT, UPDATE, DELETE ON public.site_config, public.services, public.packages, public.gallery FROM anon;

-- Storage: read stays, writes admin-only
DROP POLICY IF EXISTS "ellite bucket insert" ON storage.objects;
DROP POLICY IF EXISTS "ellite bucket update" ON storage.objects;
DROP POLICY IF EXISTS "ellite bucket delete" ON storage.objects;

CREATE POLICY "ellite bucket admin insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'ellite-barberss' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ellite bucket admin update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'ellite-barberss' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'ellite-barberss' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "ellite bucket admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'ellite-barberss' AND public.has_role(auth.uid(), 'admin'));