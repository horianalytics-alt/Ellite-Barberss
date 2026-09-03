import React, { useState } from "react";
import { Clock, Scissors, Sparkles, Calendar, Check, Flame } from "lucide-react";

interface ServicesProps {
  booksyUrl: string;
}

interface ServiceItem {
  id: string;
  name: string;
  price: string;
  time: string;
  description?: string;
  popular?: boolean;
}

export function Services({ booksyUrl }: ServicesProps) {
  const [activeTab, setActiveTab] = useState<"all" | "cabelo" | "outros">("all");

  const eliteServices: ServiceItem[] = [
    {
      id: "corte-barba",
      name: "Corte & Barba",
      price: "R$ 80,00",
      time: "1h",
      description: "Combo completo: corte personalizado com visagismo, toalha quente e alinhamento de barba.",
      popular: true,
    },
    {
      id: "corte-cabelo",
      name: "Corte de Cabelo",
      price: "R$ 50,00",
      time: "30min",
      description: "Corte na tesoura ou máquina com lavagem e finalização profissional.",
      popular: true,
    },
    {
      id: "barba-simples",
      name: "Barba Simples",
      price: "R$ 45,00",
      time: "30min",
      description: "Alinhamento com navalha, produtos hidratantes e pós-barba refrescante.",
    },
    {
      id: "barba-terapia",
      name: "Barba Terapia",
      price: "R$ 25,00",
      time: "15min",
      description: "Tratamento relaxante com vapor de ozônio, toalha quente e óleos essenciais.",
    },
  ];

  const otherServices: ServiceItem[] = [
    {
      id: "pigmentacao-corte",
      name: "Pigmentação Corte",
      price: "R$ 35,00",
      time: "30min",
      description: "Destaque e definição dos contornos do corte com pigmento natural.",
    },
    {
      id: "pigmentacao-barba",
      name: "Pigmentação Barba",
      price: "R$ 35,00",
      time: "30min",
      description: "Preenchimento de falhas e uniformização do tom da barba.",
    },
    {
      id: "sobrancelha",
      name: "Sobrancelha",
      price: "R$ 15,00",
      time: "15min",
      description: "Design e alinhamento preciso na navalha ou pinça.",
    },
    {
      id: "acabamento",
      name: "Acabamento",
      price: "R$ 15,00",
      time: "15min",
      description: "Pézinho e contornos limpos para manter o visual em dia.",
    },
    {
      id: "penteado",
      name: "Penteado",
      price: "R$ 30,00",
      time: "20min",
      description: "Modelagem e fixação para ocasiões especiais ou dia a dia.",
    },
    {
      id: "hidratacao",
      name: "Hidratação",
      price: "R$ 35,00",
      time: "30min",
      description: "Nutrição profunda e recuperação dos fios danificados.",
    },
    {
      id: "botox-capilar",
      name: "Botox Capilar",
      price: "R$ 80,00",
      time: "30min",
      description: "Alinhamento, redução de volume e brilho intenso aos cabelos.",
    },
    {
      id: "selagem",
      name: "Selagem",
      price: "R$ 90,00",
      time: "40min",
      description: "Tratamento reconstrutor térmico para blindagem dos fios.",
    },
    {
      id: "progressiva",
      name: "Progressiva",
      price: "R$ 90,00",
      time: "30min",
      description: "Alisamento duradouro e controle total do frizz.",
    },
    {
      id: "relaxamento",
      name: "Relaxamento",
      price: "R$ 60,00",
      time: "30min",
      description: "Redução de volume e soltura dos cachos com naturalidade.",
    },
    {
      id: "luzes",
      name: "Luzes",
      price: "R$ 110,00",
      time: "2h",
      description: "Mechas e iluminação personalizada para renovar seu visual.",
    },
    {
      id: "platinado",
      name: "Platinado",
      price: "A partir de R$ 160,00",
      time: "2h30min",
      description: "Descoloração global de alto impacto com proteção capilar.",
      popular: true,
    },
  ];

  return (
    <section id="servicos" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#141414] mb-4">
            <Scissors className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">
              Tabela de Serviços
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6">
            Serviços & <span className="text-gold-gradient">Preços</span>
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-6" />
          <p className="text-base sm:text-lg text-gray-300 font-light">
            Escolha o procedimento desejado e garanta seu horário de forma rápida e prática no Booksy.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.4)]"
                  : "bg-[#141414] text-gray-300 border border-white/10 hover:border-[#C9A84C]/50 hover:text-white"
              }`}
            >
              Todos os Serviços
            </button>
            <button
              onClick={() => setActiveTab("cabelo")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === "cabelo"
                  ? "bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.4)]"
                  : "bg-[#141414] text-gray-300 border border-white/10 hover:border-[#C9A84C]/50 hover:text-white"
              }`}
            >
              Cabelo de Ellite
            </button>
            <button
              onClick={() => setActiveTab("outros")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === "outros"
                  ? "bg-[#C9A84C] text-black shadow-[0_0_15px_rgba(201,168,76,0.4)]"
                  : "bg-[#141414] text-gray-300 border border-white/10 hover:border-[#C9A84C]/50 hover:text-white"
              }`}
            >
              Outros Serviços
            </button>
          </div>
        </div>

        {/* Section 1: Cabelo de Ellite */}
        {(activeTab === "all" || activeTab === "cabelo") && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#C9A84C] rounded-full" />
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Cabelo de Ellite
                </h3>
                <p className="text-xs sm:text-sm text-[#C9A84C]/90 uppercase tracking-wider">
                  Nossos serviços principais e mais requisitados
                </p>
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
                  <div>
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h4 className="font-serif text-xl font-bold text-white group-hover:text-[#E0C068] transition-colors">
                        {service.name}
                      </h4>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-gold-gradient shrink-0">
                        {service.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#C9A84C]/80 font-medium mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{service.time} de atendimento</span>
                    </div>

                    {service.description && (
                      <p className="text-sm text-gray-400 font-light mb-6">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <a
                    href={booksyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#C9A84C]/40 bg-black/40 text-xs font-semibold uppercase tracking-wider text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black transition-all duration-300"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Agendar este Serviço
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Outros Serviços */}
        {(activeTab === "all" || activeTab === "outros") && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-[#C9A84C] rounded-full" />
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Outros Serviços
                </h3>
                <p className="text-xs sm:text-sm text-[#C9A84C]/90 uppercase tracking-wider">
                  Tratamentos químicos, estética e acabamentos
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServices.map((service) => (
                <div
                  key={service.id}
                  className="group relative p-5 rounded-2xl bg-[#121212] border border-white/10 hover:border-[#C9A84C]/70 transition-all duration-300 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#E0C068] transition-colors">
                        {service.name}
                      </h4>
                      <span className="font-serif text-base font-bold text-[#C9A84C] shrink-0">
                        {service.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-3">
                      <Clock className="w-3.5 h-3.5 text-[#C9A84C]/70" />
                      <span>{service.time}</span>
                    </div>

                    {service.description && (
                      <p className="text-xs text-gray-400 font-light mb-5">
                        {service.description}
                      </p>
                    )}
                  </div>

                  <a
                    href={booksyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 bg-black/40 text-[11px] font-semibold uppercase tracking-wider text-gray-300 group-hover:border-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black transition-all duration-300"
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
