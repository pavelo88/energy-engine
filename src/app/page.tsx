
import { getWebContent } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone, Shield, Linkedin, MapPin, Instagram, Facebook, HardHat, Zap, Globe, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlueprintBackground } from '@/components/ServiceIllustrations';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveContactMessage } from '@/app/actions';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SiteHeader } from '@/components/SiteHeader';
import { MobileServicesCarousel } from '@/components/MobileServicesCarousel';

const iconMap: { [key: string]: React.ElementType } = {
  Zap,
  Globe,
  Shield,
  Clock,
  HardHat, // Fallback
};

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

  const gridLayout =
    servicios.length % 3 === 0
      ? 'lg:grid-cols-3'
      : servicios.length % 2 === 0
      ? 'lg:grid-cols-2'
      : 'lg:grid-cols-3';

  return (
    <div className="flex flex-col min-h-dvh bg-transparent text-foreground">
       <SiteHeader />

      <main className="flex-1">
        
        <section id="home" className="container mx-auto relative pt-24 pb-12 md:pt-32 md:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-orbitron tracking-tighter mb-4 uppercase">
                  INGENIERÍA ENERGÉTICA <span className="text-primary">DE VANGUARDIA</span>
                </h1>
                <p className="max-w-2xl text-lg md:text-xl text-foreground/60 mb-8 mx-auto lg:mx-0">
                {hero.subitulo}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mx-auto lg:mx-0 justify-center lg:justify-start">
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
            </div>
             <div className="grid grid-cols-2 gap-4 md:gap-6">
              {safeStats.map((stat) => {
                const Icon = iconMap[stat.icon] || HardHat;
                return (
                  <div key={stat.label} className="tech-glass p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                    <Icon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-3xl md:text-4xl font-bold font-orbitron text-primary">{stat.value}</p>
                      <p className="text-sm uppercase tracking-wider text-foreground/60">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="servicios" className="container mx-auto py-24 sm:py-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-orbitron tracking-tight uppercase">Nuestras <span className="text-primary">Capacidades</span></h2>
            <p className="mt-4 text-lg text-foreground/60">
              Soluciones integrales para la operación, mantenimiento y optimización de activos críticos.
            </p>
          </div>
          
          <div className="md:hidden">
             <MobileServicesCarousel servicios={servicios} />
          </div>
          
          <div className={`hidden md:grid grid-cols-1 md:grid-cols-2 ${gridLayout} gap-8`}>
            {servicios.map((servicio) => (
                <div key={servicio.titulo} className="flex">
                    <Card className="tech-glass p-2 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20 w-full">
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
                </div>
              ))}
          </div>
        </section>

        <section id="clientes" className="py-24 sm:py-32">
          <div className="container mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-black font-orbitron tracking-tighter uppercase mb-16">
              Aliados <span className="text-primary">Tecnológicos</span>
            </h2>
            <div className="ring-container">
              <div className="brand-ring" style={{ '--total': safeBrands.length } as React.CSSProperties}>
                {(safeBrands || []).map((brand, index) => {
                  const angle = (360 / safeBrands.length) * index;
                  const radius = 180; // Adjust this for ring size
                  return (
                    <div 
                      key={index} 
                      className="brand-ring-item" 
                      style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
                    >
                      <div className="tech-glass flex items-center justify-center p-6 h-20 w-48">
                        <span className="text-2xl font-semibold text-foreground/80 font-orbitron">{brand}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
        
        <section id="contacto" className="container mx-auto py-24 sm:py-32">
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
            <div className="tech-glass p-8 rounded-lg flex flex-col space-y-6">
                <h3 className="font-bold text-xl font-orbitron text-primary">Datos de Contacto</h3>
                <div className="space-y-4">
                    <a href="https://wa.me/34000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                        <Phone className="w-6 h-6 text-primary" />
                        <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">+34 000 000 000</p>
                            <p className="text-sm text-foreground/60">Habla con un experto.</p>
                        </div>
                    </a>
                    <a href="mailto:contacto@energy-engine.es" className="flex items-center gap-4 group">
                        <Mail className="w-6 h-6 text-primary" />
                        <div>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">contacto@energy-engine.es</p>
                            <p className="text-sm text-foreground/60">Para consultas detalladas.</p>
                        </div>
                    </a>
                </div>
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
                <div className="relative aspect-video w-full mt-auto rounded-md overflow-hidden border border-primary/20">
                  {contactMapImage ? (
                      <Image src={contactMapImage.imageUrl} alt="Mapa de ubicación" fill className="object-cover" data-ai-hint={contactMapImage.imageHint} />
                  ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-muted-foreground" />
                      </div>
                  )}
                   <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                   <div className="absolute bottom-4 left-4">
                     <p className="font-semibold text-foreground">Madrid, España</p>
                     <p className="text-sm text-foreground/60">Oficinas centrales.</p>
                   </div>
                </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-primary/20 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-8">
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
