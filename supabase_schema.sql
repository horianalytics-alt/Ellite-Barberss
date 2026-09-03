-- ==============================================================================
-- SCHEMA SUPABASE: ELLITE BARBERSS
-- Execute este script no SQL Editor do seu projeto Supabase
-- (Painel do Supabase -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. Tabela de Configurações do Site
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  barbershop_name TEXT NOT NULL DEFAULT 'ELLITE BARBERSS',
  hero_title TEXT NOT NULL DEFAULT 'Tradição e estilo no mesmo lugar',
  hero_subtitle TEXT NOT NULL DEFAULT 'Cortes masculinos e barba em Arujá-SP',
  address TEXT NOT NULL DEFAULT 'Rua Prudente de Moraes, N10, Arujá-SP',
  address_complement TEXT DEFAULT '(Loja de frente para a rua)',
  hours_text TEXT NOT NULL DEFAULT 'Segunda a Sexta: 09h às 20h\nSábado: 09h às 19h\nDomingo: 10h às 15h',
  phone_text TEXT DEFAULT '(11) 96485-2627',
  booksy_url TEXT NOT NULL DEFAULT 'https://booksy.com/widget-2024/index.html?realm=instagram&country=br&language=pt&fingerprint=cc34af3d-7dd2-4f4a-a3be-e3670f4eff74&channel=156ce701-bd15-4539-a838-e48841087851&id=395022&ba_s=Undefined',
  whatsapp_url TEXT NOT NULL DEFAULT 'https://wa.me/5511934706817?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Ellite%20Barberss.',
  google_maps_url TEXT DEFAULT 'https://maps.google.com/?q=Rua+Prudente+de+Morais,+10+-+Vila+Flora+Regina,+Arujá+-+SP',
  google_maps_embed_url TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  accent_color TEXT NOT NULL DEFAULT '#C9A84C',
  background_color TEXT NOT NULL DEFAULT '#0a0a0a',
  about_images JSONB NOT NULL DEFAULT '["https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Garantir colunas caso a tabela já exista
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS address_complement TEXT DEFAULT '(Loja de frente para a rua)';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS phone_text TEXT DEFAULT '(11) 96485-2627';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS google_maps_url TEXT DEFAULT '';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS google_maps_embed_url TEXT DEFAULT '';
ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS about_images JSONB DEFAULT '["https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80"]'::jsonb;

-- Populate about_images for rows that already exist with NULL or empty value
UPDATE public.site_config
SET about_images = '["https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80"]'::jsonb
WHERE about_images IS NULL OR about_images = '[]'::jsonb OR jsonb_array_length(about_images) = 0;

-- 2. Tabela de Serviços
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  time TEXT NOT NULL,
  description TEXT DEFAULT '',
  popular BOOLEAN DEFAULT false,
  category TEXT NOT NULL DEFAULT 'outros',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Pacotes Mensais
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT DEFAULT '',
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  highlighted BOOLEAN DEFAULT false,
  badge_text TEXT DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 4. Tabela de Fotos da Galeria
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Trabalhos',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- POLÍTICAS DE ACESSO (Row Level Security - RLS)
-- Permite leitura e escrita públicas (para controle via painel com login no app)
-- ==============================================================================

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública site_config" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Permitir escrita pública site_config" ON public.site_config FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura pública services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Permitir escrita pública services" ON public.services FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura pública packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Permitir escrita pública packages" ON public.packages FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir leitura pública gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Permitir escrita pública gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- HABILITAR REALTIME (Para atualizações instantâneas no site)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_config;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery;

-- ==============================================================================
-- STORAGE BUCKET
-- Cria o bucket público 'ellite-barberss' se não existir
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('ellite-barberss', 'ellite-barberss', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Permitir acesso público a arquivos"
ON storage.objects FOR SELECT
USING (bucket_id = 'ellite-barberss');

CREATE POLICY "Permitir upload público a arquivos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ellite-barberss');

CREATE POLICY "Permitir atualização de arquivos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ellite-barberss');

CREATE POLICY "Permitir exclusão de arquivos"
ON storage.objects FOR DELETE
USING (bucket_id = 'ellite-barberss');

-- ==============================================================================
-- DADOS INICIAIS (SEED)
-- ==============================================================================

-- Inserir Configuração Inicial
INSERT INTO public.site_config (id, barbershop_name, hero_title, hero_subtitle, address, hours_text, booksy_url, whatsapp_url, logo_url, accent_color, background_color)
VALUES (
  'main',
  'ELLITE BARBERSS',
  'Tradição e estilo no mesmo lugar',
  'Cortes masculinos e barba em Arujá-SP',
  'Rua Prudente de Moraes, N10, loja de frente, Arujá-SP',
  'Segunda a domingo, 09h às 20h',
  'https://booksy.com/widget-2024/index.html?realm=instagram&country=br&language=pt&fingerprint=cc34af3d-7dd2-4f4a-a3be-e3670f4eff74&channel=156ce701-bd15-4539-a838-e48841087851&id=395022&ba_s=Undefined',
  'https://wa.me/5511934706817?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Ellite%20Barberss.',
  '',
  '#C9A84C',
  '#0a0a0a'
) ON CONFLICT (id) DO NOTHING;

-- Inserir Serviços Iniciais
INSERT INTO public.services (id, name, price, time, description, popular, category, display_order)
VALUES
  ('corte-barba', 'Corte & Barba', 'R$ 80,00', '1h', 'Combo completo: corte personalizado com visagismo, toalha quente e alinhamento de barba.', true, 'cabelo', 0),
  ('corte-cabelo', 'Corte de Cabelo', 'R$ 50,00', '30min', 'Corte na tesoura ou máquina com lavagem e finalização profissional.', true, 'cabelo', 1),
  ('barba-simples', 'Barba Simples', 'R$ 45,00', '30min', 'Alinhamento com navalha, produtos hidratantes e pós-barba refrescante.', false, 'cabelo', 2),
  ('barba-terapia', 'Barba Terapia', 'R$ 25,00', '15min', 'Tratamento relaxante com vapor de ozônio, toalha quente e óleos essenciais.', false, 'cabelo', 3),
  ('pigmentacao-corte', 'Pigmentação Corte', 'R$ 35,00', '30min', 'Destaque e definição dos contornos do corte com pigmento natural.', false, 'outros', 4),
  ('pigmentacao-barba', 'Pigmentação Barba', 'R$ 35,00', '30min', 'Preenchimento de falhas e uniformização do tom da barba.', false, 'outros', 5),
  ('sobrancelha', 'Sobrancelha', 'R$ 15,00', '15min', 'Design e alinhamento preciso na navalha ou pinça.', false, 'outros', 6),
  ('acabamento', 'Acabamento', 'R$ 15,00', '15min', 'Pézinho e contornos limpos para manter o visual em dia.', false, 'outros', 7),
  ('penteado', 'Penteado', 'R$ 30,00', '20min', 'Modelagem e fixação para ocasiões especiais ou dia a dia.', false, 'outros', 8),
  ('hidratacao', 'Hidratação', 'R$ 35,00', '30min', 'Nutrição profunda e recuperação dos fios danificados.', false, 'outros', 9),
  ('botox-capilar', 'Botox Capilar', 'R$ 80,00', '30min', 'Alinhamento, redução de volume e brilho intenso aos cabelos.', false, 'outros', 10),
  ('selagem', 'Selagem', 'R$ 90,00', '40min', 'Tratamento reconstrutor térmico para blindagem dos fios.', false, 'outros', 11),
  ('progressiva', 'Progressiva', 'R$ 90,00', '30min', 'Alisamento duradouro e controle total do frizz.', false, 'outros', 12),
  ('relaxamento', 'Relaxamento', 'R$ 60,00', '30min', 'Redução de volume e soltura dos cachos com naturalidade.', false, 'outros', 13),
  ('luzes', 'Luzes', 'R$ 110,00', '2h', 'Mechas e iluminação personalizada para renovar seu visual.', false, 'outros', 14),
  ('platinado', 'Platinado', 'A partir de R$ 160,00', '2h30min', 'Descoloração global de alto impacto com proteção capilar.', true, 'outros', 15)
ON CONFLICT (id) DO NOTHING;

-- Inserir Pacotes Mensais Iniciais
INSERT INTO public.packages (id, name, price, description, benefits, highlighted, badge_text, display_order)
VALUES
  (
    'individual',
    '4 Cortes por Mês',
    '149,99',
    'Ideal para homens que não abrem mão do corte sempre alinhado toda semana.',
    '["4 Cortes de Cabelo durante o mês (1 por semana)", "Lavagem e finalização com pomada premium", "Agendamento flexível de segunda a domingo"]'::jsonb,
    false,
    '',
    0
  ),
  (
    'pai-filho',
    'Você e Seu Filho',
    '159,99',
    'O melhor custo-benefício para manter pai e filho com o corte em dia juntos.',
    '["4 Cortes por mês para usar em família", "Bônus Exclusivo: Sobrancelha Grátis incluída", "Lavagem e finalização premium para ambos", "Prioridade e flexibilidade total de horários"]'::jsonb,
    true,
    'Mais Vantajoso • Campeão',
    1
  )
ON CONFLICT (id) DO NOTHING;

-- Inserir Galeria Inicial
INSERT INTO public.gallery (id, url, title, category, display_order)
VALUES
  ('g1', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80', 'Degradê Fade & Barba Alinhada', 'Corte & Barboterapia', 0),
  ('g2', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80', 'Corte Clássico & Penteado Pompadour', 'Estilo Clássico', 1),
  ('g3', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80', 'Barba Terapia com Toalha Quente', 'Barba de Elite', 2),
  ('g4', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80', 'Platinado & Texturização', 'Química & Cor', 3),
  ('g5', 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80', 'Visagismo e Design de Sobrancelha', 'Harmonização', 4),
  ('g6', 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80', 'Ambiente e Acabamento Preciso', 'Experiência Ellite', 5)
ON CONFLICT (id) DO NOTHING;
