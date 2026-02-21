'use client';

import React from 'react';
import { 
  ClipboardList, Activity, Receipt, User, ArrowUpRight, 
  LayoutGrid, Maximize, Home, Settings
} from 'lucide-react';

// --- PROPS DE LA INTERFAZ ---
interface MainMenuProps {
  onNavigate: (tab: string) => void;
  userName: string;
}

// --- PALETA PARA BOTONES PRINCIPALES ---
const menuItems = [
  {
    id: 'inspeccion',
    label: 'Inspección',
    desc: 'Inicia una nueva revisión.',
    icon: <ClipboardList size={36} />,
    textColor: 'text-blue-600',
    shadowColor: 'shadow-blue-500/20',
    hoverShadowColor: 'hover:shadow-blue-400/40',
  },
  {
    id: 'actividad',
    label: 'Historial',
    desc: 'Consulta revisiones pasadas.',
    icon: <Activity size={36} />,
    textColor: 'text-green-600',
    shadowColor: 'shadow-green-500/20',
    hoverShadowColor: 'hover:shadow-green-400/40',
  },
  {
    id: 'recibos',
    label: 'Recibos',
    desc: 'Gestiona tus pagos.',
    icon: <Receipt size={36} />,
    textColor: 'text-amber-600',
    shadowColor: 'shadow-amber-500/20',
    hoverShadowColor: 'hover:shadow-amber-400/40',
  },
  {
    id: 'perfil',
    label: 'Mi Perfil',
    desc: 'Ajusta tu cuenta.',
    icon: <User size={36} />,
    textColor: 'text-purple-600',
    shadowColor: 'shadow-purple-500/20',
    hoverShadowColor: 'hover:shadow-purple-400/40',
  },
];

// --- COMPONENTE DE ESCRITORIO CON DISEÑO FINAL ---
export default function MainMenuDesktop({ onNavigate, userName }: MainMenuProps) {
  return (
    <div className="min-h-screen w-full bg-slate-800 flex flex-col justify-between p-12 font-sans">
      
      {/* --- CONTENIDO PRINCIPAL (HEADER + GRID) --- */}
      <main>
        <header className="w-full mb-20 text-left">
            <h2 className="text-slate-500 text-xl font-bold tracking-wider uppercase">Hola, {userName}</h2>
            <h1 className="text-slate-900 text-8xl font-black mt-1 tracking-tighter">Panel de Control</h1>
        </header>

        <div className="w-full grid grid-cols-4 gap-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{ 
                clipPath: 'polygon(1.5rem 0, calc(100% - 1.5rem) 0, 100% 1.5rem, 100% calc(100% - 1.5rem), calc(100% - 1.5rem) 100%, 1.5rem 100%, 0 calc(100% - 1.5rem), 0 1.5rem)',
              }}
              className={`group relative h-56 backdrop-blur-md bg-slate-50/80 border border-slate-200/80 shadow-lg ${item.shadowColor} ${item.hoverShadowColor} transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div className="flex flex-col h-full justify-start items-start p-7 text-left">
                <div className={`p-3 mb-4 bg-slate-800 rounded-xl shadow-inner-lg ${item.textColor}`}>
                    {item.icon}
                </div>
                <div>
                    <h3 className={`text-2xl font-black uppercase tracking-tight ${item.textColor}`}>
                      {item.label}
                    </h3>
                    <p className={`mt-1.5 font-medium text-slate-500`}>{item.desc}</p>
                </div>
              </div>
              <ArrowUpRight className="absolute top-7 right-7 text-slate-300 opacity-80 group-hover:opacity-100 group-hover:text-slate-500 transition-all duration-300 transform group-hover:scale-110" />
            </button>
          ))}
        </div>
      </main>

      {/* --- FOOTER DE NAVEGACIÓN --- */}
      <footer className="w-full mt-16 py-4 px-8 bg-slate-800 rounded-3xl shadow-2xl shadow-slate-400">
        <div className="flex items-center justify-around">
        {[<LayoutGrid/>, <Maximize/>, <Home/>, <User/>, <Settings/>].map((Icon, index) => (
            <button key={index} className="p-3 text-slate-400 hover:text-white transition-colors duration-300">
              {React.cloneElement(Icon, { size: 40 })}
            </button>
          ))}
        </div>
      </footer>

    </div>
  );
}
