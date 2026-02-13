import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveContactMessage } from '@/app/actions';
import { Building, User, Phone, Linkedin, Instagram, Facebook, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ContactSection() {
    return (
        <section id="contacto" className="container mx-auto px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-orbitron tracking-tight uppercase">
              <span className="block md:inline">CANAL DE </span>
              <span className="text-primary block md:inline">COMUNICACIÓN</span>
            </h2>
            <p className="mt-4 text-lg text-foreground/60">
              ¿Listo para optimizar tu mantenimiento? Solicita una demostración o envíanos tu consulta.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <form action={saveContactMessage} className="tech-glass p-8 space-y-6 rounded-lg">
              <h3 className="font-bold text-xl font-orbitron text-primary">Déjanos un mensaje</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-primary/80">NOMBRE</label>
                  <Input id="name" name="name" required placeholder="Tu nombre" className="bg-background/50"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-primary/80">EMAIL</label>
                  <Input id="email" name="email" type="email" required placeholder="tu@email.com" className="bg-background/50"/>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-primary/80">WHATSAPP / TELÉFONO</label>
                <Input id="phone" name="phone" placeholder="+34 600 000 000" className="bg-background/50"/>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-primary/80">DESCRIBA SU REQUERIMIENTO...</label>
                <Textarea id="message" name="message" required placeholder="¿En qué podemos ayudarte?" rows={4} className="bg-background/50"/>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button type="submit" className="w-full font-bold">
                    <Send className="mr-2 h-4 w-4" />
                    ENVIAR
                </Button>
                <Button type="button" variant="outline" className="w-full font-bold">
                    VER GARANTÍA
                </Button>
              </div>
            </form>
            
            <div className="tech-glass p-8 rounded-lg flex flex-col space-y-6">
                <h3 className="font-bold text-xl font-orbitron text-primary">Contacto Directo</h3>
                
                <div className="relative aspect-video w-full rounded-md overflow-hidden border border-primary/20">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.907921962325!2d-3.7915555234971727!3d39.92113427152431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4204f14545936b%3A0x28975940d510f85!2sC.%20Miguel%20L%C3%B3pez%20Bravo%2C%206%2C%2045313%20Yepes%2C%20Toledo%2C%20Spain!5e0!3m2!1sen!2sus!4v1717614532297!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full dark:invert dark:grayscale transition-all duration-300"
                  ></iframe>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-4">
                            <Building className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-foreground">Oficina Central</p>
                                <p className="text-foreground/80">NAVE, C. Miguel López Bravo, 6, 45313 Yepes, Toledo</p>
                                <a href="tel:925154354" className="text-primary hover:underline">925 15 43 54</a>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <User className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-foreground">Delegación Norte</p>
                                <p className="text-foreground/80">Contacto: Andrés Granados</p>
                                <a href="tel:683775208" className="text-primary hover:underline">683 77 52 08</a>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <User className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                                <p className="font-semibold text-foreground">Delegación Sur</p>
                                <p className="text-foreground/80">Contacto: Antonio Ugena</p>
                                <a href="tel:635120510" className="text-primary hover:underline">635 12 05 10</a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-4 items-center justify-center md:justify-start">
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
    );
}
