
'use client';

import React from 'react';
import { ClipboardList, Activity, Receipt, User, ArrowUpRight } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (tab: string) => void;
  userName: string;
}

// Mapeo de iconos para los items del menú
const getIcon = (id: string) => {
  switch (id) {
    case 'inspeccion': return <ClipboardList size={28} />;
    case 'actividad': return <Activity size={28} />;
    case 'recibos': return <Receipt size={28} />;
    case 'perfil': return <User size={28} />;
    default: return <ArrowUpRight size={28} />;
  }
};

const menuItems = [
  { id: 'inspeccion', label: 'Inspección', desc: 'Nueva revisión', color: 'text-blue-600' },
  { id: 'actividad', label: 'Historial', desc: 'Actividad reciente', color: 'text-emerald-600' },
  { id: 'recibos', label: 'Recibos', desc: 'Gestión de pagos', color: 'text-amber-600' },
  { id: 'perfil', label: 'Mi Perfil', desc: 'Configuración', color: 'text-purple-600' },
];

export default function MainMenu({ onNavigate, userName }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="w-full max-w-7xl mx-auto px-4">
        <header className="mb-10 text-left">
          <h1 className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-2">Bienvenido, {userName}</h1>
          <h2 className="text-slate-900 text-4xl font-black">Panel Principal</h2>
        </header>

        {/* Grid responsivo: 1 columna en móvil, 2 en tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group relative flex flex-col justify-between p-6 md:p-10 h-[220px] md:h-[380px] bg-white border border-slate-200 rounded-[2rem] overflow-hidden transition-all hover:border-blue-500 hover:shadow-2xl active:scale-[0.98] shadow-sm text-left"
            >
              {/* Decoración sutil de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 group-hover:bg-blue-50" />
              
              <div className="z-10 w-full flex justify-between items-start">
                <div className={`p-3 rounded-2xl bg-slate-100 transition-colors group-hover:bg-blue-600 group-hover:text-white ${item.color}`}>
                  {getIcon(item.id)}
                </div>
                <ArrowUpRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>

              <div className="z-10">
                <p className="text-slate-400 text-[10px] md:text-sm font-bold tracking-[0.3em] mb-1 md:mb-3 uppercase">
                  {item.desc}
                </p>
                <h3 className="text-slate-900 text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none group-hover:text-blue-600 transition-colors">
                  {item.label}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
