CREATE TABLE public.site_config (
  id text PRIMARY KEY,
  barbershop_name text,
  hero_title text,
  hero_subtitle text,
  address text,
  hours_text text,
  booksy_url text,
  whatsapp_url text,
  logo_url text,
  accent_color text,
  background_color text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_config TO anon, authenticated;
GRANT ALL ON public.site_config TO service_role;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_config public read" ON public.site_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "site_config public write" ON public.site_config FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.services (
  id text PRIMARY KEY,
  name text NOT NULL,
  price text,
  time text,
  description text DEFAULT '',
  popular boolean NOT NULL DEFAULT false,
  category text NOT NULL DEFAULT 'outros',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "services public write" ON public.services FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.packages (
  id text PRIMARY KEY,
  name text NOT NULL,
  price text,
  description text DEFAULT '',
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  highlighted boolean NOT NULL DEFAULT false,
  badge_text text DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO anon, authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages public read" ON public.packages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "packages public write" ON public.packages FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.gallery (
  id text PRIMARY KEY,
  url text NOT NULL,
  title text DEFAULT '',
  category text DEFAULT 'Trabalhos',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO anon, authenticated;
GRANT ALL ON public.gallery TO service_role;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "gallery public write" ON public.gallery FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER site_config_updated_at BEFORE UPDATE ON public.site_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER gallery_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "ellite bucket read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'ellite-barberss');
CREATE POLICY "ellite bucket insert" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'ellite-barberss');
CREATE POLICY "ellite bucket update" ON storage.objects FOR UPDATE TO anon, authenticated USING (bucket_id = 'ellite-barberss') WITH CHECK (bucket_id = 'ellite-barberss');
CREATE POLICY "ellite bucket delete" ON storage.objects FOR DELETE TO anon, authenticated USING (bucket_id = 'ellite-barberss');