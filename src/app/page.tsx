
import { getWebContent } from '@/lib/data';

import { SiteHeader } from '@/components/SiteHeader';
import HeroSection from './_components/HeroSection';
import MarcasSection from './_components/MarcasSection';
import ServicesSection from './_components/ServicesSection';
import ContactSection from './_components/ContactSection';
import Footer from './_components/Footer';
import ExperienceSection from './_components/ExperienceSection';

export default async function Home() {
  const webContent = await getWebContent();
  
  if (!webContent) {
    return (
       <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  const { hero, servicios } = webContent;
  const safeStats = Array.isArray(webContent.stats_publicas) ? webContent.stats_publicas : [];
  const safeBrands = Array.isArray(webContent.trusted_brands) ? webContent.trusted_brands : [];

  return (
    <div className="flex flex-col min-h-dvh bg-transparent text-foreground">
       <SiteHeader />

      <main className="flex-1">
        <HeroSection hero={hero} />
        <ExperienceSection stats={safeStats} />
        <MarcasSection brands={safeBrands} />
        <ServicesSection servicios={servicios} />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
