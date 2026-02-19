'use client';

import React from 'react';
import Image from 'next/image';
import { services } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import BlueprintBackground from './blueprint-background';

export default function Services() {
  return (
    <section id="servicios" className="py-32 bg-secondary/50 dark:bg-white/[0.02] border-y">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-16 px-6">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter font-headline">
            Servicios
          </h2>
        </div>
        <div className="flex overflow-x-auto no-scrollbar -mx-6 px-6 gap-8 pb-4">
          {services.map((service, i) => {
            const Icon = service.icon;
            const image = PlaceHolderImages.find(img => img.id === service.imgId);
            return (
              <div key={i} className="flex-none w-[90vw] md:w-[450px] h-[60vh] snap-center relative rounded-lg overflow-hidden group border">
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
