import type { WebContent } from '@/lib/types';
import { MobileServicesCarousel } from '@/components/MobileServicesCarousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlueprintBackground } from '@/components/ServiceIllustrations';

interface ServicesSectionProps {
  servicios: WebContent['servicios'];
}

export default function ServicesSection({ servicios }: ServicesSectionProps) {
    if (!servicios || servicios.length === 0) {
        return null;
    }
    
    const gridLayout =
        servicios.length % 3 === 0
        ? 'lg:grid-cols-3'
        : servicios.length % 2 === 0
        ? 'lg:grid-cols-2'
        : 'lg:grid-cols-3';

    return (
        <section id="servicios" className="container mx-auto px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black font-orbitron tracking-tight uppercase">
              <span className="block md:inline">Nuestras </span>
              <span className="text-primary block md:inline">Capacidades</span>
            </h2>
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
    );
}
