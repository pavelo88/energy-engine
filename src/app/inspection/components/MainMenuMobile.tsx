'use client';

import React from 'react';
import { 
  ClipboardList, Activity, Receipt, User, ArrowUpRight 
} from 'lucide-react';
import TABS from '../constants';

// --- PROPS DE LA INTERFAZ ---
interface MainMenuProps {
  onNavigate: (tab: string) => void;
  userName: string;
}

// --- PALETA PARA BOTONES (LA MISMA QUE TABLET, PARA CONSISTENCIA) ---
const menuItems = [
  {
    id: TABS.NEW_INSPECTION,
    label: 'Inspección',
    icon: <ClipboardList size={32} />,
    textColor: 'text-blue-600',
    borderColor: 'border-blue-600/70',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    id: TABS.TASKS,
    label: 'Historial',
    icon: <Activity size={32} />,
    textColor: 'text-green-600',
    borderColor: 'border-green-600/70',
    shadowColor: 'shadow-green-500/20',
  },
  {
    id: TABS.EXPENSES,
    label: 'Recibos',
    icon: <Receipt size={32} />,
    textColor: 'text-amber-600',
    borderColor: 'border-amber-600/70',
    shadowColor: 'shadow-amber-500/20',
  },
  {
    id: TABS.PROFILE,
    label: 'Mi Perfil',
    icon: <User size={32} />,
    textColor: 'text-purple-600',
    borderColor: 'border-purple-600/70',
    shadowColor: 'shadow-purple-500/20',
  },
];

// --- COMPONENTE MÓVIL: SCROLL HORIZONTAL Y BOTONES ALTOS ---
export default function MainMenuMobile({ onNavigate, userName }: MainMenuProps) {
  return (
    <div className="flex flex-col h-full w-full font-sans">
      
      <header className="px-6 pt-8 pb-4 w-full">
          <h2 className="text-slate-500 text-lg font-bold tracking-wider uppercase">Hola, {userName}</h2>
          <h1 className="text-slate-900 text-5xl font-black mt-1 tracking-tighter">Panel de Control</h1>
      </header>

      {/* CONTENEDOR CON SCROLL HORIZONTAL */}
      <div className="flex-1 w-full flex items-stretch overflow-x-auto x-scroll snap-x snap-mandatory pb-8">
        <div className="flex flex-nowrap items-stretch px-6 gap-6">

          {menuItems.map((item, index) => (
            <div key={item.id} className="snap-start flex-shrink-0 w-[85%]">
              <button
                onClick={() => onNavigate(item.id)}
                style={{ 
                  clipPath: 'polygon(1.5rem 0, calc(100% - 1.5rem) 0, 100% 1.5rem, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 1.5rem 100%, 0 calc(100% - 1.5rem), 0 1.5rem)',
                }}
                className={`group relative w-full h-full flex flex-col justify-between p-8 backdrop-blur-md bg-slate-50/80 border-2 ${item.borderColor} shadow-lg ${item.shadowColor}`}
              >
                <div className={`p-3 self-start bg-white rounded-xl shadow-inner-lg ${item.textColor}`}>
                    {item.icon}
                </div>
                <h3 className={`text-3xl font-black uppercase tracking-tight self-start ${item.textColor}`}>
                  {item.label}
                </h3>
                <ArrowUpRight className="absolute top-6 right-6 text-slate-300 opacity-80" />
              </button>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}
