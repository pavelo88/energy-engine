
'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import type { WebContent } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlueprintBackground } from '@/components/ServiceIllustrations';

interface MobileServicesCarouselProps {
    servicios: WebContent['servicios'];
}

export function MobileServicesCarousel({ servicios }: MobileServicesCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <Carousel 
      plugins={[plugin.current]} 
      className="w-full" 
      onMouseEnter={plugin.current.stop} 
      onMouseLeave={plugin.current.reset}
      opts={{ align: "start", loop: true }}
    >
      <CarouselContent>
        {servicios.map((servicio, index) => (
          <CarouselItem key={index} className="basis-full sm:basis-1/2">
             <div className="p-2 h-full">
               <Card className="tech-glass p-2 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20 w-full h-full">
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
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
