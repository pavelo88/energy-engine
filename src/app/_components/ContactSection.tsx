import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveContactMessage } from '@/app/actions';
import { Facebook, Instagram, Linkedin, Send } from 'lucide-react';

export default function ContactSection() {
    return (
        <section id="contacto" className="container mx-auto px-6 py-8">
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
            {/* Form Column */}
            <form action={saveContactMessage} className="tech-glass p-8 space-y-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-primary/80">NOMBRE</label>
                  <Input id="name" name="name" required className="bg-background/50"/>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-primary/80">EMAIL</label>
                  <Input id="email" name="email" type="email" required className="bg-background/50"/>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-primary/80">WHATSAPP / TELÉFONO</label>
                <Input id="phone" name="phone" className="bg-background/50"/>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-primary/80">DESCRIBA SU REQUERIMIENTO...</label>
                <Textarea id="message" name="message" required rows={4} className="bg-background/50"/>
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
            
            {/* Info Column */}
            <div className="tech-glass p-8 rounded-lg flex flex-col space-y-6">
                <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:items-center md:text-left">
                    <div>
                        <p className="text-xs uppercase text-foreground/70 font-semibold tracking-wider">OFICINA CENTRAL</p>
                        <p className="text-2xl md:text-3xl font-bold font-orbitron text-foreground tracking-wider">925 15 43 54</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="ghost" size="icon" className="bg-foreground/5 text-foreground/60 rounded-full hover:bg-primary/10 hover:text-primary">
                            <a href="#" aria-label="Facebook"><Facebook /></a>
                        </Button>
                        <Button asChild variant="ghost" size="icon" className="bg-foreground/5 text-foreground/60 rounded-full hover:bg-primary/10 hover:text-primary">
                            <a href="#" aria-label="Instagram"><Instagram /></a>
                        </Button>
                        <Button asChild variant="ghost" size="icon" className="bg-foreground/5 text-foreground/60 rounded-full hover:bg-primary/10 hover:text-primary">
                            <a href="https://www.linkedin.com/in/energy-engine-grupos-electrogenos-74529270/?originalSubdomain=es" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a>
                        </Button>
                    </div>
                </div>

                <div className="relative aspect-video w-full rounded-md overflow-hidden border border-primary/20">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3060.5601159996186!2d-3.6247125!3d39.9064799!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd69fd9fca56779b%3A0xd8e264de001cf92b!2sEnergy%20Engine%20Grupos%20Electr%C3%B3genos%20S.L!5e0!3m2!1ses!2sec!4v1770961761566!5m2!1ses!2sec"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full dark:invert dark:grayscale transition-all duration-300"
                  ></iframe>
                </div>

                <p className="text-center text-xs text-foreground/60">
                    Oficina Central: NAVE, C. Miguel López Bravo, 6, 45313 Yepes, Toledo, España.
                </p>
            </div>
          </div>
        </section>
    );
}
