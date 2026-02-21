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

// --- PALETA PARA BOTONES (CON DESCRIPCIONES) ---
const menuItems = [
  {
    id: TABS.NEW_INSPECTION,
    label: 'Inspección',
    desc: 'Inicia una nueva revisión vehicular.',
    icon: <ClipboardList size={32} />, // Mantener ícono más pequeño para móvil
    textColor: 'text-blue-600',
    borderColor: 'border-blue-600/70',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    id: TABS.TASKS,
    label: 'Historial',
    desc: 'Consulta tus revisiones pasadas.',
    icon: <Activity size={32} />,
    textColor: 'text-green-600',
    borderColor: 'border-green-600/70',
    shadowColor: 'shadow-green-500/20',
  },
  {
    id: TABS.EXPENSES,
    label: 'Recibos',
    desc: 'Gestiona tus pagos y facturas.',
    icon: <Receipt size={32} />,
    textColor: 'text-amber-600',
    borderColor: 'border-amber-600/70',
    shadowColor: 'shadow-amber-500/20',
  },
  {
    id: TABS.PROFILE,
    label: 'Mi Perfil',
    desc: 'Ajusta la configuración de tu cuenta.',
    icon: <User size={32} />,
    textColor: 'text-purple-600',
    borderColor: 'border-purple-600/70',
    shadowColor: 'shadow-purple-500/20',
  },
];

// --- COMPONENTE MÓVIL: REJILLA 2-COLUMNAS ESTILO TABLET ---
export default function MainMenuMobile({ onNavigate, userName }: MainMenuProps) {
  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col p-6 font-sans">
      
      <header className="w-full mb-8 text-left">
          <h2 className="text-slate-500 text-lg font-bold tracking-wider uppercase">Hola, {userName}</h2>
          <h1 className="text-slate-900 text-5xl font-black mt-1 tracking-tighter">Panel de Control</h1>
      </header>

      <main className="w-full">
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{ 
                clipPath: 'polygon(1rem 0, calc(100% - 1rem) 0, 100% 1rem, 100% calc(100% - 1rem), calc(100% - 1rem) 100%, 1rem 100%, 0 calc(100% - 1rem), 0 1rem)',
              }}
              className={`group relative aspect-square backdrop-blur-md bg-slate-50/80 border-2 ${item.borderColor} shadow-md ${item.shadowColor} transition-all duration-300 active:scale-95`}
            >
              <div className="flex flex-col h-full justify-start items-start p-4 text-left">
                <div className={`p-2 mb-3 bg-slate-50 rounded-lg shadow-inner-lg ${item.textColor}`}>
                    {item.icon}
                </div>
                <div>
                    <h3 className={`text-xl font-black uppercase tracking-tight ${item.textColor}`}>
                      {item.label}
                    </h3>
                    {/* Ocultar descripción en pantallas muy pequeñas si es necesario, pero intentemos mostrarla */}
                    <p className={`mt-1 text-xs font-medium text-slate-500`}>{item.desc}</p>
                </div>
              </div>
              <ArrowUpRight className="absolute top-4 right-4 text-slate-300 opacity-70" />
            </button>
          ))}
        </div>
      </main>

      {/* Se puede agregar un footer de navegación si se desea, similar al de Tablet */}
      {/* 
      <footer className="w-full mt-8 py-3 px-6 bg-slate-800 rounded-2xl shadow-lg">
        ...
      </footer> 
      */}

    </div>
  );
}
