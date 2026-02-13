
import type { Metadata } from 'next';
import { getWebContent } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { SiteHeader } from '@/components/SiteHeader';
import HeroSection from './_components/HeroSection';
import MarcasSection from './_components/MarcasSection';
import ServicesSection from './_components/ServicesSection';
import ContactSection from './_components/ContactSection';
import Footer from './_components/Footer';
import ExperienceSection from './_components/ExperienceSection';

export async function generateMetadata(): Promise<Metadata> {
  const webContent = await getWebContent();
  // Fallback for metadata to prevent crash if it's missing from DB
  const metadata = webContent.metadata || {
    title: 'Energy Engine | Soluciones de Ingeniería',
    description: 'Líderes en mantenimiento, operación y optimización de activos críticos.',
    keywords: 'ingeniería energética, mantenimiento predictivo, grupos electrógenos'
  };
  // Safe access to hero image
  const heroImage = PlaceHolderImages.find(img => img.id === webContent.hero?.imagen_id);

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords?.split(',').map(k => k.trim()),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: '/',
      siteName: 'Energy Engine España',
      images: [
        {
          url: heroImage?.imageUrl || '',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [heroImage?.imageUrl || ''],
    },
  };
}

export default async function Home() {
  const webContent = await getWebContent();
  
  if (!webContent) {
    return (
       <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  // Safe access to webContent properties
  const hero = webContent.hero || { titulo: 'Título no disponible', subitulo: '', imagen_id: '' };
  const servicios = webContent.servicios || [];
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
