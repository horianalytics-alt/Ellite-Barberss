import React, { useState, useEffect } from "react";
import { Scissors, Menu, X, Calendar } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export function Header() {
  const { siteConfig } = useSiteData();
  const { booksyUrl, barbershopName, logoUrl } = siteConfig;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Sobre", href: "#sobre" },
    { name: "Serviços & Preços", href: "#servicos" },
    { name: "Galeria", href: "#galeria" },
    { name: "Pacotes", href: "#pacotes" },
    { name: "Localização", href: "#localizacao" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#C9A84C]/20 py-3 shadow-lg"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]">
            <div className="w-10 h-10 rounded-full border border-[#C9A84C] flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(201,168,76,0.25)] group-hover:border-[#E0C068] overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <Scissors className="w-5 h-5 text-[#C9A84C] group-hover:rotate-12 transition-transform duration-300" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-[0.2em] text-white uppercase">
                {barbershopName}
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#C9A84C]/90 font-medium">
                Arujá • São Paulo
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-[#C9A84C] transition-colors tracking-wide relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#C9A84C] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={booksyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#8C7126] via-[#C9A84C] to-[#E0C068]"></span>
              <span className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0a0a0a] text-xs font-semibold uppercase tracking-wider text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black transition-all duration-300">
                <Calendar className="w-4 h-4" />
                Agendar Agora
              </span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir Menu"
            className="md:hidden p-2 rounded-lg text-[#C9A84C] hover:bg-[#141414] focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#C9A84C]/30 px-6 py-6 transition-all animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-gray-200 hover:text-[#C9A84C] py-2 border-b border-white/5 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4">
              <a
                href={booksyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 min-h-[52px] rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#E0C068] text-black font-semibold text-sm uppercase tracking-wider"
              >
                <Calendar className="w-4 h-4" />
                Agendar Agora no Booksy
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
