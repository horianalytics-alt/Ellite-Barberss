import React from "react";
import { MapPin, Clock, Phone, Navigation, ExternalLink } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export function Location() {
  const { siteConfig } = useSiteData();
  const { address, hoursText, whatsappUrl } = siteConfig;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const mapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3660.854619566938!2d-46.323565924765955!3d-23.39868777891361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce8751515ef861%3A0x738cb23e4e979a0!2sR.%20Prudente%20de%20Morais%2C%2010%20-%20Vila%20Flora%20Regina%2C%20Aruj%C3%A1%20-%20SP%2C%2007400-000!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr";

  return (
    <section id="localizacao" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#141414] mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">Onde Estamos</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6">
            Nossa <span className="text-gold-gradient">Localização</span>
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-6" />
          <p className="text-base sm:text-lg text-gray-300 font-light">
            De fácil acesso no coração de Arujá, com conforto e estacionamento nas proximidades.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="p-8 rounded-3xl bg-[#141414] border border-[#C9A84C]/30 shadow-xl space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-[#C9A84C]/50 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white mb-1">Endereço</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{address}</p>
                  <span className="inline-block mt-1 text-xs text-[#E0C068] font-medium">(Loja de frente para a rua)</span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/5" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-[#C9A84C]/50 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white mb-1">Horário de Atendimento</h3>
                  <p className="text-sm font-semibold text-[#E0C068]">{hoursText}</p>
                </div>
              </div>

              <div className="w-full h-[1px] bg-white/5" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0a0a0a] border border-[#C9A84C]/50 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white mb-1">Atendimento & Dúvidas</h3>
                  <p className="text-sm text-gray-300">WhatsApp: (11) 93470-6817</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#181818] border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                <Navigation className="w-4 h-4" />
                Como Chegar
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-[#181818] border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-md"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-7 h-[420px] lg:h-auto min-h-[380px] rounded-3xl overflow-hidden border border-[#C9A84C]/40 shadow-2xl relative">
            <iframe
              title="Localização Ellite Barberss Arujá"
              src={mapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(95%)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            <div className="absolute top-4 right-4 z-10">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-[#C9A84C]/50 text-xs text-[#E0C068] font-medium hover:bg-black transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir no Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
