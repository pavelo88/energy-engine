import { brands } from '@/lib/data';
import React from 'react';

export default function Brands() {
  // Duplicate brands if there are too few to make a nice circle
  const displayBrands = brands.length < 10 ? [...brands, ...brands] : brands;
  const totalDisplayBrands = displayBrands.length;

  return (
    <section id="marcas" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-black uppercase tracking-tighter font-headline text-foreground/80">
          Aliados Tecnológicos Multimarca
        </h2>
        <div className="relative mt-16 flex h-[450px] items-center justify-center [mask-image:radial-gradient(circle_at_center,white_30%,transparent_70%)]">
          <div className="absolute animate-rotation" style={{ width: '1px', height: '1px' }}>
              {displayBrands.map((brand, index) => {
                const angle = (360 / totalDisplayBrands) * index;
                return (
                  <div
                    key={index}
                    className="absolute flex h-20 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-secondary/50 p-4 text-center dark:bg-white/[0.03]"
                    style={
                      {
                        '--angle': `${angle}deg`,
                        transform:
                          'rotate(var(--angle)) translateY(-14rem) rotate(calc(-1 * var(--angle)))',
                      } as React.CSSProperties
                    }
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
