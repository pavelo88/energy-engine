'use client';

import React from 'react';
import { ClipboardList, Activity, Receipt, User, ArrowUpRight } from 'lucide-react';

interface MainMenuProps {
  onNavigate: (tab: string) => void;
  userName: string;
}

export default function MainMenu({ onNavigate, userName }: MainMenuProps) {
  const menuItems = [
    { id: 'home', label: 'Tareas', icon: ClipboardList, glow: 'shadow-[0_0_40px_rgba(59,130,246,0.2)]', border: 'border-blue-500/30', text: 'text-blue-400', desc: 'HOJA DE RUTA' },
    { id: 'new', label: 'Inspección', icon: Activity, glow: 'shadow-[0_0_40px_rgba(16,185,129,0.3)]', border: 'border-emerald-500/40', text: 'text-emerald-400', desc: 'NUEVO REPORTE' },
    { id: 'expenses', label: 'Gastos', icon: Receipt, glow: 'shadow-[0_0_40px_rgba(245,158,11,0.2)]', border: 'border-amber-500/30', text: 'text-amber-400', desc: 'DIETAS Y GPS' },
    { id: 'profile', label: 'Perfil', icon: User, glow: 'shadow-[0_0_40px_rgba(255,255,255,0.05)]', border: 'border-white/10', text: 'text-slate-400', desc: 'CONFIGURACIÓN' },
  ];

  return (
    <div className="flex flex-col space-y-6 md:space-y-16 animate-in fade-in zoom-in duration-700">
      
      {/* Saludo Compacto para Celular / Gigante para Tablet */}
      <div className="px-2 relative">
        <div className="absolute -left-6 top-0 h-full w-1.5 bg-amber-500 shadow-[0_0_15px_#fbbf24] hidden md:block"></div>
        <p className="text-amber-500 font-black text-[9px] md:text-xs uppercase tracking-[0.4em] mb-1">RTS Quantum Terminal</p>
        <h1 className="text-4xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter leading-none">
          HOLA, <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-600 italic">{userName}</span>
        </h1>
      </div>

      {/* REJILLA CRISTAL: 1 col móvil, 2 cols Tablet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 lg:gap-14">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`group relative bg-white/[0.03] backdrop-blur-3xl p-6 md:p-14 lg:p-20 rounded-[2.5rem] md:rounded-[4rem] lg:rounded-[6rem] border-2 ${item.border} flex flex-col justify-between min-h-[150px] md:min-h-[350px] lg:min-h-[500px] transition-all active:scale-[0.98] hover:bg-white/[0.07] hover:${item.glow} overflow-hidden`}
          >
            {/* Resplandor Neón Interno */}
            <div className={`absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-white/10 to-transparent blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="flex justify-between items-start z-10">
              <div className={`w-12 h-12 md:w-28 md:h-28 lg:w-40 lg:h-40 rounded-2xl md:rounded-[2.5rem] lg:rounded-[4rem] flex items-center justify-center bg-white/5 border border-white/10 ${item.text} shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]`}>
                <item.icon className="w-6 h-6 md:w-14 md:h-14 lg:w-24 lg:h-24 drop-shadow-2xl" strokeWidth={1.5} />
              </div>
              <ArrowUpRight className="text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={32} />
            </div>

            <div className="z-10 text-left">
              <p className={`${item.text} text-[8px] md:text-sm lg:text-base font-black tracking-[0.4em] mb-1 md:mb-4 opacity-60 uppercase`}>
                {item.desc}
              </p>
              <h3 className="text-white text-2xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none group-hover:tracking-normal transition-all">
                {item.label}
              </h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}