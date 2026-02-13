import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { WebContent } from '@/lib/types';
import ExperienceSection from './ExperienceSection';

interface HeroSectionProps {
    hero: WebContent['hero'];
    stats: WebContent['stats_publicas'];
}

export default function HeroSection({ hero, stats }: HeroSectionProps) {
  return (
    <section id="home" className="container mx-auto px-6 relative pt-16 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-orbitron tracking-tighter mb-4 uppercase">
              <span className="block md:hidden">INGENIERÍA</span>
              <span className="hidden md:inline">INGENIERÍA ENERGÉTICA</span>
              <span className="block text-primary md:hidden">ENERGÉTICA</span>
              <span className="block">DE VANGUARDIA</span>
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
            </div>
        </div>
        <div className="mt-12 lg:mt-0">
          <ExperienceSection stats={stats} />
        </div>
      </div>
    </section>
  );
}
