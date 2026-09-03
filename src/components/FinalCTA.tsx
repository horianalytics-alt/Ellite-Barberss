import React from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export function FinalCTA() {
  const { siteConfig } = useSiteData();
  const { booksyUrl } = siteConfig;

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-r from-[#C9A84C] via-[#E5C875] to-[#B8963B] text-black">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/10 blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-black mb-6 leading-tight">
          Pronto para o próximo nível?
        </h2>
        <p className="text-base sm:text-xl text-neutral-900 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
          Garanta seu horário na barbearia de maior destaque em Arujá. Atendimento de excelência, ambiente sofisticado e profissionais prontos para transformar seu visual.
        </p>
        <a
          href={booksyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-[#0a0a0a] text-white font-serif font-bold text-base sm:text-lg tracking-wider uppercase shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:bg-black hover:scale-105 transition-all duration-300 group"
        >
          <Calendar className="w-5 h-5 text-[#C9A84C]" />
          <span>Agendar Agora</span>
          <ArrowRight className="w-5 h-5 text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
