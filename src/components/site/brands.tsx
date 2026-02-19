'use client';

import React, { useState, useEffect } from 'react';
import { brands } from '@/lib/data';

export default function Brands() {
  const [ringRadius, setRingRadius] = useState(200);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200) {
        setRingRadius(500);
      } else if (window.innerWidth > 768) {
        setRingRadius(350);
      } else {
        setRingRadius(200);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="marcas" className="py-32 relative flex flex-col items-center">
      <style>{`
          @keyframes ring-rotate { from { transform: rotateX(-20deg) rotateY(0deg); } to { transform: rotateX(-20deg) rotateY(360deg); } }
          .ring-container { transform-style: preserve-3d; transform: rotateX(-20deg); animation: ring-rotate 40s linear infinite; }
          .ring-card { backface-visibility: hidden; }
          ${brands.map((_, i) => `.ring-card:nth-child(${i + 1}) { transform: rotateY(${i * (360 / brands.length)}deg) translateZ(${ringRadius}px); }`).join('')}
      `}</style>
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter font-headline">
          Aliados Tecnológicos
        </h2>
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mt-2">
          Tecnología Multimarca Certificada
        </p>
      </div>
      <div className="perspective-[2000px] h-[200px] md:h-[300px] flex items-center justify-center w-full">
        <div className="ring-container relative w-[100px] h-[40px] md:w-[160px] md:h-[60px]">
          {brands.map((brand, i) => (
            <div
              key={i}
              className="ring-card absolute inset-0 flex items-center justify-center bg-card border rounded-xl shadow-lg"
            >
              <span className="text-xs md:text-sm font-black uppercase tracking-widest text-card-foreground">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
