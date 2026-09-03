import React from "react";
import { Camera, Scissors } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export function Gallery() {
  const { gallery } = useSiteData();
  const sorted = [...gallery].sort((a, b) => a.order - b.order);

  return (
    <section id="galeria" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#141414] mb-4">
            <Camera className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">Portfólio & Estilo</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6">
            Nossos <span className="text-gold-gradient">Trabalhos</span>
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-6" />
          <p className="text-base sm:text-lg text-gray-300 font-light">
            Confira a qualidade impecável, precisão nos detalhes e a satisfação que entregamos em cada atendimento.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="group relative h-80 rounded-2xl overflow-hidden border border-[#C9A84C]/20 hover:border-[#C9A84C] transition-all duration-500 bg-[#121212] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C]/0 to-transparent group-hover:via-[#C9A84C] transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[11px] font-semibold tracking-widest text-[#C9A84C] uppercase mb-1">{item.category}</span>
                <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">{item.title}</h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-gray-300 font-medium flex items-center gap-1">
                    <Scissors className="w-3.5 h-3.5 text-[#C9A84C]" /> Padrão Ellite Barberss
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
