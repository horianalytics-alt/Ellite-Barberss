import React from "react";
import { Sparkles, Check, Crown, Calendar, Users, Zap } from "lucide-react";

interface PackagesProps {
  booksyUrl: string;
}

export function Packages({ booksyUrl }: PackagesProps) {
  return (
    <section id="pacotes" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-center-gold pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#141414] mb-4">
            <Crown className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">
              Planos & Assinaturas
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6">
            Pacotes <span className="text-gold-gradient">Mensais Exclusivos</span>
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-6" />
          <p className="text-base sm:text-lg text-gray-300 font-light">
            Mantenha o seu visual e o do seu filho sempre impecáveis durante todo o mês com economia e prioridade no atendimento.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Card 1: 4 Cortes por Mês */}
          <div className="relative p-8 rounded-3xl bg-[#121212] border border-white/15 hover:border-[#C9A84C]/60 transition-all duration-300 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Individual
                </span>
                <span className="text-xs text-gray-400 font-medium">Renovação Mensal</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                4 Cortes por Mês
              </h3>
              <p className="text-sm text-gray-400 font-light mb-6">
                Ideal para homens que não abrem mão do corte sempre alinhado toda semana.
              </p>

              <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-white/10">
                <span className="text-xs text-gray-400">R$</span>
                <span className="font-serif text-4xl sm:text-5xl font-bold text-white">
                  149<span className="text-2xl text-[#C9A84C]">,99</span>
                </span>
                <span className="text-sm text-gray-400 font-normal">/mês</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-200">
                  <div className="w-5 h-5 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
                  </div>
                  <span><strong>4 Cortes de Cabelo</strong> durante o mês (1 por semana)</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-200">
                  <div className="w-5 h-5 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
                  </div>
                  <span>Lavagem e finalização com pomada premium</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-200">
                  <div className="w-5 h-5 rounded-full bg-[#C9A84C]/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
                  </div>
                  <span>Agendamento flexível de segunda a domingo</span>
                </li>
              </ul>
            </div>

            <a
              href={booksyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl border border-[#C9A84C]/50 bg-black/60 text-sm font-semibold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all duration-300"
            >
              <Calendar className="w-4 h-4" />
              Contratar Pacote Individual
            </a>
          </div>

          {/* Card 2: Destaque Dourado VIP - Você e Seu Filho */}
          <div className="relative p-8 sm:p-9 rounded-3xl bg-gradient-to-b from-[#1c170b] via-[#14120e] to-[#0f0e0c] border-2 border-[#C9A84C] shadow-[0_0_40px_rgba(201,168,76,0.25)] flex flex-col justify-between transform lg:-translate-y-2">
            {/* Top Highlight Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#C9A84C] via-[#E0C068] to-[#C9A84C] text-black font-bold text-xs uppercase tracking-widest shadow-lg">
              <Crown className="w-3.5 h-3.5 fill-black" /> Mais Vantajoso • Campeão
            </div>

            <div>
              <div className="flex items-center justify-between gap-4 mb-4 mt-2">
                <span className="px-3 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-xs font-bold uppercase tracking-wider text-[#E0C068] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Pai & Filho
                </span>
                <span className="text-xs text-[#E0C068] font-medium">Super Econômico</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
                Você e Seu Filho
              </h3>
              <p className="text-sm text-gray-300 font-light mb-6">
                O melhor custo-benefício para manter pai e filho com o corte em dia juntos.
              </p>

              <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-[#C9A84C]/30">
                <span className="text-xs text-gray-400">R$</span>
                <span className="font-serif text-4xl sm:text-5xl font-bold text-gold-gradient">
                  159<span className="text-2xl text-[#C9A84C]">,99</span>
                </span>
                <span className="text-sm text-gray-400 font-normal">/mês</span>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-100 font-medium">
                  <div className="w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-black font-bold" />
                  </div>
                  <span><strong>4 Cortes por mês</strong> para usar em família</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-[#E0C068] font-bold">
                  <div className="w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-black font-bold" />
                  </div>
                  <span>Bônus Exclusivo: Sobrancelha Grátis incluída</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-200">
                  <div className="w-5 h-5 rounded-full bg-[#C9A84C]/40 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
                  </div>
                  <span>Lavagem e finalização premium para ambos</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-200">
                  <div className="w-5 h-5 rounded-full bg-[#C9A84C]/40 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#C9A84C]" />
                  </div>
                  <span>Prioridade e flexibilidade total de horários</span>
                </li>
              </ul>
            </div>

            <a
              href={booksyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-[#C9A84C] via-[#E0C068] to-[#C9A84C] text-sm font-serif font-bold uppercase tracking-wider text-black shadow-[0_0_25px_rgba(201,168,76,0.4)] hover:shadow-[0_0_35px_rgba(201,168,76,0.6)] hover:scale-[1.02] transition-all duration-300"
            >
              <Zap className="w-4 h-4 fill-black" />
              Garantir Pacote Pai e Filho
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
