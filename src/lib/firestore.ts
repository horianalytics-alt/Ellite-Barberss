import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SiteConfig {
  barbershopName: string;
  heroTitle: string;
  heroSubtitle: string;
  address: string;
  hoursText: string;
  booksyUrl: string;
  whatsappUrl: string;
  logoUrl: string;
  accentColor: string;
  backgroundColor: string;
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

// ─── Default Data ──────────────────────────────────────────────────────────────

const BOOKSY_URL =
  "https://booksy.com/widget-2024/index.html?realm=instagram&country=br&language=pt&fingerprint=cc34af3d-7dd2-4f4a-a3be-e3670f4eff74&channel=156ce701-bd15-4539-a838-e48841087851&id=395022&ba_s=Undefined";

const WHATSAPP_URL =
  "https://wa.me/5511934706817?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Ellite%20Barberss.";

export const DEFAULT_CONFIG: SiteConfig = {
  barbershopName: "ELLITE BARBERSS",
  heroTitle: "Tradição e estilo no mesmo lugar",
  heroSubtitle: "Cortes masculinos e barba em Arujá-SP",
  address: "Rua Prudente de Moraes, N10, loja de frente, Arujá-SP",
  hoursText: "Segunda a domingo, 09h às 20h",
  booksyUrl: BOOKSY_URL,
  whatsappUrl: WHATSAPP_URL,
  logoUrl: "",
  accentColor: "#C9A84C",
  backgroundColor: "#0a0a0a",
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

// ─── Firestore CRUD ────────────────────────────────────────────────────────────

// Site Config
export async function saveSiteConfig(config: Partial<SiteConfig>): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await setDoc(doc(db, "siteConfig", "main"), config, { merge: true });
}

export function subscribeSiteConfig(callback: (config: SiteConfig) => void): Unsubscribe {
  if (!db) return () => {};
  return onSnapshot(doc(db, "siteConfig", "main"), (snap) => {
    if (snap.exists()) {
      callback({ ...DEFAULT_CONFIG, ...(snap.data() as SiteConfig) });
    } else {
      callback(DEFAULT_CONFIG);
    }
  });
}

// Services
export async function saveService(service: Omit<ServiceItem, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const ref = await addDoc(collection(db, "services"), service);
  return ref.id;
}

export async function updateService(id: string, data: Partial<ServiceItem>): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, "services", id), data);
}

export async function deleteService(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "services", id));
}

export async function reorderServices(services: ServiceItem[]): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  const updates = services.map((s, i) => updateDoc(doc(db!, "services", s.id), { order: i }));
  await Promise.all(updates);
}

export function subscribeServices(callback: (services: ServiceItem[]) => void): Unsubscribe {
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "services"), orderBy("order")),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ServiceItem));
      callback(items);
    }
  );
}

// Packages
export async function savePackage(pkg: Omit<PackageItem, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const ref = await addDoc(collection(db, "packages"), pkg);
  return ref.id;
}

export async function updatePackage(id: string, data: Partial<PackageItem>): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await updateDoc(doc(db, "packages", id), data);
}

export async function deletePackage(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "packages", id));
}

export function subscribePackages(callback: (packages: PackageItem[]) => void): Unsubscribe {
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "packages"), orderBy("order")),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PackageItem));
      callback(items);
    }
  );
}

// Gallery
export async function uploadGalleryImage(file: File, id: string): Promise<string> {
  if (!storage) throw new Error("Firebase not configured");
  const storageRef = ref(storage, `ellite-barberss/gallery/${id}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function saveGalleryItem(item: Omit<GalleryItem, "id">): Promise<string> {
  if (!db) throw new Error("Firebase not configured");
  const ref = await addDoc(collection(db, "gallery"), item);
  return ref.id;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "gallery", id));
}

export async function reorderGallery(items: GalleryItem[]): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  const updates = items.map((item, i) => updateDoc(doc(db!, "gallery", item.id), { order: i }));
  await Promise.all(updates);
}

export function subscribeGallery(callback: (items: GalleryItem[]) => void): Unsubscribe {
  if (!db) return () => {};
  return onSnapshot(
    query(collection(db, "gallery"), orderBy("order")),
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
      callback(items);
    }
  );
}

// Logo Upload
export async function uploadLogo(file: File): Promise<string> {
  if (!storage) throw new Error("Firebase not configured");
  const storageRef = ref(storage, `ellite-barberss/logo/logo.png`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await saveSiteConfig({ logoUrl: url });
  return url;
}

// Seed initial data (run once)
export async function seedInitialData(): Promise<void> {
  if (!db) return;
  const configSnap = await getDoc(doc(db, "siteConfig", "main"));
  if (!configSnap.exists()) {
    await setDoc(doc(db, "siteConfig", "main"), DEFAULT_CONFIG);
    for (const svc of DEFAULT_SERVICES) {
      const { id, ...rest } = svc;
      await setDoc(doc(db, "services", id), rest);
    }
    for (const pkg of DEFAULT_PACKAGES) {
      const { id, ...rest } = pkg;
      await setDoc(doc(db, "packages", id), rest);
    }
    for (const item of DEFAULT_GALLERY) {
      const { id, ...rest } = item;
      await setDoc(doc(db, "gallery", id), rest);
    }
  }
}
