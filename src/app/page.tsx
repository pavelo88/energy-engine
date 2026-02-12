import { getWebContent } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone, Bot, Linkedin, MapPin, Instagram, Facebook } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlueprintBackground } from '@/components/ServiceIllustrations';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveContactMessage } from '@/app/actions';

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#clientes', label: 'Clientes' },
  { href: '#contacto', label: 'Contacto' },
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

  const { hero, servicios, stats_publicas, trusted_brands } = webContent;

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
       <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-sm">
        <div className="container h-16 flex items-center">
          <Link className="flex items-center gap-2" href="#">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
              <span className="font-bold text-xl font-orbitron">AssetTrack AI</span>
          </Link>
          <nav className="ml-auto hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map(link => (
              <a key={link.href} className="transition-colors hover:text-primary text-foreground/80" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 ml-auto md:ml-4">
             <Link href="/admin">
                <Button variant="outline" className="hidden sm:flex border-primary/50 hover:bg-primary/10 hover:text-primary">
                    Panel
                </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="home" className="container flex flex-col items-center justify-center text-center relative pt-24 pb-32">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-primary/10 blur-3xl -z-20 rounded-full" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-orbitron tracking-tighter mb-4 uppercase">
              {hero.titulo.split(' ').map((word, i) => (
                <span key={i} className={i >= 2 ? "text-primary" : ""}>{word} </span>
              ))}
            </h1>
            <p className="max-w-3xl text-lg md:text-xl text-foreground/60 mb-8">
              {hero.subitulo}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold" asChild>
                  <a href="#servicios">
                    Explorar Servicios <ArrowRight className="ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/admin">
                    Acceder al Panel
                  </Link>
                </Button>
            </div>
        </section>

        <section id="experiencia" className="w-full py-24 sm:py-32 bg-card">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black font-orbitron tracking-tighter uppercase">Nuestra <span className="text-primary">Experiencia</span></h2>
                    <p className="mt-4 text-lg text-foreground/60 max-w-lg">
                        Resultados que demuestran nuestro compromiso y eficacia, respaldados por datos y miles de horas de servicio.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-8 rounded-xl border border-primary/20 bg-background/50 text-center">
                        <span className="text-5xl font-bold text-primary font-orbitron">{stats_publicas.activos_totales.toLocaleString()}+</span>
                        <p className="text-lg mt-2 text-foreground/60">Activos Gestionados</p>
                    </div>
                    <div className="p-8 rounded-xl border border-primary/20 bg-background/50 text-center">
                        <span className="text-5xl font-bold text-primary font-orbitron">{stats_publicas.intervenciones_exitosas.toLocaleString()}+</span>
                        <p className="text-lg mt-2 text-foreground/60">Intervenciones Exitosas</p>
                    </div>
                </div>
            </div>
          </div>
        </section>

        <section id="servicios" className="container py-24 sm:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-orbitron tracking-tight uppercase">Nuestras <span className="text-primary">Capacidades</span></h2>
            <p className="mt-4 text-lg text-foreground/60">
              Soluciones integrales para la operación, mantenimiento y optimización de activos críticos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => (
                <Card key={servicio.titulo} className="tech-glass p-2 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20">
                  <CardHeader className="p-4">
                    <div className="relative w-full aspect-[16/10] mb-4 overflow-hidden rounded-lg border border-primary/20">
                       <BlueprintBackground type={servicio.icono} />
                    </div>
                    <CardTitle className="text-xl font-bold font-orbitron uppercase text-primary">{servicio.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 pt-0">
                    <p className="text-foreground/70 text-sm">{servicio.descripcion}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>

        <section id="clientes" className="py-24 sm:py-32">
          <div className="container">
            <h2 className="text-center text-3xl md:text-4xl font-black font-orbitron tracking-tighter uppercase mb-12">Aliados <span className="text-primary">Tecnológicos</span></h2>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              </div>
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                  {(trusted_brands || []).map((brand, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                      <div className="p-1">
                        <div className="flex aspect-video items-center justify-center p-6 tech-glass h-24">
                          <span className="text-2xl font-semibold text-foreground/60 font-orbitron">{brand}</span>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </section>
        
        <section id="contacto" className="container py-24 sm:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-orbitron tracking-tight uppercase">
              Contacta con <span className="text-primary">Nosotros</span>
            </h2>
            <p className="mt-4 text-lg text-foreground/60">
              ¿Listo para optimizar tu mantenimiento? Solicita una demostración o envíanos tu consulta.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <form action={saveContactMessage} className="tech-glass p-8 space-y-6 rounded-lg">
              <h3 className="font-bold text-xl font-orbitron text-primary">Déjanos un mensaje</h3>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-primary/80">Nombre Completo</label>
                <Input id="name" name="name" required placeholder="Tu nombre" className="bg-background/50"/>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-primary/80">Correo Electrónico</label>
                <Input id="email" name="email" type="email" required placeholder="tu@email.com" className="bg-background/50"/>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-primary/80">Mensaje</label>
                <Textarea id="message" name="message" required placeholder="¿En qué podemos ayudarte?" rows={4} className="bg-background/50"/>
              </div>
              <Button type="submit" className="w-full font-bold">Enviar Consulta</Button>
            </form>
            <div className="space-y-6 flex flex-col justify-center">
              <div className="tech-glass p-6 rounded-lg">
                <h3 className="font-bold text-xl font-orbitron text-primary mb-4">Datos de Contacto</h3>
                <div className="space-y-4">
                  <a href="https://wa.me/34000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                    <Phone className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">+34 000 000 000</p>
                      <p className="text-sm text-foreground/60">Habla con un experto vía WhatsApp.</p>
                    </div>
                  </a>
                  <a href="mailto:contacto@energy-engine.es" className="flex items-center gap-4 group">
                    <Mail className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors">contacto@energy-engine.es</p>
                      <p className="text-sm text-foreground/60">Para consultas detalladas.</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4 group">
                    <MapPin className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Madrid, España</p>
                      <p className="text-sm text-foreground/60">Oficinas centrales.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tech-glass p-6 rounded-lg">
                <h3 className="font-bold text-xl font-orbitron text-primary mb-4">Redes Sociales</h3>
                <div className="flex gap-4">
                    <Button asChild variant="outline" size="icon" className="border-primary/30 hover:bg-primary/10 hover:border-primary">
                      <a href="#" aria-label="LinkedIn"><Linkedin /></a>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="border-primary/30 hover:bg-primary/10 hover:border-primary">
                      <a href="#" aria-label="Facebook"><Facebook /></a>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="border-primary/30 hover:bg-primary/10 hover:border-primary">
                      <a href="#" aria-label="Instagram"><Instagram /></a>
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-primary/20">
        <div className="container flex flex-col md:flex-row items-center justify-between py-8">
            <p className="text-sm text-foreground/60">&copy; 2024 Energy Engine España. Todos los derechos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <a className="text-sm transition-colors hover:text-primary text-foreground/60" href="#">Términos</a>
                <a className="text-sm transition-colors hover:text-primary text-foreground/60" href="#">Privacidad</a>
            </div>
        </div>
      </footer>
    </div>
  );
}
