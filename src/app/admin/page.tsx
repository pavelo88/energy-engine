'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import Dashboard from './_components/Dashboard';
import AssetManager from './_components/AssetManager';
import Reports from './_components/Reports';
import CmsEditor from './_components/CmsEditor';
import InspectionForm from './_components/InspectionForm';

export type AdminView = 'dashboard' | 'assets' | 'reports' | 'inspection' | 'cms';

// This is a mapping from role to their default view and available views
const roleViews: Record<string, { default: AdminView; available: AdminView[] }> = {
  admin: {
    default: 'dashboard',
    available: ['dashboard', 'assets', 'reports', 'inspection', 'cms'],
  },
  gerente: {
    default: 'dashboard',
    available: ['dashboard', 'reports'],
  },
  inspector: {
    default: 'inspection',
    available: ['inspection'],
  },
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  useEffect(() => {
    if (user && user.rol) {
      const { default: defaultView } = roleViews[user.rol] || roleViews.inspector;
      setActiveView(defaultView);
    }
  }, [user]);

  // Expose setActiveView to be usable by child components (e.g., sidebar)
  useEffect(() => {
    const handler = (event: Event) => {
        const customEvent = event as CustomEvent<AdminView>;
        if (user && roleViews[user.rol].available.includes(customEvent.detail)) {
            setActiveView(customEvent.detail);
        }
    };
    window.addEventListener('setView', handler);
    return () => window.removeEventListener('setView', handler);
  }, [user]);

  const renderView = () => {
    if (loading || !user) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      );
    }

    if (!roleViews[user.rol].available.includes(activeView)) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold">Acceso Denegado</h2>
                <p className="text-muted-foreground">No tienes permiso para ver esta sección.</p>
            </div>
        );
    }
    
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'assets':
        return <AssetManager />;
      case 'reports':
        return <Reports />;
      case 'inspection':
        return <InspectionForm />;
      case 'cms':
        return <CmsEditor />;
      default:
        return <Dashboard />;
    }
  };

  return <div className="w-full">{renderView()}</div>;
}
