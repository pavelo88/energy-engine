import type { WebContent } from '@/lib/types';
import { HardHat, Zap, Globe, Shield, Clock } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  Zap,
  Globe,
  Shield,
  Clock,
  HardHat, // Fallback
};

interface ExperienceSectionProps {
    stats: WebContent['stats_publicas'];
}

export default function ExperienceSection({ stats }: ExperienceSectionProps) {
  return (
    <section id="experience" className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
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
    </section>
  );
}
