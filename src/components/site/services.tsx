'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { services } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import BlueprintBackground from './blueprint-background';
import { Button } from '../ui/button';

export default function Services() {
  return (
    <section id="servicios" className="py-32 bg-secondary/50 dark:bg-white/[0.02] border-y">
      <div className="max-w-7xl mx-auto px-6">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter font-headline">
              Servicios
            </h2>
            <div className="hidden md:flex gap-4">
              <CarouselPrevious className="relative -left-0 top-0 translate-y-0 w-14 h-14 rounded-full border bg-card hover:bg-primary" />
              <CarouselNext className="relative -right-0 top-0 translate-y-0 w-14 h-14 rounded-full border bg-card hover:bg-primary" />
            </div>
          </div>
          <CarouselContent className="h-[60vh]">
            {services.map((service, i) => {
              const Icon = service.icon;
              const image = PlaceHolderImages.find(img => img.id === service.imgId);
              return (
                <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                  <div className="h-full snap-start relative rounded-lg overflow-hidden group border">
                    {image && (
                      <Image
                        src={image.imageUrl}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        data-ai-hint={image.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                    <BlueprintBackground type={service.bpType} />
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10 text-white">
                      <div className="flex justify-between items-start">
                        <span className="text-6xl font-bold opacity-20">{service.id}</span>
                        <div className="p-4 bg-primary text-primary-foreground rounded-2xl">
                          <Icon size={32} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black uppercase mb-4 group-hover:text-primary transition-colors font-headline">
                          {service.title}
                        </h3>
                        <p className="text-sm text-zinc-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 max-w-sm">
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
           <div className="md:hidden flex justify-center gap-4 mt-8">
              <CarouselPrevious className="relative -left-0 top-0 translate-y-0 w-14 h-14 rounded-full border bg-card hover:bg-primary" />
              <CarouselNext className="relative -right-0 top-0 translate-y-0 w-14 h-14 rounded-full border bg-card hover:bg-primary" />
            </div>
        </Carousel>
      </div>
    </section>
  );
}
