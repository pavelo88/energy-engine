import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveContactMessage } from '@/app/actions';
import { Facebook, Instagram, Linkedin, Send } from 'lucide-react';

export default function ContactSection() {
    return (
        <section id="contacto" className="container mx-auto px-6 py-16">
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
                <div className="flex justify-between items-center">
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
                            <a href="#" aria-label="LinkedIn"><Linkedin /></a>
                        </Button>
                    </div>
                </div>

                <div className="relative aspect-video w-full rounded-md overflow-hidden border border-primary/20">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.5558853974057!2d-3.6226846999999998!3d39.9065746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd69fd9fcbbb692b%3A0x28b5ff2cac42084!2sC.%20Miguel%20L%C3%B3pez%20Bravo%2C%206%2C%2045313%20Yepes%2C%20Toledo%2C%20Espa%C3%B1a!5e0!3m2!1ses!2sec!4v1770960048534!5m2!1ses!2sec"
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
