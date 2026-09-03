import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import { AdminLayout, type AdminSection } from "../../components/admin/AdminLayout";
import { GeneralInfoEditor } from "../../components/admin/sections/GeneralInfoEditor";
import { ServicesEditor } from "../../components/admin/sections/ServicesEditor";
import { PackagesEditor } from "../../components/admin/sections/PackagesEditor";
import { GalleryEditor } from "../../components/admin/sections/GalleryEditor";
import { LogoEditor } from "../../components/admin/sections/LogoEditor";
import { StyleEditor } from "../../components/admin/sections/StyleEditor";
import { SiteDataProvider } from "../../context/SiteDataContext";
import { AuthProvider } from "../../context/AuthContext";
import { isFirebaseConfigured } from "../../lib/firebase";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <AuthProvider>
      <AdminDashboard />
    </AuthProvider>
  );
}

function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>("geral");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/admin/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <SiteDataProvider>
      <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {/* Firebase not configured banner */}
        {!isFirebaseConfigured && (
          <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Firebase não configurado</p>
              <p className="text-amber-300/80">
                Configure as variáveis de ambiente (<code className="text-amber-200">.env</code>) com as credenciais do Firebase para persistir alterações.
                Consulte o arquivo <code className="text-amber-200">.env.example</code> no repositório.
              </p>
            </div>
          </div>
        )}

        {/* Active Section */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeSection === "geral" && <GeneralInfoEditor />}
          {activeSection === "servicos" && <ServicesEditor />}
          {activeSection === "pacotes" && <PackagesEditor />}
          {activeSection === "galeria" && <GalleryEditor />}
          {activeSection === "logo" && <LogoEditor />}
          {activeSection === "estilo" && <StyleEditor />}
        </div>
      </AdminLayout>
    </SiteDataProvider>
  );
}
