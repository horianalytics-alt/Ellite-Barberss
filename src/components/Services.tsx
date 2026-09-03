import React, { useState } from "react";
import { Scissors, Flame, Clock, Calendar, X } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";
import type { ServiceItem } from "../lib/supabase-db";

export function Services() {
  const { siteConfig, services } = useSiteData();
  const { booksyUrl } = siteConfig;
  const [activeTab, setActiveTab] = useState<"all" | "cabelo" | "outros">("all");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const eliteServices = services.filter((s) => s.category === "cabelo").sort((a, b) => a.order - b.order);
  const otherServices = services.filter((s) => s.category === "outros").sort((a, b) => a.order - b.order);

  const renderServiceCard = (service: ServiceItem, isElite: boolean) => {
    const hasPhoto = !!service.imageUrl;
    
    return (
      <div
        key={service.id}
        className={`group relative rounded-2xl bg-[#121212] border ${
          isElite ? "border-[#C9A84C]/25 hover:border-[#C9A84C]" : "border-white/10 hover:border-[#C9A84C]/70"
        } transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] flex flex-col justify-between`}
      >
        {service.popular && (
          <span className="absolute top-2 right-2 sm:-top-3 sm:right-6 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#8C7126] to-[#C9A84C] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-black z-10 shadow-lg">
            <Flame className="w-3 h-3 text-black fill-black" /> Destaque
          </span>
        )}

        {hasPhoto && (
          <div className="w-full h-[150px] sm:h-[200px] shrink-0 rounded-t-[15px] overflow-hidden">
            <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        )}

        <div className={`flex-1 flex flex-col ${hasPhoto ? "p-4" : "p-5 sm:p-6"}`}>
          <div className={`${hasPhoto ? "flex flex-col mb-2" : "flex items-baseline justify-between gap-4 mb-2"}`}>
            <h4 className={`font-serif font-bold text-white group-hover:text-[#E0C068] transition-colors ${hasPhoto ? "text-base sm:text-lg mb-1 leading-tight" : (isElite ? "text-xl" : "text-lg")}`}>
              {service.name}
            </h4>
            <span className={`font-serif font-bold text-[#C9A84C] shrink-0 animate-[pulse_3s_ease-in-out_infinite] ${hasPhoto ? "text-lg sm:text-[22px]" : (isElite ? "text-[22px] sm:text-[26px]" : "text-lg sm:text-[20px]")}`}>
              {service.price}
            </span>
          </div>
          
          <div className={`flex items-center gap-1.5 text-xs text-[#A0A0A0] font-medium mb-3 ${hasPhoto && "hidden sm:flex"}`}>
            <Clock className="w-3.5 h-3.5 text-[#C9A84C]/70" />
            <span>{service.time}</span>
          </div>
          
          {!hasPhoto && service.description && (
            <p className="text-sm text-[#A0A0A0] font-normal mb-5 line-clamp-3">{service.description}</p>
          )}

          <div className="mt-auto pt-4 border-t border-[#C9A84C]/20">
            {hasPhoto ? (
              <button
                onClick={() => setSelectedService(service)}
                className={`w-full inline-flex items-center justify-center gap-2 py-3 px-3 min-h-[52px] rounded-xl ${isElite ? "bg-[#C9A84C] text-[#0a0a0a]" : "border border-[#C9A84C] text-[#C9A84C]"} font-bold uppercase text-[11px] sm:text-xs tracking-wider transition-all duration-300 hover:scale-[1.02]`}
              >
                Detalhes
              </button>
            ) : (
              <a
                href={booksyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 py-3 px-5 min-h-[52px] rounded-xl ${isElite ? "bg-[#C9A84C] text-[#0a0a0a] hover:bg-[#E0C068]" : "border-2 border-[#C9A84C] bg-transparent text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0a0a0a]"} text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300`}
              >
                {isElite && <Calendar className="w-4 h-4" />}
                Agendar
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  const eliteHasPhotos = eliteServices.some(s => !!s.imageUrl);
  const otherHasPhotos = otherServices.some(s => !!s.imageUrl);

  return (
    <section id="servicos" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#141414] mb-4">
            <Scissors className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">Tabela de Serviços</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6">
            Serviços & <span className="text-gold-gradient">Preços</span>
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-6" />
          <p className="text-base sm:text-lg text-gray-300 font-light">
            Escolha o procedimento desejado e garanta seu horário de forma rápida e prática no Booksy.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {(["all", "cabelo", "outros"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 min-h-[52px] flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.4)]"
                    : "bg-[#141414] text-gray-300 border border-white/10 hover:border-[#C9A84C]/50 hover:text-white"
                }`}
              >
                {tab === "all" ? "Todos os Serviços" : tab === "cabelo" ? "Cabelo de Ellite" : "Outros Serviços"}
              </button>
            ))}
          </div>
        </div>

        {/* Cabelo de Ellite */}
        {(activeTab === "all" || activeTab === "cabelo") && eliteServices.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#C9A84C] rounded-full" />
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">Cabelo de Ellite</h3>
                <p className="text-xs sm:text-sm text-[#C9A84C]/90 uppercase tracking-wider">Nossos serviços principais e mais requisitados</p>
              </div>
            </div>
            <div className={`grid ${eliteHasPhotos ? "grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" : "grid-cols-1 md:grid-cols-2 gap-6"}`}>
              {eliteServices.map((s) => renderServiceCard(s, true))}
            </div>
          </div>
        )}

        {/* Outros Serviços */}
        {(activeTab === "all" || activeTab === "outros") && otherServices.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#C9A84C] rounded-full" />
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">Outros Serviços</h3>
                <p className="text-xs sm:text-sm text-[#C9A84C]/90 uppercase tracking-wider">Tratamentos químicos, estética e acabamentos</p>
              </div>
            </div>
            <div className={`grid ${otherHasPhotos ? "grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
              {otherServices.map((s) => renderServiceCard(s, false))}
            </div>
          </div>
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-300">
          <div className="w-full sm:max-w-md bg-[#101010] sm:rounded-[20px] rounded-t-[20px] rounded-b-none border border-[#C9A84C]/30 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-400 max-h-[90vh] flex flex-col">
            {selectedService.imageUrl && (
              <div className="relative w-full h-48 sm:h-56 shrink-0">
                <img src={selectedService.imageUrl} alt={selectedService.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] to-transparent" />
              </div>
            )}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white/20 transition-all z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <h3 className="font-serif text-2xl font-bold text-white">{selectedService.name}</h3>
                <span className="font-serif text-2xl font-bold text-[#C9A84C] shrink-0">{selectedService.price}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-[#C9A84C]/80 font-medium mb-6">
                <Clock className="w-4 h-4" />
                <span>{selectedService.time} de atendimento</span>
              </div>
              
              <div className="space-y-4 text-sm text-gray-300 leading-relaxed mb-8">
                <p>{selectedService.description || "Agende agora mesmo e garanta um atendimento de excelência com nossos profissionais de alto padrão."}</p>
              </div>

              <a
                href={booksyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSelectedService(null)}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl min-h-[56px] bg-[#C9A84C] text-[#0a0a0a] font-bold uppercase tracking-wider text-sm hover:scale-[1.02] hover:bg-[#E0C068] transition-all shadow-[0_0_20px_rgba(201,168,76,0.3)]"
              >
                <Calendar className="w-5 h-5" />
                Agendar no Booksy
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
