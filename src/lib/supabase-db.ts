import { supabase, isSupabaseConfigured } from "./supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteConfig {
  barbershopName: string;
  heroTitle: string;
  heroSubtitle: string;
  address: string;
  addressComplement: string;
  hoursText: string;
  phoneText: string;
  booksyUrl: string;
  whatsappUrl: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  logoUrl: string;
  accentColor: string;
  backgroundColor: string;
  aboutImages: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  price: string;
  time: string;
  description: string;
  popular: boolean;
  category: "cabelo" | "outros";
  order: number;
}

export interface PackageItem {
  id: string;
  name: string;
  price: string;
  description: string;
  benefits: string[];
  highlighted: boolean;
  badgeText: string;
  order: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
  order: number;
}

// ─── Default Fallback Data ───────────────────────────────────────────────────

const BOOKSY_URL =
  "https://booksy.com/widget-2024/index.html?realm=instagram&country=br&language=pt&fingerprint=cc34af3d-7dd2-4f4a-a3be-e3670f4eff74&channel=156ce701-bd15-4539-a838-e48841087851&id=395022&ba_s=Undefined";

const WHATSAPP_URL =
  "https://wa.me/5511934706817?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Ellite%20Barberss.";

export const DEFAULT_CONFIG: SiteConfig = {
  barbershopName: "ELLITE BARBERSS",
  heroTitle: "Tradição e estilo no mesmo lugar",
  heroSubtitle: "Cortes masculinos e barba em Arujá-SP",
  address: "Rua Prudente de Moraes, N10, Arujá-SP",
  addressComplement: "(Loja de frente para a rua)",
  hoursText: "Segunda a Sexta: 09h às 20h\nSábado: 09h às 19h\nDomingo: 10h às 15h",
  phoneText: "(11) 93470-6817",
  booksyUrl: BOOKSY_URL,
  whatsappUrl: WHATSAPP_URL,
  googleMapsUrl: "https://maps.google.com/?q=Rua+Prudente+de+Morais,+10+-+Vila+Flora+Regina,+Arujá+-+SP",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3660.854619566938!2d-46.323565924765955!3d-23.39868777891361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce8751515ef861%3A0x738cb23e4e979a0!2sR.%20Prudente%20de%20Morais%2C%2010%20-%20Vila%20Flora%20Regina%2C%20Aruj%C3%A1%20-%20SP%2C%2007400-000!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr",
  logoUrl: "",
  accentColor: "#C9A84C",
  backgroundColor: "#0a0a0a",
  aboutImages: [
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
  ],
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  { id: "corte-barba", name: "Corte & Barba", price: "R$ 80,00", time: "1h", description: "Combo completo: corte personalizado com visagismo, toalha quente e alinhamento de barba.", popular: true, category: "cabelo", order: 0 },
  { id: "corte-cabelo", name: "Corte de Cabelo", price: "R$ 50,00", time: "30min", description: "Corte na tesoura ou máquina com lavagem e finalização profissional.", popular: true, category: "cabelo", order: 1 },
  { id: "barba-simples", name: "Barba Simples", price: "R$ 45,00", time: "30min", description: "Alinhamento com navalha, produtos hidratantes e pós-barba refrescante.", popular: false, category: "cabelo", order: 2 },
  { id: "barba-terapia", name: "Barba Terapia", price: "R$ 25,00", time: "15min", description: "Tratamento relaxante com vapor de ozônio, toalha quente e óleos essenciais.", popular: false, category: "cabelo", order: 3 },
  { id: "pigmentacao-corte", name: "Pigmentação Corte", price: "R$ 35,00", time: "30min", description: "Destaque e definição dos contornos do corte com pigmento natural.", popular: false, category: "outros", order: 4 },
  { id: "pigmentacao-barba", name: "Pigmentação Barba", price: "R$ 35,00", time: "30min", description: "Preenchimento de falhas e uniformização do tom da barba.", popular: false, category: "outros", order: 5 },
  { id: "sobrancelha", name: "Sobrancelha", price: "R$ 15,00", time: "15min", description: "Design e alinhamento preciso na navalha ou pinça.", popular: false, category: "outros", order: 6 },
  { id: "acabamento", name: "Acabamento", price: "R$ 15,00", time: "15min", description: "Pézinho e contornos limpos para manter o visual em dia.", popular: false, category: "outros", order: 7 },
  { id: "penteado", name: "Penteado", price: "R$ 30,00", time: "20min", description: "Modelagem e fixação para ocasiões especiais ou dia a dia.", popular: false, category: "outros", order: 8 },
  { id: "hidratacao", name: "Hidratação", price: "R$ 35,00", time: "30min", description: "Nutrição profunda e recuperação dos fios danificados.", popular: false, category: "outros", order: 9 },
  { id: "botox-capilar", name: "Botox Capilar", price: "R$ 80,00", time: "30min", description: "Alinhamento, redução de volume e brilho intenso aos cabelos.", popular: false, category: "outros", order: 10 },
  { id: "selagem", name: "Selagem", price: "R$ 90,00", time: "40min", description: "Tratamento reconstrutor térmico para blindagem dos fios.", popular: false, category: "outros", order: 11 },
  { id: "progressiva", name: "Progressiva", price: "R$ 90,00", time: "30min", description: "Alisamento duradouro e controle total do frizz.", popular: false, category: "outros", order: 12 },
  { id: "relaxamento", name: "Relaxamento", price: "R$ 60,00", time: "30min", description: "Redução de volume e soltura dos cachos com naturalidade.", popular: false, category: "outros", order: 13 },
  { id: "luzes", name: "Luzes", price: "R$ 110,00", time: "2h", description: "Mechas e iluminação personalizada para renovar seu visual.", popular: false, category: "outros", order: 14 },
  { id: "platinado", name: "Platinado", price: "A partir de R$ 160,00", time: "2h30min", description: "Descoloração global de alto impacto com proteção capilar.", popular: true, category: "outros", order: 15 },
];

export const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: "individual",
    name: "4 Cortes por Mês",
    price: "149,99",
    description: "Ideal para homens que não abrem mão do corte sempre alinhado toda semana.",
    benefits: ["4 Cortes de Cabelo durante o mês (1 por semana)", "Lavagem e finalização com pomada premium", "Agendamento flexível de segunda a domingo"],
    highlighted: false,
    badgeText: "",
    order: 0,
  },
  {
    id: "pai-filho",
    name: "Você e Seu Filho",
    price: "159,99",
    description: "O melhor custo-benefício para manter pai e filho com o corte em dia juntos.",
    benefits: ["4 Cortes por mês para usar em família", "Bônus Exclusivo: Sobrancelha Grátis incluída", "Lavagem e finalização premium para ambos", "Prioridade e flexibilidade total de horários"],
    highlighted: true,
    badgeText: "Mais Vantajoso • Campeão",
    order: 1,
  },
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  { id: "g1", url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80", title: "Degradê Fade & Barba Alinhada", category: "Corte & Barboterapia", order: 0 },
  { id: "g2", url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80", title: "Corte Clássico & Penteado Pompadour", category: "Estilo Clássico", order: 1 },
  { id: "g3", url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80", title: "Barba Terapia com Toalha Quente", category: "Barba de Elite", order: 2 },
  { id: "g4", url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80", title: "Platinado & Texturização", category: "Química & Cor", order: 3 },
  { id: "g5", url: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80", title: "Visagismo e Design de Sobrancelha", category: "Harmonização", order: 4 },
  { id: "g6", url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80", title: "Ambiente e Acabamento Preciso", category: "Experiência Ellite", order: 5 },
];

// ─── Helpers: Mappers between Postgres Snake_Case and Frontend CamelCase ────

function mapDbConfigToFrontend(row: any): SiteConfig {
  if (!row) return DEFAULT_CONFIG;
  let aboutImgs: string[] = DEFAULT_CONFIG.aboutImages;
  if (Array.isArray(row.about_images)) {
    aboutImgs = row.about_images;
  } else if (typeof row.about_images === "string") {
    try {
      aboutImgs = JSON.parse(row.about_images);
    } catch {
      aboutImgs = DEFAULT_CONFIG.aboutImages;
    }
  }

  return {
    barbershopName: row.barbershop_name ?? DEFAULT_CONFIG.barbershopName,
    heroTitle: row.hero_title ?? DEFAULT_CONFIG.heroTitle,
    heroSubtitle: row.hero_subtitle ?? DEFAULT_CONFIG.heroSubtitle,
    address: row.address ?? DEFAULT_CONFIG.address,
    addressComplement: row.address_complement ?? DEFAULT_CONFIG.addressComplement,
    hoursText: row.hours_text ?? DEFAULT_CONFIG.hoursText,
    phoneText: row.phone_text ?? DEFAULT_CONFIG.phoneText,
    booksyUrl: row.booksy_url ?? DEFAULT_CONFIG.booksyUrl,
    whatsappUrl: row.whatsapp_url ?? DEFAULT_CONFIG.whatsappUrl,
    googleMapsUrl: row.google_maps_url ?? DEFAULT_CONFIG.googleMapsUrl,
    googleMapsEmbedUrl: row.google_maps_embed_url ?? DEFAULT_CONFIG.googleMapsEmbedUrl,
    logoUrl: row.logo_url ?? DEFAULT_CONFIG.logoUrl,
    accentColor: row.accent_color ?? DEFAULT_CONFIG.accentColor,
    backgroundColor: row.background_color ?? DEFAULT_CONFIG.backgroundColor,
    aboutImages: aboutImgs && aboutImgs.length > 0 ? aboutImgs : DEFAULT_CONFIG.aboutImages,
  };
}

function mapFrontendConfigToDb(config: Partial<SiteConfig>): any {
  const result: any = {};
  if (config.barbershopName !== undefined) result.barbershop_name = config.barbershopName;
  if (config.heroTitle !== undefined) result.hero_title = config.heroTitle;
  if (config.heroSubtitle !== undefined) result.hero_subtitle = config.heroSubtitle;
  if (config.address !== undefined) result.address = config.address;
  if (config.addressComplement !== undefined) result.address_complement = config.addressComplement;
  if (config.hoursText !== undefined) result.hours_text = config.hoursText;
  if (config.phoneText !== undefined) result.phone_text = config.phoneText;
  if (config.booksyUrl !== undefined) result.booksy_url = config.booksyUrl;
  if (config.whatsappUrl !== undefined) result.whatsapp_url = config.whatsappUrl;
  if (config.googleMapsUrl !== undefined) result.google_maps_url = config.googleMapsUrl;
  if (config.googleMapsEmbedUrl !== undefined) result.google_maps_embed_url = config.googleMapsEmbedUrl;
  if (config.logoUrl !== undefined) result.logo_url = config.logoUrl;
  if (config.accentColor !== undefined) result.accent_color = config.accentColor;
  if (config.backgroundColor !== undefined) result.background_color = config.backgroundColor;
  if (config.aboutImages !== undefined) result.about_images = config.aboutImages;
  result.updated_at = new Date().toISOString();
  return result;
}

function mapDbServiceToFrontend(row: any): ServiceItem {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    time: row.time,
    description: row.description || "",
    popular: Boolean(row.popular),
    category: row.category === "cabelo" ? "cabelo" : "outros",
    order: row.display_order ?? 0,
  };
}

function mapDbPackageToFrontend(row: any): PackageItem {
  let benefitsArray: string[] = [];
  if (Array.isArray(row.benefits)) {
    benefitsArray = row.benefits;
  } else if (typeof row.benefits === "string") {
    try {
      benefitsArray = JSON.parse(row.benefits);
    } catch {
      benefitsArray = [];
    }
  }
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description || "",
    benefits: benefitsArray,
    highlighted: Boolean(row.highlighted),
    badgeText: row.badge_text || "",
    order: row.display_order ?? 0,
  };
}

function mapDbGalleryToFrontend(row: any): GalleryItem {
  return {
    id: row.id,
    url: row.url,
    title: row.title,
    category: row.category || "Trabalhos",
    order: row.display_order ?? 0,
  };
}

// ─── CRUD Functions ───────────────────────────────────────────────────────────

// 1. Site Config
export async function saveSiteConfig(config: Partial<SiteConfig>): Promise<void> {
  if (!supabase) throw new Error("Supabase não configurado");
  const payload = {
    id: "main",
    ...mapFrontendConfigToDb(config),
  };
  const { error } = await supabase.from("site_config").upsert(payload, { onConflict: "id" });
  if (error) throw error;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  if (!supabase) return DEFAULT_CONFIG;
  const { data, error } = await supabase.from("site_config").select("*").eq("id", "main").maybeSingle();
  if (error || !data) return DEFAULT_CONFIG;
  return mapDbConfigToFrontend(data);
}

export function subscribeSiteConfig(callback: (config: SiteConfig) => void): () => void {
  if (!supabase) return () => {};

  getSiteConfig().then(callback).catch(console.error);

  const channel = supabase
    .channel("public:site_config")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "site_config" },
      (payload) => {
        if (payload.new) {
          callback(mapDbConfigToFrontend(payload.new));
        }
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}

// 2. Services
export async function saveService(service: Omit<ServiceItem, "id">): Promise<string> {
  if (!supabase) throw new Error("Supabase não configurado");
  const id = `svc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload = {
    id,
    name: service.name,
    price: service.price,
    time: service.time,
    description: service.description || "",
    popular: service.popular,
    category: service.category,
    display_order: service.order,
  };
  const { error } = await supabase.from("services").insert(payload);
  if (error) throw error;
  return id;
}

export async function updateService(id: string, data: Partial<ServiceItem>): Promise<void> {
  if (!supabase) throw new Error("Supabase não configurado");
  const payload: any = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.price !== undefined) payload.price = data.price;
  if (data.time !== undefined) payload.time = data.time;
  if (data.description !== undefined) payload.description = data.description;
  if (data.popular !== undefined) payload.popular = data.popular;
  if (data.category !== undefined) payload.category = data.category;
  if (data.order !== undefined) payload.display_order = data.order;

  const { error } = await supabase.from("services").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deleteService(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase não configurado");
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderServices(services: ServiceItem[]): Promise<void> {
  if (!supabase) throw new Error("Supabase não configurado");
  const updates = services.map((s, idx) =>
    supabase!.from("services").update({ display_order: idx }).eq("id", s.id)
  );
  await Promise.all(updates);
}

export async function getServices(): Promise<ServiceItem[]> {
  if (!supabase) return DEFAULT_SERVICES;
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });
  if (error || !data || data.length === 0) return DEFAULT_SERVICES;
  return data.map(mapDbServiceToFrontend);
}

export function subscribeServices(callback: (services: ServiceItem[]) => void): () => void {
  if (!supabase) return () => {};

  getServices().then(callback).catch(console.error);

  const channel = supabase
    .channel("public:services")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "services" },
      () => {
        getServices().then(callback).catch(console.error);
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}

// 3. Packages
export async function savePackage(pkg: Omit<PackageItem, "id">): Promise<string> {
  if (!supabase) throw new Error("Supabase não configurado");
  const id = `pkg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload = {
    id,
    name: pkg.name,
    price: pkg.price,
    description: pkg.description || "",
    benefits: pkg.benefits,
    highlighted: pkg.highlighted,
    badge_text: pkg.badgeText || "",
    display_order: pkg.order,
  };
  const { error } = await supabase.from("packages").insert(payload);
  if (error) throw error;
  return id;
}

export async function updatePackage(id: string, data: Partial<PackageItem>): Promise<void> {
  if (!supabase) throw new Error("Supabase não configurado");
  const payload: any = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.price !== undefined) payload.price = data.price;
  if (data.description !== undefined) payload.description = data.description;
  if (data.benefits !== undefined) payload.benefits = data.benefits;
  if (data.highlighted !== undefined) payload.highlighted = data.highlighted;
  if (data.badgeText !== undefined) payload.badge_text = data.badgeText;
  if (data.order !== undefined) payload.display_order = data.order;

  const { error } = await supabase.from("packages").update(payload).eq("id", id);
  if (error) throw error;
}

export async function deletePackage(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase não configurado");
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) throw error;
}

export async function getPackages(): Promise<PackageItem[]> {
  if (!supabase) return DEFAULT_PACKAGES;
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("display_order", { ascending: true });
  if (error || !data || data.length === 0) return DEFAULT_PACKAGES;
  return data.map(mapDbPackageToFrontend);
}

export function subscribePackages(callback: (packages: PackageItem[]) => void): () => void {
  if (!supabase) return () => {};

  getPackages().then(callback).catch(console.error);

  const channel = supabase
    .channel("public:packages")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "packages" },
      () => {
        getPackages().then(callback).catch(console.error);
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}

// 4. Gallery & Storage
const STORAGE_BUCKET = "ellite-barberss";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 anos

// O bucket é privado, então geramos uma URL assinada de longa duração.
async function getStorageUrl(path: string): Promise<string> {
  if (!supabase) throw new Error("Supabase não configurado");
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (error || !data?.signedUrl) {
    throw error ?? new Error("Não foi possível gerar a URL da imagem");
  }
  return data.signedUrl;
}

export async function uploadGalleryImage(file: File, id: string): Promise<string> {
  if (!supabase) throw new Error("Supabase não configurado");
  const ext = file.name.split(".").pop() || "jpg";
  const path = `gallery/${id}_${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;

  return getStorageUrl(path);
}

export async function saveGalleryItem(item: Omit<GalleryItem, "id">): Promise<string> {
  if (!supabase) throw new Error("Supabase não configurado");
  const id = `g-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const payload = {
    id,
    url: item.url,
    title: item.title,
    category: item.category || "Trabalhos",
    display_order: item.order,
  };
  const { error } = await supabase.from("gallery").insert(payload);
  if (error) throw error;
  return id;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase não configurado");
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderGallery(items: GalleryItem[]): Promise<void> {
  if (!supabase) throw new Error("Supabase não configurado");
  const updates = items.map((item, idx) =>
    supabase!.from("gallery").update({ display_order: idx }).eq("id", item.id)
  );
  await Promise.all(updates);
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (!supabase) return DEFAULT_GALLERY;
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true });
  if (error || !data || data.length === 0) return DEFAULT_GALLERY;
  return data.map(mapDbGalleryToFrontend);
}

export function subscribeGallery(callback: (items: GalleryItem[]) => void): () => void {
  if (!supabase) return () => {};

  getGallery().then(callback).catch(console.error);

  const channel = supabase
    .channel("public:gallery")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "gallery" },
      () => {
        getGallery().then(callback).catch(console.error);
      }
    )
    .subscribe();

  return () => {
    supabase?.removeChannel(channel);
  };
}

// 5. Logo Upload
export async function uploadLogo(file: File): Promise<string> {
  if (!supabase) throw new Error("Supabase não configurado");
  const path = `logo/logo_${Date.now()}.png`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;

  const logoUrl = await getStorageUrl(path);
  await saveSiteConfig({ logoUrl });
  return logoUrl;
}

// 5.1 Ambiente Images Upload
export async function uploadAmbienteImage(file: File, id: string): Promise<string> {
  if (!supabase) throw new Error("Supabase não configurado");
  const ext = file.name.split(".").pop() || "jpg";
  const path = `ambiente/${id}_${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw error;

  return await getStorageUrl(path);
}

// 6. Automatic Seeding (if Supabase tables are empty)
export async function seedInitialDataSupabase(): Promise<void> {
  if (!supabase) return;
  try {
    const { data: config } = await supabase.from("site_config").select("id").eq("id", "main").maybeSingle();
    if (!config) {
      await supabase.from("site_config").upsert({
        id: "main",
        ...mapFrontendConfigToDb(DEFAULT_CONFIG),
      });
    }

    const { data: services } = await supabase.from("services").select("id").limit(1);
    if (!services || services.length === 0) {
      const payloads = DEFAULT_SERVICES.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        time: s.time,
        description: s.description,
        popular: s.popular,
        category: s.category,
        display_order: s.order,
      }));
      await supabase.from("services").insert(payloads);
    }

    const { data: packages } = await supabase.from("packages").select("id").limit(1);
    if (!packages || packages.length === 0) {
      const payloads = DEFAULT_PACKAGES.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        description: p.description,
        benefits: p.benefits,
        highlighted: p.highlighted,
        badge_text: p.badgeText,
        display_order: p.order,
      }));
      await supabase.from("packages").insert(payloads);
    }

    const { data: gallery } = await supabase.from("gallery").select("id").limit(1);
    if (!gallery || gallery.length === 0) {
      const payloads = DEFAULT_GALLERY.map((g) => ({
        id: g.id,
        url: g.url,
        title: g.title,
        category: g.category,
        display_order: g.order,
      }));
      await supabase.from("gallery").insert(payloads);
    }
  } catch (err) {
    console.warn("Could not seed initial Supabase data:", err);
  }
}
