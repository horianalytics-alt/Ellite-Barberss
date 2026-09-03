import React, { useState } from "react";
import { X } from "lucide-react";
import { useSiteData } from "../context/SiteDataContext";

export function WhatsAppButton() {
  const { siteConfig } = useSiteData();
  const { whatsappUrl } = siteConfig;
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-20 right-6 z-50 flex items-center gap-3">
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#141414] border border-[#C9A84C]/40 text-white shadow-2xl animate-in fade-in slide-in-from-right-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#C9A84C] font-semibold uppercase tracking-wider">Atendimento Online</span>
            <span className="text-xs font-medium text-gray-200">Dúvidas? Fale conosco no WhatsApp</span>
          </div>
          <button onClick={() => setShowTooltip(false)} aria-label="Fechar" className="text-gray-400 hover:text-white ml-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Conversar no WhatsApp da Ellite Barberss"
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-[0_4px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_35px_rgba(37,211,102,0.7)] hover:scale-110 transition-all duration-300"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 group-hover:opacity-75 animate-ping pointer-events-none" />
        <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.397-12.416c-5.518 0-10.005 4.482-10.007 10.001 0 1.927.548 3.727 1.503 5.253l-1.528 5.586 5.733-1.504c1.477.834 3.186 1.289 4.975 1.289 5.517 0 10.005-4.482 10.007-10.001.002-5.522-4.484-10.024-9.683-10.024z" />
        </svg>
      </a>
    </div>
  );
}
