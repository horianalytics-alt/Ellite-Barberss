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
import { SiteDataProvider } from "../context/SiteDataContext";
import { AuthProvider } from "../context/AuthContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <AuthProvider>
      <SiteDataProvider>
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-[#C9A84C] selection:text-black">
          <Header />

          <main className="flex-1">
            <Hero />
            <About />
            <Services />
            <Gallery />
            <Packages />
            <Location />
            <FinalCTA />
          </main>

          <Footer />
          <WhatsAppButton />
        </div>
      </SiteDataProvider>
    </AuthProvider>
  );
}
