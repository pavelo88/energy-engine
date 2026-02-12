import { getWebContent } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Lightbulb,
  ShieldCheck,
  Wrench,
  TrendingUp,
  HardHat,
  ArrowDown,
  LayoutPanelLeft ,
  Mail,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// A helper to map icon strings to actual components
const iconMap: { [key: string]: ComponentType<LucideProps> } = {
  Briefcase,
  Lightbulb,
  ShieldCheck,
  Wrench,
  TrendingUp,
  HardHat,
  LayoutPanelLeft,
};

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#nosotros', label: 'Nosotros' },
];

export default async function Home() {
  const webContent = await getWebContent();
  
  if (!webContent) {
    return (
       <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  const { hero, servicios, stats_publicas } = webContent;

  return (
    <div className="flex flex-col min-h-dvh bg-background dark:bg-grid-white/[0.05] bg-grid-black/[0.05]">
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container h-14 flex items-center">
          <div className="flex items-center gap-4">
            <a className="flex items-center gap-2" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                <span className="font-bold font-headline">AssetTrack AI</span>
            </a>
          </div>
          <nav className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => (
              <a key={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 ml-auto md:ml-4">
             <Link href="/admin">
                <Button variant="outline" className="hidden sm:flex">
                    Panel de Admin
                </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="home" className="container flex flex-col items-center justify-center text-center min-h-[calc(100vh-3.5rem)] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-primary/20 blur-3xl -z-10 rounded-full" />
            <Badge variant="outline" className="mb-6 animate-fade-in-up">
                <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Impulsado por IA Generativa
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline tracking-tighter mb-4 animate-fade-in-up" style={{"--delay": "0.2s"} as React.CSSProperties}>
              {hero.titulo}
            </h1>
            <p className="max-w-3xl text-lg md:text-xl text-foreground/60 mb-8 animate-fade-in-up" style={{"--delay": "0.4s"} as React.CSSProperties}>
              {hero.subitulo}
            </p>
            <div className="flex gap-4 animate-fade-in-up" style={{"--delay": "0.6s"} as React.CSSProperties}>
                <a href="#servicios">
                    <Button size="lg">Conoce más <ArrowDown className="ml-2" /></Button>
                </a>
                <Link href="/admin">
                    <Button size="lg" variant="secondary">Acceder al Panel</Button>
                </Link>
            </div>
        </section>

        <section id="servicios" className="container py-24 sm:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">Servicios de Mantenimiento Integral</h2>
            <p className="mt-4 text-lg text-foreground/60">
              Ofrecemos soluciones completas para garantizar la operatividad y eficiencia de sus activos críticos, minimizando el tiempo de inactividad.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => {
              const Icon = iconMap[servicio.icono] || Wrench;
              return (
                <div key={servicio.titulo} className="p-8 rounded-lg border bg-card/50 transition-all hover:border-primary/50 hover:-translate-y-1">
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold font-headline mb-2">{servicio.titulo}</h3>
                  <p className="text-foreground/60">{servicio.descripcion}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="experiencia" className="w-full py-24 sm:py-32 bg-muted/50 dark:bg-background">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">Nuestra Experiencia en Cifras</h2>
                    <p className="mt-4 text-lg text-foreground/60 max-w-lg">
                        Resultados que demuestran nuestro compromiso y eficacia en el campo, respaldados por datos y miles de horas de servicio.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-8 rounded-lg border bg-background">
                        <span className="text-5xl font-bold text-primary font-headline">{stats_publicas.activos_totales.toLocaleString()}+</span>
                        <p className="text-lg mt-2 text-foreground/60">Activos Gestionados</p>
                    </div>
                    <div className="p-8 rounded-lg border bg-background">
                        <span className="text-5xl font-bold text-primary font-headline">{stats_publicas.intervenciones_exitosas.toLocaleString()}+</span>
                        <p className="text-lg mt-2 text-foreground/60">Intervenciones Exitosas</p>
                    </div>
                </div>
            </div>
          </div>
        </section>
        
        <section id="nosotros" className="container py-24 sm:py-32 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">¿Listo para optimizar tu mantenimiento?</h2>
            <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto">
                Contacta con nosotros para una demostración y descubre cómo AssetTrack AI puede transformar la gestión de tus activos.
            </p>
             <div className="flex gap-4 justify-center mt-8">
                <Button size="lg" asChild>
                    <a href="mailto:contacto@energy-engine.es">
                        <Mail className="mr-2" /> Contactar
                    </a>
                </Button>
            </div>
        </section>

      </main>

      <footer className="border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between py-8">
            <p className="text-sm text-foreground/60">&copy; 2024 Energy Engine España. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <a className="text-sm transition-colors hover:text-foreground/80 text-foreground/60" href="#">Términos</a>
                <a className="text-sm transition-colors hover:text-foreground/80 text-foreground/60" href="#">Privacidad</a>
            </div>
        </div>
      </footer>
    </div>
  );
}
