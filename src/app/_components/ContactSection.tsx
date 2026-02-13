import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveContactMessage } from '@/app/actions';
import Image from 'next/image';
import { Mail, Phone, Linkedin, Instagram, Facebook, MapPin } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

interface ContactSectionProps {
    contactMapImage: ImagePlaceholder | undefined;
}

export default function ContactSection({ contactMapImage }: ContactSectionProps) {
    return (
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
    );
}
