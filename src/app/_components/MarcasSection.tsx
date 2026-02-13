'use client';

import { useEffect, useState, useRef } from "react";
import type { WebContent } from '@/lib/types';

interface MarcasSectionProps {
    brands: WebContent['trusted_brands'];
}

export default function MarcasSection({ brands }: MarcasSectionProps) {
    const [rotation, setRotation] = useState(0);
    // Radius del anillo: ajusta este valor para cambiar la separación de las marcas
    const [radius, setRadius] = useState(280); 
    const requestRef = useRef<number>();

    const displayBrands = (brands && brands.length > 0)
        ? brands
        : ["Perkins", "Guascor", "Cummins", "Iveco", "Ruggerini", "Volvo Penta", "Lombardini", "MAN", "Rolls-Royce", "MTU"];

    useEffect(() => {
        const handleResize = () => {
            // Cambia el radio del anillo para móviles y escritorio
            setRadius(window.innerWidth < 768 ? 180 : 280);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const animate = () => {
            // Controla la velocidad de rotación
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
    
    return (
        // Fondo de la sección: azul claro en modo claro, gris oscuro en modo oscuro
        <section id="marcas" className="py-24 sm:py-32 bg-muted/95 dark:bg-secondary/80 border-y border-primary/10">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-3xl md:text-4xl font-black font-orbitron tracking-tighter uppercase mb-24">
              <span className="block md:inline">Trabajamos con </span>
              <span className="text-primary block md:inline">Primeras Marcas</span>
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
                        // Aquí puedes ajustar la inclinación (rotateX) para que el anillo se vea más "tumbado"
                        transform: `rotateX(-15deg) rotateY(${rotation}deg)` 
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
                                    // Para ajustar el ancho de la etiqueta, cambia los valores de 'width' aquí
                                    width: isMobile ? "120px" : "160px", 
                                    height: isMobile ? "70px" : "85px",
                                    marginLeft: isMobile ? "-70px" : "-95px", 
                                    marginTop: isMobile ? "-35px" : "-42.5px", 
                                    fontSize: isMobile ? "1rem" : "1.4rem",
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
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
