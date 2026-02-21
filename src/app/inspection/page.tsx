'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';

// Importar componentes de Header y Footer
import Header from './components/Header';
import Footer from './components/Footer';

// Importar componentes principales
import MainMenuDesktop from './components/MainMenuDesktop';
import MainMenuTablet from './components/MainMenuTablet';
import MainMenuMobile from './components/MainMenuMobile';

// Importar componentes de las pestañas
import InspectionFormTab from './components/InspectionFormTab';
import TasksTab from './components/TasksTab';
import ExpensesTab from './components/ExpensesTab';
import ProfileTab from './components/ProfileTab';

// Importar constantes de pestañas
import TABS from './constants';

// Hook para detectar el tamaño de la pantalla
import { useScreenSize } from '@/hooks/use-screen-size';

// --- COMPONENTE DE LA PÁGINA DE INSPECCIÓN ---
export default function InspectionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>(TABS.MAIN_MENU);
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();
  const screenSize = useScreenSize();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
        <div className="flex items-center gap-3">
          <h1 className="font-black text-2xl tracking-tighter text-slate-800">ENERGY</h1>
          <h1 className="font-black text-2xl tracking-tighter text-amber-500">ENGINE</h1>
        </div>
        <p className="text-slate-500 font-medium mt-2">Cargando panel de control...</p>
      </div>
    );
  }

  const renderContent = () => {
    if (!hasMounted) return null;

    if (activeTab === TABS.MAIN_MENU) {
      switch (screenSize) {
        case 'mobile':
          return <MainMenuMobile onNavigate={handleNavigate} userName={user?.displayName || 'Admin'} />;
        case 'tablet':
          return <MainMenuTablet onNavigate={handleNavigate} userName={user?.displayName || 'Admin'} />;
        case 'desktop':
          return <MainMenuDesktop onNavigate={handleNavigate} userName={user?.displayName || 'Admin'} />;
        default:
          return null;
      }
    }

    let TabComponent;
    switch (activeTab) {
        case TABS.NEW_INSPECTION: TabComponent = InspectionFormTab; break;
        case TABS.TASKS: TabComponent = TasksTab; break;
        case TABS.EXPENSES: TabComponent = ExpensesTab; break;
        case TABS.PROFILE: TabComponent = ProfileTab; break;
        default: return <p>Pestaña no encontrada</p>;
    }

    return (
        <div className="animate-in slide-in-from-right duration-300">
            <TabComponent />
        </div>
    );
  };

  return (
    <main className="bg-slate-100 min-h-screen flex flex-col">
      <Header 
        activeTab={activeTab} 
        isOnline={isOnline} 
        onNavigate={handleNavigate} 
      />
      
      <div className="flex-grow">
        {renderContent()}
      </div>
      
      {/* El nuevo footer inteligente se muestra solo en el menú principal */}
      {activeTab === TABS.MAIN_MENU && <Footer />}
    </main>
  );
}
