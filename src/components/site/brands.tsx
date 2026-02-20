'use client';

import { brands } from '@/lib/data';
import React, { useState, useEffect, useRef } from 'react';

export default function Brands() {
    const [rotation, setRotation] = useState(0);
    const [radius, setRadius] = useState(320); 
    const requestRef = useRef<number>();

    // Duplicate brands to make the ring look fuller
    const displayBrands = [...brands, ...brands];
    const totalDisplayBrands = displayBrands.length;

    useEffect(() => {
        const handleResize = () => {
            // Adjust radius for mobile and desktop
            setRadius(window.innerWidth < 768 ? 180 : 280);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const animate = () => {
            // Control rotation speed
            setRotation(prev => prev - 0.03);
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);
    
    return (
        <section id="marcas" className="py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <h2 className="text-center text-3xl font-black uppercase tracking-tighter font-headline text-foreground/80">
              Aliados Tecnológicos Multimarca
            </h2>
            <div 
                className="relative mt-16 flex items-center justify-center [perspective:1200px] [mask-image:radial-gradient(circle_at_center,white_40%,transparent_80%)]"
                style={{ 
                    height: radius < 200 ? "300px" : "450px" 
                }}
            >
                <div
                    className="absolute h-full w-full"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: `rotateX(-15deg) rotateY(${rotation}deg)` 
                    }}
                >
                    {displayBrands.map((brand, index) => {
                        const angle = (360 / totalDisplayBrands) * index;
                        
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