import React from "react";
import { Scissors, MapPin, Clock, Phone, Instagram, Calendar } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export function Footer() {
  const { siteConfig } = useSiteData();
  const { booksyUrl, whatsappUrl, address, hoursText } = siteConfig;
  return (
    <footer className="bg-[#070707] text-gray-400 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-[#C9A84C]/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#C9A84C] flex items-center justify-center bg-black/60 shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                <Scissors className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-[0.2em] text-white uppercase">
                  Ellite Barberss
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#C9A84C] font-medium">
                  Arujá • SP
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Barbearia de alto padrão com serviços de excelência em corte, barba e tratamentos masculinos. Tradição e estilo no mesmo lugar.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#141414] border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#sobre" className="hover:text-[#C9A84C] transition-colors">
                  A Barbearia
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-[#C9A84C] transition-colors">
                  Tabela de Serviços & Preços
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-[#C9A84C] transition-colors">
                  Galeria de Trabalhos
                </a>
              </li>
              <li>
                <a href="#pacotes" className="hover:text-[#C9A84C] transition-colors">
                  Pacotes Mensais
                </a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-[#C9A84C] transition-colors">
                  Localização & Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest mb-4">
              Horários
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-[#E0C068] font-bold">{hoursText}</p>
              <p className="text-gray-500 pt-2">
                Atendimento por agendamento via Booksy ou ordem de chegada.
              </p>
            </div>
          </div>

          {/* Address & Booking */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-widest mb-4">
              Agendamento
            </h4>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              {address}
            </p>
            <a
              href={booksyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#141414] border border-[#C9A84C] text-xs font-semibold uppercase tracking-wider text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all duration-300 w-full"
            >
              <Calendar className="w-3.5 h-3.5" />
              Agendar no Booksy
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} ELLITE BARBERSS. Todos os direitos reservados.</p>
          <p className="text-gray-400">
            Arujá - SP • Tradição, Estilo e Alto Padrão
          </p>
        </div>
      </div>
    </footer>
  );
}
