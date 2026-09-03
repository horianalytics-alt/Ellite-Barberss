import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Settings,
  Scissors,
  Package,
  Image,
  Upload,
  Palette,
  LogOut,
  ExternalLink,
  Menu,
  X,
  LayoutDashboard,
  Info,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export type AdminSection =
  | "geral"
  | "servicos"
  | "pacotes"
  | "galeria"
  | "logo"
  | "estilo";

interface AdminLayoutProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: React.ReactNode;
}

const navItems: { id: AdminSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "geral", label: "Informações Gerais", icon: Info },
  { id: "servicos", label: "Serviços", icon: Scissors },
  { id: "pacotes", label: "Pacotes Mensais", icon: Package },
  { id: "galeria", label: "Galeria", icon: Image },
  { id: "logo", label: "Logo", icon: Upload },
  { id: "estilo", label: "Cores & Estilo", icon: Palette },
];

export function AdminLayout({ activeSection, onSectionChange, children }: AdminLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0d0d0d] border-r border-[#C9A84C]/20 min-h-screen">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-[#C9A84C]/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#C9A84C] flex items-center justify-center bg-black shadow-[0_0_12px_rgba(201,168,76,0.2)]">
              <Scissors className="w-4 h-4 text-[#C9A84C]" />
            </div>
            <div>
              <p className="font-serif text-sm font-bold tracking-widest text-white uppercase">Ellite Barberss</p>
              <p className="text-[10px] text-[#C9A84C]/80 uppercase tracking-wider">Painel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                  active
                    ? "bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#C9A84C]/20 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"
          >
            <ExternalLink className="w-4 h-4 text-[#C9A84C]" />
            Ver Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#0d0d0d] border-b border-[#C9A84C]/20 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#C9A84C] hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="font-serif text-lg font-bold text-white">
                {navItems.find((n) => n.id === activeSection)?.label ?? "Dashboard"}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">Painel de Gerenciamento — ELLITE BARBERSS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-[#C9A84C]/40 text-[#C9A84C] text-xs font-semibold uppercase tracking-wider hover:bg-[#C9A84C] hover:text-black transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0d0d0d] border-b border-[#C9A84C]/20 p-4 space-y-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onSectionChange(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    active
                      ? "bg-[#C9A84C] text-black"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
