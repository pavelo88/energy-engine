import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getWebContent } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Briefcase,
  Lightbulb,
  ShieldCheck,
  Wrench,
  TrendingUp,
  HardHat,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

// A helper to map icon strings to actual components
const iconMap: { [key: string]: ComponentType<LucideProps> } = {
  Briefcase: Briefcase,
  Lightbulb: Lightbulb,
  ShieldCheck: ShieldCheck,
  Wrench: Wrench,
  TrendingUp: TrendingUp,
  HardHat: HardHat,
};

export default async function Home() {
  const webContent = await getWebContent();
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  if (!webContent) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground">
          <h1 className="font-headline text-lg font-bold">AssetTrack AI</h1>
        </header>
        <main className="flex-1 animate-pulse">
          <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-200"></section>
          <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 items-center">
                <div className="flex flex-col justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <div className="h-8 w-1/2 mx-auto bg-gray-300 rounded"></div>
                    <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const { hero, servicios, stats_publicas } = webContent;

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm fixed top-0 w-full z-50 backdrop-blur-sm bg-opacity-80">
        <div className="flex items-center justify-between w-full">
            <a className="flex items-center justify-center" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                <span className="sr-only">AssetTrack AI</span>
            </a>
            <h1 className="text-xl font-headline font-bold text-primary">Energy Engine España</h1>
            <nav className="hidden lg:flex gap-4 sm:gap-6">
                <a className="text-sm font-medium hover:underline underline-offset-4" href="/admin">
                Admin Panel
                </a>
            </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full h-dvh">
          {heroImage && (
             <Image
             alt="Hero background"
             src={heroImage.imageUrl}
             fill
             priority
             className="object-cover -z-10"
             data-ai-hint={heroImage.imageHint}
           />
          )}
          <div className="absolute inset-0 bg-primary/70 -z-10" />
          <div className="container px-4 md:px-6 h-full flex flex-col items-center justify-center text-center">
            <div className="space-y-4">
              <div className="space-y-2 text-white">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
                  {hero.titulo}
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                  {hero.subitulo}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="servicios" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Servicios de Mantenimiento Integral
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Ofrecemos soluciones completas para garantizar la operatividad y eficiencia de sus activos críticos.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {servicios.map((servicio) => {
                const Icon = iconMap[servicio.icono] || Wrench;
                return (
                  <Card key={servicio.titulo}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Icon className="w-8 h-8 text-accent" />
                      <CardTitle className="font-headline">{servicio.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{servicio.descripcion}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl font-headline">
                Nuestra Experiencia en Cifras
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Resultados que demuestran nuestro compromiso y eficacia en el campo.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center space-y-1 rounded-lg bg-card p-4 shadow-sm">
                  <span className="text-4xl font-bold text-primary">{stats_publicas.activos_totales.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">Activos Gestionados</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-1 rounded-lg bg-card p-4 shadow-sm">
                  <span className="text-4xl font-bold text-primary">{stats_publicas.intervenciones_exitosas.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">Intervenciones Exitosas</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Energy Engine España. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Términos de Servicio
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacidad
          </a>
        </nav>
      </footer>
    </div>
  );
}
