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

// ─── Context Type ─────────────────────────────────────────────────────────────

interface SiteDataContextType {
  siteConfig: SiteConfig;
  services: ServiceItem[];
  packages: PackageItem[];
  gallery: GalleryItem[];
  loading: boolean;
  isSupabaseReady: boolean;
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
  refreshSiteConfig: async () => {},
  refreshServices: async () => {},
  refreshPackages: async () => {},
  refreshGallery: async () => {},
  refreshAll: async () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [packages, setPackages] = useState<PackageItem[]>(DEFAULT_PACKAGES);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // Apply theme CSS custom properties whenever colors change
  useEffect(() => {
    document.documentElement.style.setProperty("--gold", siteConfig.accentColor || "#C9A84C");
    document.documentElement.style.setProperty("--site-bg", siteConfig.backgroundColor || "#0a0a0a");
  }, [siteConfig.accentColor, siteConfig.backgroundColor]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let resolved = 0;
    const tryResolve = () => {
      resolved++;
      if (resolved >= 4) setLoading(false);
    };

    seedInitialDataSupabase().catch(console.error);

    const unsub1 = subscribeSiteConfig((config) => {
      setSiteConfig(config);
      tryResolve();
    });
    const unsub2 = subscribeServices((svcs) => {
      setServices(svcs.length ? svcs : DEFAULT_SERVICES);
      tryResolve();
    });
    const unsub3 = subscribePackages((pkgs) => {
      setPackages(pkgs.length ? pkgs : DEFAULT_PACKAGES);
      tryResolve();
    });
    const unsub4 = subscribeGallery((items) => {
      setGallery(items.length ? items : DEFAULT_GALLERY);
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
    const config = await getSiteConfig();
    setSiteConfig(config);
  }, []);

  const refreshServices = React.useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const svcs = await getServices();
    setServices(svcs.length ? svcs : DEFAULT_SERVICES);
  }, []);

  const refreshPackages = React.useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const pkgs = await getPackages();
    setPackages(pkgs.length ? pkgs : DEFAULT_PACKAGES);
  }, []);

  const refreshGallery = React.useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const items = await getGallery();
    setGallery(items.length ? items : DEFAULT_GALLERY);
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
