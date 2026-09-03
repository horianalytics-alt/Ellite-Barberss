import React, { useState } from "react";
import { Clock, Scissors, Sparkles, Calendar, Check, Flame } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export function Services() {
  const { siteConfig, services } = useSiteData();
  const { booksyUrl } = siteConfig;
  const [activeTab, setActiveTab] = useState<"all" | "cabelo" | "outros">("all");

  const eliteServices = services.filter((s) => s.category === "cabelo").sort((a, b) => a.order - b.order);
  const otherServices = services.filter((s) => s.category === "outros").sort((a, b) => a.order - b.order);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eliteServices.map((service) => (
                <div
                  key={service.id}
                  className="group relative p-6 rounded-2xl bg-[#121212] border border-[#C9A84C]/25 hover:border-[#C9A84C] transition-all duration-300 hover:shadow-[0_0_25px_rgba(201,168,76,0.18)] flex flex-col justify-between"
                >
                  {service.popular && (
                    <span className="absolute -top-3 right-6 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#8C7126] to-[#C9A84C] text-[10px] font-bold uppercase tracking-wider text-black">
                      <Flame className="w-3 h-3 text-black fill-black" /> Destaque
                    </span>
                  )}
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h4 className="font-serif text-xl font-bold text-white group-hover:text-[#E0C068] transition-colors">{service.name}</h4>
                      <span className="font-serif text-[22px] sm:text-[26px] font-bold text-[#C9A84C] shrink-0 animate-[pulse_3s_ease-in-out_infinite]">{service.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#C9A84C]/80 font-medium mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.time} de atendimento</span>
                    </div>
                    {service.description && (
                      <p className="text-sm text-[#A0A0A0] font-normal opacity-100 mb-6">{service.description}</p>
                    )}
                  </div>
                  <div className="w-full h-[1px] bg-[#C9A84C]/20 mb-5 mt-2" />
                  <a
                    href={booksyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 min-h-[52px] rounded-xl bg-[#C9A84C] text-[#0a0a0a] font-bold uppercase tracking-wider hover:bg-[#E0C068] transition-all duration-300"
                  >
                    <Calendar className="w-4 h-4" />
                    Agendar este Serviço
                  </a>
                </div>
              ))}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServices.map((service) => (
                <div
                  key={service.id}
                  className="group relative p-5 rounded-2xl bg-[#121212] border border-white/10 hover:border-[#C9A84C]/70 transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] flex flex-col justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#E0C068] transition-colors">{service.name}</h4>
                      <span className="font-serif text-lg sm:text-[20px] font-bold text-[#C9A84C] shrink-0 animate-[pulse_3s_ease-in-out_infinite]">{service.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#A0A0A0] font-medium mb-3">
                      <Clock className="w-3.5 h-3.5 text-[#C9A84C]/70" />
                      <span>{service.time}</span>
                    </div>
                    {service.description && (
                      <p className="text-sm text-[#A0A0A0] font-normal opacity-100 mb-5">{service.description}</p>
                    )}
                  </div>
                  <div className="w-full h-[1px] bg-[#C9A84C]/20 mb-4 mt-2" />
                  <a
                    href={booksyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 min-h-[52px] rounded-lg border-2 border-[#C9A84C] bg-transparent text-sm font-bold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0a0a0a] transition-all duration-300"
                  >
                    Agendar
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
