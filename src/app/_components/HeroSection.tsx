import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Globe, Shield, Clock, HardHat } from 'lucide-react';
import Link from 'next/link';
import type { WebContent } from '@/lib/types';

const iconMap: { [key: string]: React.ElementType } = {
  Zap,
  Globe,
  Shield,
  Clock,
  HardHat, // Fallback
};

interface HeroSectionProps {
    hero: WebContent['hero'];
    stats: WebContent['stats_publicas'];
}

export default function HeroSection({ hero, stats }: HeroSectionProps) {
  return (
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
          {stats.map((stat) => {
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
  );
}
