
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { TABS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import { TasksTabLazy, InspectionFormTabLazy, ExpensesTabLazy, ProfileTabLazy } from './lazy-tabs';

// Mapeo de componentes para las pestañas, usando carga diferida (lazy loading)
const tabComponents = {
  [TABS.TASKS]: TasksTabLazy,
  [TABS.NEW_INSPECTION]: InspectionFormTabLazy,
  [TABS.EXPENSES]: ExpensesTabLazy,
  [TABS.PROFILE]: ProfileTabLazy,
};

// Función para renderizar el contenido de la pestaña activa
function renderTab(activeTab: string, setActiveTab: (tab: string) => void) {
  if (activeTab === TABS.MENU) return null;

  const TabComponent = tabComponents[activeTab as keyof typeof tabComponents];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="mb-10 hidden md:block border-l-4 border-blue-600 pl-8">
        <h2 className="text-6xl lg:text-9xl font-black text-slate-900 uppercase tracking-tighter leading-none">
          {activeTab.replace(/_/g, ' ')}
        </h2>
      </header>
      <Suspense fallback={<div className='text-slate-800'>Cargando...</div>}>
        <TabComponent {...(activeTab === TABS.TASKS && { onStartInspection: () => setActiveTab(TABS.NEW_INSPECTION) })} />
      </Suspense>
    </div>
  );
}

// Componente principal de la página de inspección
export default function InspectionPage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(TABS.MENU);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Manejo de la autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    
    // Manejo del estado de conexión
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    
    return () => {
      unsubscribe();
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // Pantalla de carga mientras se verifica el usuario
  if (!user) {
    return (
      <div className="h-screen bg-slate-100 flex flex-col items-center justify-center font-sans">
        <div className="text-center">
          <span className="font-black italic text-4xl tracking-tighter block leading-none text-slate-900">ENERGY</span>
          <span className="font-black italic text-4xl tracking-tighter block leading-none text-blue-600">ENGINE</span>
        </div>
        <p className="text-sm text-slate-500 mt-4">Cargando panel de control...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col xl:flex-row font-sans overflow-x-hidden">
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Fondo con degradado sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100 opacity-80"></div>
        
        <Header activeTab={activeTab} isOnline={isOnline} onNavigate={setActiveTab} />
        
        <main className={`flex-1 p-4 md:p-12 xl:p-20 max-w-[1500px] mx-auto w-full flex flex-col relative z-10 ${activeTab === TABS.MENU ? 'justify-start md:justify-center' : ''}`}>
          {activeTab === TABS.MENU ? (
            <MainMenu userName={user.email?.split('@')[0].toUpperCase() || 'Admin'} onNavigate={setActiveTab} />
          ) : renderTab(activeTab, setActiveTab)}
        </main>
      </div>
    </div>
  );
}
