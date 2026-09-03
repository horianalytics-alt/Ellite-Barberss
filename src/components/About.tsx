import React from "react";
import { Award, Clock, ShieldCheck, Sparkles, Scissors, Users } from "lucide-react";

export function About() {
  return (
    <section id="sobre" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0d0d0d] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial-center-gold pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#141414] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">
              Sobre Nós
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-6">
            A <span className="text-gold-gradient">Ellite Barberss</span>
          </h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mb-8" />
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed font-light">
            Somos uma barbearia de referência em <span className="text-white font-medium">Arujá-SP</span>. 
            Estilo, qualidade e atendimento de primeira — do corte à barba, cada detalhe importa.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Visual Showcase (Image with luxury frame) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#C9A84C]/30 shadow-[0_0_30px_rgba(201,168,76,0.15)] group">
              <img
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80"
                alt="Barbearia Ellite Barberss"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10">
                <p className="text-xs text-[#C9A84C] uppercase tracking-widest font-semibold mb-1">
                  Ambiente Exclusivo
                </p>
                <p className="text-sm text-gray-200">
                  Estrutura projetada para proporcionar conforto, descontração e uma experiência única.
                </p>
              </div>
            </div>
            {/* Decorative Gold Accent Badge */}
            <div className="absolute -bottom-5 -right-5 hidden sm:flex items-center gap-3 px-5 py-3 rounded-xl bg-[#141414] border border-[#C9A84C] shadow-xl">
              <Award className="w-6 h-6 text-[#C9A84C]" />
              <div>
                <p className="text-xs text-gray-400">Padrão de Qualidade</p>
                <p className="text-sm font-bold text-white">100% Garantido</p>
              </div>
            </div>
          </div>

          {/* Pillars and Schedule */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-[#C9A84C]/40 flex items-center justify-center shrink-0">
                  <Scissors className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    Profissionais de Alto Padrão
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Barbeiros qualificados e sempre atualizados com as melhores técnicas de corte clássico, moderno, visagismo e barboterapia.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-[#C9A84C]/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">
                    Produtos & Higiene Rigorosa
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Utilizamos cosméticos masculinos premium e rigoroso controle de esterilização e toalhas quentes descartáveis/higienizadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#181611] to-[#141414] border border-[#C9A84C]/40 shadow-[0_0_25px_rgba(201,168,76,0.1)]">
              <div className="flex items-center gap-4 mb-2">
                <Clock className="w-6 h-6 text-[#C9A84C]" />
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#E0C068]">
                  Horário de Funcionamento
                </h4>
              </div>
              <p className="text-gray-200 text-base font-medium">
                Segunda a Domingo: <span className="text-[#C9A84C] font-bold">09h às 20h</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Atendimento pontual com horário agendado ou por ordem de chegada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
