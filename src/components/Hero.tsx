import React from "react";
import { Calendar, Scissors, Star, MapPin, Clock, Sparkles, ChevronDown } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export function Hero() {
  const { siteConfig } = useSiteData();
  const { booksyUrl, heroTitle, heroSubtitle, hoursText, logoUrl, barbershopName } = siteConfig;

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0a0a]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=2000&q=80"
          alt="Ellite Barberss Interior"
          className="w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/90" />
        <div className="absolute inset-0 bg-radial-gold opacity-60" />
      </div>
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/40 bg-black/60 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(201,168,76,0.15)]">
          <Sparkles className="w-4 h-4 text-[#C9A84C]" />
          <span className="text-xs sm:text-sm font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Experiência & Atendimento de Primeira
          </span>
        </div>

        {/* Logo Placeholder / Logo Image */}
        <div className="mb-6 flex flex-col items-center group">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[#C9A84C]/60 flex items-center justify-center bg-black/80 backdrop-blur-lg shadow-[0_0_35px_rgba(201,168,76,0.3)] transition-transform duration-500 hover:scale-105 overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt={barbershopName} className="w-full h-full object-contain p-3" />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <Scissors className="w-10 h-10 sm:w-12 sm:h-12 text-[#C9A84C] mb-1 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-serif text-[11px] sm:text-xs tracking-widest text-[#E0C068] font-bold uppercase">ELLITE</span>
                <span className="text-[8px] tracking-[0.3em] text-gray-400 uppercase">BARBERSS</span>
              </div>
            )}
            <div className="absolute -inset-1 rounded-full border border-[#C9A84C]/30 animate-spin-slow pointer-events-none" />
          </div>
          <span className="mt-2 text-[11px] tracking-widest text-gray-400 uppercase font-sans">
            Barbearia de Alto Padrão
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-4 max-w-4xl leading-[1.1]">
          {heroTitle.includes(" ") ? (
            <>
              {heroTitle.substring(0, heroTitle.lastIndexOf(" "))} <br className="hidden sm:inline" />
              <span className="text-gold-gradient italic">{heroTitle.substring(heroTitle.lastIndexOf(" ") + 1)}</span>
            </>
          ) : (
            <span className="text-gold-gradient italic">{heroTitle}</span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-2xl text-gray-300 font-light tracking-wide max-w-2xl mb-10 leading-relaxed">
          {heroSubtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14">
          <a
            href={booksyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-[#C9A84C] via-[#E0C068] to-[#C9A84C] text-black font-serif font-bold text-base sm:text-lg tracking-wider uppercase shadow-[0_0_30px_rgba(201,168,76,0.35)] hover:shadow-[0_0_45px_rgba(201,168,76,0.6)] hover:scale-[1.03] transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            Agendar Agora
          </a>
          <a
            href="#servicos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-gray-200 font-medium text-sm sm:text-base hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
          >
            Ver Serviços & Preços
          </a>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-8 border-t border-[#C9A84C]/20">
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[#121212]/70 border border-white/5">
            <Clock className="w-5 h-5 text-[#C9A84C]" />
            <div className="text-left">
              <p className="text-xs text-gray-400">Horário</p>
              <p className="text-sm font-semibold text-white">{hoursText}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[#121212]/70 border border-white/5">
            <MapPin className="w-5 h-5 text-[#C9A84C]" />
            <div className="text-left">
              <p className="text-xs text-gray-400">Localização</p>
              <p className="text-sm font-semibold text-white">Centro • Arujá-SP</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-[#121212]/70 border border-white/5">
            <Star className="w-5 h-5 text-[#C9A84C] fill-[#C9A84C]" />
            <div className="text-left">
              <p className="text-xs text-gray-400">Avaliação</p>
              <p className="text-sm font-semibold text-white">Excelência 5 Estrelas</p>
            </div>
          </div>
        </div>
      </div>

      <a href="#sobre" aria-label="Próxima seção" className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </a>
    </section>
  );
}
