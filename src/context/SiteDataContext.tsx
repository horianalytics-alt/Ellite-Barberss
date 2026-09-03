import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  DEFAULT_CONFIG,
  DEFAULT_SERVICES,
  DEFAULT_PACKAGES,
  DEFAULT_GALLERY,
  subscribeSiteConfig,
  subscribeServices,
  subscribePackages,
  subscribeGallery,
  seedInitialDataSupabase,
  getSiteConfig,
  getServices,
  getPackages,
  getGallery,
  type SiteConfig,
  type ServiceItem,
  type PackageItem,
  type GalleryItem,
} from "../lib/supabase-db";
import { isSupabaseConfigured } from "../lib/supabase";

// ─── LocalStorage Cache Keys ──────────────────────────────────────────────────
const STORAGE_KEYS = {
  CONFIG: "ellite_barberss_site_config",
  SERVICES: "ellite_barberss_services",
  PACKAGES: "ellite_barberss_packages",
  GALLERY: "ellite_barberss_gallery",
};

function getLocalData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn("Could not save to localStorage:", err);
  }
}

// ─── Context Type ─────────────────────────────────────────────────────────────

interface SiteDataContextType {
  siteConfig: SiteConfig;
  services: ServiceItem[];
  packages: PackageItem[];
  gallery: GalleryItem[];
  loading: boolean;
  isSupabaseReady: boolean;
  updateSiteConfigLocal: (config: Partial<SiteConfig>) => void;
  updateServicesLocal: (services: ServiceItem[]) => void;
  updatePackagesLocal: (packages: PackageItem[]) => void;
  updateGalleryLocal: (gallery: GalleryItem[]) => void;
  refreshSiteConfig: () => Promise<void>;
  refreshServices: () => Promise<void>;
  refreshPackages: () => Promise<void>;
  refreshGallery: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextType>({
  siteConfig: DEFAULT_CONFIG,
  services: DEFAULT_SERVICES,
  packages: DEFAULT_PACKAGES,
  gallery: DEFAULT_GALLERY,
  loading: false,
  isSupabaseReady: false,
  updateSiteConfigLocal: () => {},
  updateServicesLocal: () => {},
  updatePackagesLocal: () => {},
  updateGalleryLocal: () => {},
  refreshSiteConfig: async () => {},
  refreshServices: async () => {},
  refreshPackages: async () => {},
  refreshGallery: async () => {},
  refreshAll: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = getLocalData<SiteConfig>(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
    return {
      ...DEFAULT_CONFIG,
      ...saved,
      aboutImages:
        saved.aboutImages && saved.aboutImages.length > 0
          ? saved.aboutImages
          : DEFAULT_CONFIG.aboutImages,
    };
  });
  const [services, setServices] = useState<ServiceItem[]>(() =>
    getLocalData(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES)
  );
  const [packages, setPackages] = useState<PackageItem[]>(() =>
    getLocalData(STORAGE_KEYS.PACKAGES, DEFAULT_PACKAGES)
  );
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    getLocalData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY)
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Apply theme CSS custom properties whenever colors change
  useEffect(() => {
    document.documentElement.style.setProperty("--gold", siteConfig.accentColor || "#C9A84C");
    document.documentElement.style.setProperty("--site-bg", siteConfig.backgroundColor || "#0a0a0a");
  }, [siteConfig.accentColor, siteConfig.backgroundColor]);

  // Save changes to localStorage cache
  const updateSiteConfigLocal = React.useCallback((config: Partial<SiteConfig>) => {
    setSiteConfig((prev) => {
      const next = { ...prev, ...config };
      setLocalData(STORAGE_KEYS.CONFIG, next);
      return next;
    });
  }, []);

  const updateServicesLocal = React.useCallback((svcs: ServiceItem[]) => {
    setServices(svcs);
    setLocalData(STORAGE_KEYS.SERVICES, svcs);
  }, []);

  const updatePackagesLocal = React.useCallback((pkgs: PackageItem[]) => {
    setPackages(pkgs);
    setLocalData(STORAGE_KEYS.PACKAGES, pkgs);
  }, []);

  const updateGalleryLocal = React.useCallback((items: GalleryItem[]) => {
    setGallery(items);
    setLocalData(STORAGE_KEYS.GALLERY, items);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let resolved = 0;
    const tryResolve = () => {
      resolved++;
      if (resolved >= 4) setLoading(false);
    };

    seedInitialDataSupabase().catch(console.error);

    const unsub1 = subscribeSiteConfig((dbConfig) => {
      // Universal smart-merge: for each field, if Supabase returns the hardcoded
      // default value (= column missing or never saved), keep the localStorage value.
      // If Supabase has a real custom value, trust it (it was explicitly saved there).
      setSiteConfig((prev) => {
        const merged = { ...prev };
        (Object.keys(DEFAULT_CONFIG) as (keyof SiteConfig)[]).forEach((key) => {
          const dbVal = JSON.stringify(dbConfig[key]);
          const defVal = JSON.stringify(DEFAULT_CONFIG[key]);
          const dbHasCustomValue = dbVal !== defVal;
          if (dbHasCustomValue) {
            // DB has a value different from the hardcoded default → trust the DB
            (merged as any)[key] = dbConfig[key];
          }
          // else: DB returned the hardcoded default → keep what's in localStorage (prev)
        });
        setLocalData(STORAGE_KEYS.CONFIG, merged);
        return merged;
      });
      tryResolve();
    });
    const unsub2 = subscribeServices((svcs) => {
      const next = svcs.length ? svcs : DEFAULT_SERVICES;
      setServices(next);
      setLocalData(STORAGE_KEYS.SERVICES, next);
      tryResolve();
    });
    const unsub3 = subscribePackages((pkgs) => {
      const next = pkgs.length ? pkgs : DEFAULT_PACKAGES;
      setPackages(next);
      setLocalData(STORAGE_KEYS.PACKAGES, next);
      tryResolve();
    });
    const unsub4 = subscribeGallery((items) => {
      const next = items.length ? items : DEFAULT_GALLERY;
      setGallery(next);
      setLocalData(STORAGE_KEYS.GALLERY, next);
      tryResolve();
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, []);

  const refreshSiteConfig = React.useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const dbConfig = await getSiteConfig();
      // Use the same smart-merge: prefer DB values that differ from the default,
      // keep localStorage values for fields where DB returns the hardcoded default.
      setSiteConfig((prev) => {
        const merged = { ...prev };
        (Object.keys(DEFAULT_CONFIG) as (keyof SiteConfig)[]).forEach((key) => {
          const dbVal = JSON.stringify(dbConfig[key]);
          const defVal = JSON.stringify(DEFAULT_CONFIG[key]);
          if (dbVal !== defVal) {
            (merged as any)[key] = dbConfig[key];
          }
        });
        setLocalData(STORAGE_KEYS.CONFIG, merged);
        return merged;
      });
    } catch (err) {
      console.error("Error refreshing site config:", err);
    }
  }, []);

  const refreshServices = React.useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const svcs = await getServices();
      const next = svcs.length ? svcs : DEFAULT_SERVICES;
      setServices(next);
      setLocalData(STORAGE_KEYS.SERVICES, next);
    } catch (err) {
      console.error("Error refreshing services:", err);
    }
  }, []);

  const refreshPackages = React.useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const pkgs = await getPackages();
      const next = pkgs.length ? pkgs : DEFAULT_PACKAGES;
      setPackages(next);
      setLocalData(STORAGE_KEYS.PACKAGES, next);
    } catch (err) {
      console.error("Error refreshing packages:", err);
    }
  }, []);

  const refreshGallery = React.useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const items = await getGallery();
      const next = items.length ? items : DEFAULT_GALLERY;
      setGallery(next);
      setLocalData(STORAGE_KEYS.GALLERY, next);
    } catch (err) {
      console.error("Error refreshing gallery:", err);
    }
  }, []);

  const refreshAll = React.useCallback(async () => {
    await Promise.all([
      refreshSiteConfig(),
      refreshServices(),
      refreshPackages(),
      refreshGallery(),
    ]);
  }, [refreshSiteConfig, refreshServices, refreshPackages, refreshGallery]);

  return (
    <SiteDataContext.Provider
      value={{
        siteConfig,
        services,
        packages,
        gallery,
        loading,
        isSupabaseReady: isSupabaseConfigured,
        updateSiteConfigLocal,
        updateServicesLocal,
        updatePackagesLocal,
        updateGalleryLocal,
        refreshSiteConfig,
        refreshServices,
        refreshPackages,
        refreshGallery,
        refreshAll,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSiteData() {
  return useContext(SiteDataContext);
}
