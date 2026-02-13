'use client';

import { useEffect, useState, useRef } from "react";
import type { WebContent } from '@/lib/types';

interface ClientsSectionProps {
    brands: WebContent['trusted_brands'];
}

export default function ClientsSection({ brands }: ClientsSectionProps) {
    const [rotation, setRotation] = useState(0);
    const [radius, setRadius] = useState(280); // Default radius for PC
    const requestRef = useRef<number>();

    const displayBrands = brands || [];

    useEffect(() => {
        const handleResize = () => {
            setRadius(window.innerWidth < 768 ? 180 : 280);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const animate = () => {
            setRotation(prev => prev - 0.05);
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
    
    if (displayBrands.length === 0) {
        return null;
    }
    
    return (
        <section id="clientes" className="py-24 sm:py-32">
          <div className="container mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-black font-orbitron tracking-tighter uppercase mb-24">
              Trabajamos con <span className="text-primary">Primeras Marcas</span>
            </h2>
            <div 
                className="relative flex justify-center items-center" 
                style={{ 
                    perspective: "1200px", 
                    height: radius < 200 ? "250px" : "320px" 
                }}
            >
                <div
                    className="absolute w-full h-full"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: `rotateX(-10deg) rotateY(${rotation}deg)` 
                    }}
                >
                    {displayBrands.map((brand, i) => {
                        const angle = (i / displayBrands.length) * 360;
                        const isMobile = radius < 200;

                        return (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2 flex items-center justify-center tech-glass font-orbitron font-bold transition-all"
                                style={{
                                    width: isMobile ? "140px" : "200px", 
                                    height: isMobile ? "70px" : "90px",
                                    marginLeft: isMobile ? "-70px" : "-100px", 
                                    marginTop: isMobile ? "-35px" : "-45px", 
                                    fontSize: isMobile ? "1rem" : "1.5rem",
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                    backfaceVisibility: 'hidden',
                                }}
                            >
                                <span className="text-foreground/90">{brand}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>
        </section>
    );
}
