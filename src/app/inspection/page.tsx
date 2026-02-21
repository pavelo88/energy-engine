'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Wifi, WifiOff, ChevronLeft, ShieldCheck, 
  LayoutDashboard, ClipboardList, Receipt, 
  User as UserIcon, LogOut, Activity 
} from 'lucide-react'; // <--- IMPORTACIONES CORREGIDAS

import MainMenu from './components/MainMenu';
import TasksTab from './components/TasksTab';
import InspectionFormTab from './components/InspectionFormTab';
import ExpensesTab from './components/ExpensesTab';
import ProfileTab from './components/ProfileTab';

export default function InspectionPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      unsubscribe();
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  if (!user) return <div className="h-screen bg-black flex items-center justify-center font-black text-amber-500 italic tracking-tighter">ENERGY ENGINE...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col xl:flex-row font-sans overflow-x-hidden">
      
      {/* SIDEBAR PROFESIONAL: Solo para Computadora (>1280px) */}
      <aside className="hidden xl:flex w-80 bg-slate-900/40 backdrop-blur-2xl flex-col p-10 sticky top-0 h-screen border-r border-white/5">
        <div className="mb-12 border-l-4 border-amber-500 pl-6">
          <span className="font-black italic text-3xl tracking-tighter block leading-none">ENERGY ENGINE</span>
          <p className="text-[9px] text-amber-500 font-black tracking-[0.4em] uppercase mt-2">Professional Suite</p>
        </div>
        <nav className="flex-1 space-y-4">
          {[
            { id: 'menu', label: 'Inicio / Dashboard', icon: LayoutDashboard, color: 'text-amber-500' },
            { id: 'home', label: 'Tareas Pendientes', icon: ClipboardList, color: 'text-blue-500' },
            { id: 'new', label: 'Nueva Inspección', icon: Activity, color: 'text-emerald-500' },
            { id: 'expenses', label: 'Gastos y Viáticos', icon: Receipt, color: 'text-orange-500' },
            { id: 'profile', label: 'Perfil de Usuario', icon: UserIcon, color: 'text-slate-400' },
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10' : 'text-slate-500 hover:text-white'}`}>
              <item.icon size={22} className={activeTab === item.id ? item.color : ''} /> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => auth.signOut()} className="flex items-center gap-4 p-5 text-red-500/60 font-bold hover:text-red-500 transition-all">
          <LogOut size={22} /> Cerrar Sesión
        </button>
      </aside>

      {/* CUERPO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Fondo de circuitos sutil */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>

        {/* HEADER: Móvil y Tablet */}
        <header className="px-6 py-4 bg-black/60 backdrop-blur-xl border-b border-white/5 flex justify-between items-center sticky top-0 z-50 xl:hidden">
          <div className="flex items-center gap-4">
            {activeTab !== 'menu' && (
              <button onClick={() => setActiveTab('menu')} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10">
                <ChevronLeft size={20} />
              </button>
            )}
            <span className="font-black text-white italic tracking-tighter text-xl">ENERGY ENGINE</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black border ${isOnline ? 'border-emerald-500/30 text-emerald-400' : 'border-red-500/30 text-red-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </div>
        </header>

        {/* CONTENIDO RESPONSIVO */}
        <main className={`flex-1 p-4 md:p-12 xl:p-20 max-w-[1500px] mx-auto w-full flex flex-col ${activeTab === 'menu' ? 'justify-start md:justify-center' : ''}`}>
          {activeTab === 'menu' && (
            <MainMenu userName={user.email?.split('@')[0].toUpperCase()} onNavigate={setActiveTab} />
          )}
          
          {activeTab !== 'menu' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <header className="mb-10 hidden md:block border-l-4 border-amber-500 pl-8">
                <h2 className="text-6xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-2xl">{activeTab}</h2>
              </header>
              {/* Componentes de las pestañas aquí */}
              {activeTab === 'home' && <TasksTab onStartInspection={() => setActiveTab('new')} />}
              {activeTab === 'new' && <InspectionFormTab />}
              {activeTab === 'expenses' && <ExpensesTab />}
              {activeTab === 'profile' && <ProfileTab />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}