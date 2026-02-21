'use client';

import React from 'react';
import { 
  ClipboardList, Activity, Receipt, User, ArrowUpRight, 
  LayoutGrid, Maximize, Home, Settings
} from 'lucide-react';
// --- CORRECCIÓN AQUÍ: CAMBIO DE IMPORTACIÓN NOMBRADA A DEFAULT ---
import TABS from '../constants'; 

// --- PROPS DE LA INTERFAZ ---
interface MainMenuProps {
  onNavigate: (tab: string) => void;
  userName: string;
}

// --- PALETA PARA BOTONES PRINCIPALES (CON IDs CORREGIDOS) ---
const menuItems = [
  {
    id: TABS.NEW_INSPECTION, 
    label: 'Inspección',
    desc: 'Inicia una nueva revisión vehicular.',
    icon: <ClipboardList size={40} />,
    textColor: 'text-blue-600',
    borderColor: 'border-blue-600/70',
    shadowColor: 'shadow-blue-500/20',
    hoverShadowColor: 'hover:shadow-blue-400/40',
  },
  {
    id: TABS.TASKS, 
    label: 'Historial',
    desc: 'Consulta tus revisiones pasadas.',
    icon: <Activity size={40} />,
    textColor: 'text-green-600',
    borderColor: 'border-green-600/70',
    shadowColor: 'shadow-green-500/20',
    hoverShadowColor: 'hover:shadow-green-400/40',
  },
  {
    id: TABS.EXPENSES,
    label: 'Recibos',
    desc: 'Gestiona tus pagos y facturas.',
    icon: <Receipt size={40} />,
    textColor: 'text-amber-600',
    borderColor: 'border-amber-600/70',
    shadowColor: 'shadow-amber-500/20',
    hoverShadowColor: 'hover:shadow-amber-400/40',
  },
  {
    id: TABS.PROFILE, 
    label: 'Mi Perfil',
    desc: 'Ajusta la configuración de tu cuenta.',
    icon: <User size={40} />,
    textColor: 'text-purple-600',
    borderColor: 'border-purple-600/70',
    shadowColor: 'shadow-purple-500/20',
    hoverShadowColor: 'hover:shadow-purple-400/40',
  },
];

// --- COMPONENTE TABLET CON FOOTER DE NAVEGACIÓN ---
export default function MainMenuTablet({ onNavigate, userName }: MainMenuProps) {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-between p-8 lg:p-12 font-sans">
      
      <main>
        <header className="w-full mb-16 text-left">
            <h2 className="text-slate-500 text-xl font-bold tracking-wider uppercase">Hola, {userName}</h2>
            <h1 className="text-slate-900 text-8xl font-black mt-1 tracking-tighter">Panel de Control</h1>
        </header>

        <div className="w-full grid grid-cols-2 gap-10">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{ 
                clipPath: 'polygon(1.5rem 0, calc(100% - 1.5rem) 0, 100% 1.5rem, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 1.5rem 100%, 0 calc(100% - 1.5rem), 0 1.5rem)',
              }}
              className={`group relative h-48 backdrop-blur-md bg-slate-50/80 border-2 ${item.borderColor} shadow-lg ${item.shadowColor} ${item.hoverShadowColor} transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className="flex flex-col h-full justify-start items-start p-8 text-left">
                <div className={`p-3 mb-4 bg-white rounded-xl shadow-inner-lg ${item.textColor}`}>
                    {item.icon}
                </div>
                <div>
                    <h3 className={`text-3xl font-black uppercase tracking-tight ${item.textColor}`}>
                      {item.label}
                    </h3>
                    <p className={`mt-2 font-medium text-slate-500`}>{item.desc}</p>
                </div>
              </div>
              <ArrowUpRight className="absolute top-8 right-8 text-slate-300 opacity-80 group-hover:opacity-100 group-hover:text-slate-500 transition-all duration-300 transform group-hover:scale-110" />
            </button>
          ))}
        </div>
      </main>

      <footer className="w-full mt-16 py-4 px-8 bg-slate-800 rounded-3xl shadow-2xl shadow-slate-400">
        <div className="flex items-center justify-around">
          {[<LayoutGrid/>, <Maximize/>, <Home/>, <User/>, <Settings/>].map((Icon, index) => (
            <button key={index} className="p-3 text-slate-400 hover:text-white transition-colors duration-300">
              {React.cloneElement(Icon, { size: 36 })}
            </button>
          ))}
        </div>
      </footer>

    </div>
  );
}
