'use client';

import React from 'react';
import MainMenuTablet from './MainMenuTablet';
import MainMenuMobile from './MainMenuMobile';

interface MainMenuProps {
  onNavigate: (tab: string) => void;
  userName: string;
}

export default function MainMenu({ onNavigate, userName }: MainMenuProps) {
  return (
    // --- CORRECCIÓN CLAVE ---
    // Cambiamos a `flex-1` y `flex-col`.
    // `flex-1` hace que este componente crezca para llenar el espacio vertical disponible 
    // dentro de su contenedor padre (el tag <main>), respetando su padding.
    // `flex-col` prepara el terreno para los hijos.
    <div className="w-full flex-1 flex flex-col">

      {/* 
        Ahora, los hijos (móvil y tablet) tienen un padre con una altura bien definida y flexible.
        Usamos `flex-1` en cada uno para que el que esté visible ocupe todo ese espacio.
        Como la clase `hidden` de Tailwind usa `display: none`, el elemento oculto no ocupa espacio,
        permitiendo que el visible se expanda al 100%.
      */}
      
      <div className="block md:hidden flex-1">
        <MainMenuMobile onNavigate={onNavigate} userName={userName} />
      </div>
      
      <div className="hidden md:block flex-1">
        <MainMenuTablet onNavigate={onNavigate} userName={userName} />
      </div>

    </div>
  );
}
