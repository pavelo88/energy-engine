import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { WebContent } from '@/lib/types';

interface HeroSectionProps {
    hero: WebContent['hero'];
}

export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section id="home" className="container mx-auto px-6 relative py-16">
      <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-orbitron tracking-tighter mb-4 uppercase">
              <span className="block md:hidden">INGENIERÍA</span>
              <span className="hidden md:inline">INGENIERÍA ENERGÉTICA</span>
              <span className="block text-primary md:hidden">ENERGÉTICA</span>
              <span className="block">DE VANGUARDIA</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-foreground/60 mb-8 mx-auto">
            {hero.subitulo}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold" asChild>
                  <a href="#servicios">
                      Explorar Servicios <ArrowRight className="ml-2" />
                  </a>
                </Button>
            </div>
      </div>
    </section>
  );
}
