import React, { useState, useEffect, useRef } from "react";
import { Camera, Scissors, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export function Gallery() {
  const { gallery } = useSiteData();
  const sorted = [...gallery].sort((a, b) => a.order - b.order);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Sync activeIndex with scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Autoplay
  useEffect(() => {
    if (isHovered || lightboxIndex !== null) return;
    const interval = setInterval(() => {
      if (!scrollRef.current || sorted.length === 0) return;
      let nextIndex = activeIndex + 1;
      if (nextIndex >= sorted.length) nextIndex = 0;
      scrollToIndex(nextIndex);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex, isHovered, lightboxIndex, sorted.length]);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: index * clientWidth, behavior: 'smooth' });
    setActiveIndex(index);
  };

  // Lightbox Swipe Support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || lightboxIndex === null || !e.changedTouches[0]) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50 && lightboxIndex! < sorted.length - 1) {
      setLightboxIndex(lightboxIndex! + 1);
    } else if (diff < -50 && lightboxIndex! > 0) {
      setLightboxIndex(lightboxIndex! - 1);
    }
    setTouchStart(null);
  };

  if (sorted.length === 0) return null;

  return (
    <section id="galeria" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
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

        {/* Carousel Container */}
        <div 
          className="relative max-w-4xl mx-auto group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsHovered(false), 2000); // Resume shortly after touch ends
          }}
        >
          {/* Desktop Arrows */}
          <button 
            onClick={() => scrollToIndex(activeIndex > 0 ? activeIndex - 1 : sorted.length - 1)}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/50 border border-[#C9A84C]/40 text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C9A84C] hover:text-black"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scrollToIndex(activeIndex < sorted.length - 1 ? activeIndex + 1 : 0)}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full bg-black/50 border border-[#C9A84C]/40 text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#C9A84C] hover:text-black"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Swipeable Viewport */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-2xl shadow-[0_0_30px_rgba(201,168,76,0.15)]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sorted.map((item, idx) => (
              <div 
                key={item.id} 
                className="w-full shrink-0 snap-center px-2 pb-2 sm:px-0 sm:pb-0"
              >
                <div 
                  className="relative aspect-square sm:aspect-video w-full rounded-[16px] sm:rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <img
                    src={item.url}
                    alt="Trabalho Ellite Barberss"
                    className="w-full h-full object-cover object-center transition-transform duration-[400ms] hover:scale-105"
                  />
                  {/* Subtle badge */}
                  <div className="absolute bottom-4 right-4 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#C9A84C]/40 text-[11px] font-semibold text-[#E0C068] tracking-wider uppercase">
                      <Scissors className="w-3 h-3 text-[#C9A84C]" /> Ellite
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gold Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {sorted.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === idx 
                    ? "w-6 h-2 bg-[#C9A84C]" 
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Ir para a imagem ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/95 backdrop-blur-md animate-in fade-in duration-300"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-[#C9A84C] hover:text-black transition-all z-50"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <button 
              onClick={(e) => { e.stopPropagation(); if (lightboxIndex! > 0) setLightboxIndex(lightboxIndex! - 1); }}
              className={`absolute left-4 z-50 p-3 rounded-full bg-black/50 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all ${lightboxIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              key={lightboxIndex}
              src={sorted[lightboxIndex!]!.url}
              alt="Ampliado"
              className="max-w-full max-h-[90vh] object-contain rounded-lg animate-in zoom-in-95 duration-300 shadow-[0_0_50px_rgba(201,168,76,0.1)]"
            />

            <button 
              onClick={(e) => { e.stopPropagation(); if (lightboxIndex! < sorted.length - 1) setLightboxIndex(lightboxIndex! + 1); }}
              className={`absolute right-4 z-50 p-3 rounded-full bg-black/50 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all ${lightboxIndex === sorted.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
          
          {/* Caption */}
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
             <p className="text-white/70 text-sm font-medium">
               {lightboxIndex! + 1} de {sorted.length}
             </p>
          </div>
        </div>
      )}
    </section>
  );
}
