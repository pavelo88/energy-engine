
import { getWebContent } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { SiteHeader } from '@/components/SiteHeader';
import HeroSection from './_components/HeroSection';
import ClientsSection from './_components/ClientsSection';
import ServicesSection from './_components/ServicesSection';
import ContactSection from './_components/ContactSection';
import Footer from './_components/Footer';

export default async function Home() {
  const webContent = await getWebContent();
  const contactMapImage = PlaceHolderImages.find(p => p.id === 'contact-map');
  
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
        <HeroSection hero={hero} stats={safeStats} />
        <ClientsSection brands={safeBrands} />
        <ServicesSection servicios={servicios} />
        <ContactSection contactMapImage={contactMapImage} />
      </main>

      <Footer />
    </div>
  );
}
