import React from "react";
import { Sparkles, Check, Crown, Calendar, Users, Zap } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";
import { type PackageItem } from "../lib/firestore";

export function Packages() {
  const { siteConfig, packages } = useSiteData();
  const { booksyUrl } = siteConfig;

  const sorted = [...packages].sort((a, b) => a.order - b.order);
  const highlighted = sorted.find((p) => p.highlighted);
  const regular = sorted.filter((p) => !p.highlighted);

  // Render a single card
  const renderCard = (pkg: PackageItem, isVip: boolean) => (
    <div
      key={pkg.id}
      className={`relative flex flex-col justify-between ${
        isVip
          ? "p-8 sm:p-9 rounded-3xl bg-gradient-to-b from-[#1c170b] via-[#14120e] to-[#0f0e0c] border-2 border-[#C9A84C] shadow-[0_0_40px_rgba(201,168,76,0.25)] lg:-translate-y-2"
          : "p-8 rounded-3xl bg-[#121212] border border-white/15 hover:border-[#C9A84C]/60 transition-all duration-300 shadow-xl"
      }`}
    >
      {isVip && pkg.badgeText && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#C9A84C] via-[#E0C068] to-[#C9A84C] text-black font-bold text-xs uppercase tracking-widest shadow-lg">
          <Crown className="w-3.5 h-3.5 fill-black" /> {pkg.badgeText}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-4 mb-4 mt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
            isVip ? "bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#E0C068]" : "bg-white/5 border border-white/10 text-gray-300"
          }`}>
            {isVip ? <><Users className="w-3.5 h-3.5" /> Família</> : "Individual"}
          </span>
          <span className="text-xs font-medium text-gray-400">Renovação Mensal</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">{pkg.name}</h3>
        <p className="text-sm text-gray-400 font-light mb-6">{pkg.description}</p>

        <div className={`flex items-baseline gap-2 mb-8 pb-6 border-b ${isVip ? "border-[#C9A84C]/30" : "border-white/10"}`}>
          <span className="text-xs text-gray-400">R$</span>
          <span className={`font-serif text-4xl sm:text-5xl font-bold ${isVip ? "text-gold-gradient" : "text-white"}`}>
            {pkg.price.split(",")[0]}
            <span className="text-2xl text-[#C9A84C]">,{pkg.price.split(",")[1] ?? "99"}</span>
          </span>
          <span className="text-sm text-gray-400 font-normal">/mês</span>
        </div>

        <ul className="space-y-4 mb-8">
          {pkg.benefits.map((benefit, i) => (
            <li key={i} className="flex items-center gap-3 text-sm text-gray-200">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                isVip ? "bg-[#C9A84C]" : "bg-[#C9A84C]/20"
              }`}>
                <Check className={`w-3.5 h-3.5 ${isVip ? "text-black" : "text-[#C9A84C]"}`} />
              </div>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={booksyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
          isVip
            ? "bg-gradient-to-r from-[#C9A84C] via-[#E0C068] to-[#C9A84C] text-black shadow-[0_0_25px_rgba(201,168,76,0.4)] hover:shadow-[0_0_35px_rgba(201,168,76,0.6)] hover:scale-[1.02] font-serif"
            : "border border-[#C9A84C]/50 bg-black/60 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black"
        }`}
      >
        {isVip ? <Zap className="w-4 h-4 fill-black" /> : <Calendar className="w-4 h-4" />}
        {isVip ? "Garantir Pacote " + pkg.name : "Contratar Pacote Individual"}
      </a>
    </div>
  );

  return (
    <section id="pacotes" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-center-gold pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#141414] mb-4">
            <Crown className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">Planos & Assinaturas</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6">
            Pacotes <span className="text-gold-gradient">Mensais Exclusivos</span>
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-6" />
          <p className="text-base sm:text-lg text-gray-300 font-light">
            Mantenha o seu visual sempre impecável com economia e prioridade no atendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {regular.map((pkg) => renderCard(pkg, false))}
          {highlighted && renderCard(highlighted, true)}
        </div>
      </div>
    </section>
  );
}
