import { brands } from '@/lib/data';
import React from 'react';

export default function Brands() {
  const displayBrands = brands.length < 10 ? [...brands, ...brands] : brands;
  const totalDisplayBrands = displayBrands.length;

  return (
    <section id="marcas" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-black uppercase tracking-tighter font-headline text-foreground/80">
          Aliados Tecnológicos Multimarca
        </h2>
        <div className="relative mt-16 flex h-[450px] items-center justify-center [perspective:1000px] [mask-image:radial-gradient(circle_at_center,white_40%,transparent_80%)]">
          <div
            className="absolute h-full w-full animate-brand-rotation"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {displayBrands.map((brand, index) => {
              const angle = (360 / totalDisplayBrands) * index;
              const radius = 320; // in pixels
              return (
                <div
                  key={`${brand}-${index}`}
                  className="absolute flex h-20 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border bg-secondary/50 p-4 text-center dark:bg-white/[0.03] backdrop-blur-sm"
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  }}
                >
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    {brand}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
