import type { WebContent } from '@/lib/types';

interface ClientsSectionProps {
    brands: WebContent['trusted_brands'];
}

export default function ClientsSection({ brands }: ClientsSectionProps) {
    if (!brands || brands.length === 0) {
        return null;
    }
    
    return (
        <section id="clientes" className="py-24 sm:py-32">
          <div className="container mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-black font-orbitron tracking-tighter uppercase mb-16">
              Aliados <span className="text-primary">Tecnológicos</span>
            </h2>
            <div className="ring-container">
              <div className="brand-ring" style={{ '--total': brands.length } as React.CSSProperties}>
                {brands.map((brand, index) => {
                  const angle = (360 / brands.length) * index;
                  const radius = 180; // Adjust this for ring size
                  return (
                    <div 
                      key={index} 
                      className="brand-ring-item" 
                      style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}
                    >
                      <div className="tech-glass flex items-center justify-center p-6 h-20 w-48 bg-background/80">
                        <span className="text-2xl font-semibold text-foreground/80 font-orbitron">{brand}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
    );
}
