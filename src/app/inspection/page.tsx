'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { X } from 'lucide-react';

// Importar componentes principales
import MainMenuDesktop from './components/MainMenuDesktop';
import MainMenuTablet from './components/MainMenuTablet';
import MainMenuMobile from './components/MainMenuMobile';

// Importar componentes de las pestañas (usando carga diferida)
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
  const [loading, setLoading] = useState(true); // Estado para la pantalla de carga inicial
  const [activeTab, setActiveTab] = useState<string>(TABS.MAIN_MENU); 
  const router = useRouter();

  const { width } = useScreenSize();

  // Efecto para verificar la sesión del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Si no hay usuario, redirigir a la página de inicio
        router.push('/');
      }
      setLoading(false); // Finalizar la carga cuando se resuelve la autenticación
    });

    // Limpiar el observador al desmontar el componente
    return () => unsubscribe();
  }, [router]);

  // Función para manejar la navegación entre pestañas
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
  };

  // --- PANTALLA DE CARGA INICIAL ---
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

  // --- RENDERIZADO DEL CONTENIDO ---
  const renderContent = () => {
    if (activeTab === TABS.MAIN_MENU) {
        if (width < 768) return <MainMenuMobile onNavigate={handleNavigate} userName={user?.displayName || 'Admin'} />;
        if (width < 1024) return <MainMenuTablet onNavigate={handleNavigate} userName={user?.displayName || 'Admin'} />;
        return <MainMenuDesktop onNavigate={handleNavigate} userName={user?.displayName || 'Admin'} />;
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
        <div className="animate-in slide-in-from-right duration-500">
            <button 
                onClick={() => setActiveTab(TABS.MAIN_MENU)} // Volver al menú principal
                className="fixed top-6 left-6 z-[210] bg-white/80 backdrop-blur-md p-3 rounded-2xl border shadow-sm hover:bg-amber-50 text-slate-600 transition-all"
            >
                <X size={24} />
            </button>
            <TabComponent />
        </div>
    );
  };

  return <main>{renderContent()}</main>;
}
