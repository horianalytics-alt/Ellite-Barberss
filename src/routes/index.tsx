import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Gallery } from "../components/Gallery";
import { Packages } from "../components/Packages";
import { Location } from "../components/Location";
import { FinalCTA } from "../components/FinalCTA";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

const BOOKSY_URL =
  "https://booksy.com/widget-2024/index.html?realm=instagram&country=br&language=pt&fingerprint=cc34af3d-7dd2-4f4a-a3be-e3670f4eff74&channel=156ce701-bd15-4539-a838-e48841087851&id=395022&ba_s=Undefined";

const WHATSAPP_URL = "https://wa.me/5511934706817?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Ellite%20Barberss.";

function Index() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-[#C9A84C] selection:text-black">
      {/* Fixed Header */}
      <Header booksyUrl={BOOKSY_URL} />

      <main className="flex-1">
        {/* 1. Hero */}
        <Hero booksyUrl={BOOKSY_URL} />

        {/* 2. Sobre */}
        <About />

        {/* 3. Serviços e Preços */}
        <Services booksyUrl={BOOKSY_URL} />

        {/* 4. Galeria */}
        <Gallery />

        {/* 5. Pacotes */}
        <Packages booksyUrl={BOOKSY_URL} />

        {/* 6. Localização */}
        <Location whatsappUrl={WHATSAPP_URL} />

        {/* 7. CTA Final */}
        <FinalCTA booksyUrl={BOOKSY_URL} />
      </main>

      {/* Footer */}
      <Footer booksyUrl={BOOKSY_URL} whatsappUrl={WHATSAPP_URL} />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton whatsappUrl={WHATSAPP_URL} />
    </div>
  );
}
