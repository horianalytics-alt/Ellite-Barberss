import React from "react";
import { Camera, Sparkles, ZoomIn, Scissors } from "lucide-react";

export function Gallery() {
  const galleryItems = [
    {
      id: 1,
      title: "Degradê Fade & Barba Alinhada",
      category: "Corte & Barboterapia",
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Corte Clássico & Penteado Pompadour",
      category: "Estilo Clássico",
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Barba Terapia com Toalha Quente",
      category: "Barba de Elite",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Platinado & Texturização",
      category: "Química & Cor",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Visagismo e Design de Sobrancelha",
      category: "Harmonização",
      image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "Ambiente e Acabamento Preciso",
      category: "Experiência Ellite",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section id="galeria" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#141414] mb-4">
            <Camera className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">
              Portfólio & Estilo
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6">
            Nossos <span className="text-gold-gradient">Trabalhos</span>
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-6" />
          <p className="text-base sm:text-lg text-gray-300 font-light">
            Confira a qualidade impecável, precisão nos detalhes e a satisfação que entregamos em cada atendimento.
          </p>
        </div>

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative h-80 rounded-2xl overflow-hidden border border-[#C9A84C]/20 hover:border-[#C9A84C] transition-all duration-500 bg-[#121212] shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(201,168,76,0.2)]"
            >
              {/* Image with zoom on hover */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Gold Top Light Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C]/0 to-transparent group-hover:via-[#C9A84C] transition-all duration-500" />

              {/* Content on bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[11px] font-semibold tracking-widest text-[#C9A84C] uppercase mb-1">
                  {item.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">
                  {item.title}
                </h3>
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
