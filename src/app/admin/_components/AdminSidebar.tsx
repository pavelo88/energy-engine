'use client';
import {
  LayoutDashboard,
  HardHat,
  FileText,
  Camera,
  Settings,
  User,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import type { AdminView } from '../page';

const navItems = {
  admin: [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'inspection', label: 'Nueva Inspección', icon: Camera },
    { view: 'assets', label: 'Gestión de Activos', icon: HardHat },
    { view: 'reports', label: 'Informes', icon: FileText },
    { view: 'cms', label: 'Editor Web', icon: Settings },
  ],
  gerente: [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'reports', label: 'Informes', icon: FileText },
  ],
  inspector: [
      { view: 'inspection', label: 'Realizar Inspección', icon: Camera },
  ],
};

export default function AdminSidebar() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const handleSetView = (view: AdminView) => {
    const event = new CustomEvent('setView', { detail: view });
    window.dispatchEvent(event);
    setActiveView(view);
  };
  
  // Listen for external changes to activeView
  useEffect(() => {
    const handler = (event: Event) => {
        setActiveView((event as CustomEvent).detail);
    };
    window.addEventListener('setView', handler);
    return () => window.removeEventListener('setView', handler);
  }, []);

  if (loading) {
    return (
      <div className="p-2 space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const itemsToShow = user ? navItems[user.rol] : [];

  return (
    <SidebarMenu>
      {itemsToShow.map((item) => (
        <SidebarMenuItem key={item.view}>
          <SidebarMenuButton
            onClick={() => handleSetView(item.view)}
            isActive={activeView === item.view}
            tooltip={item.label}
          >
            <item.icon />
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
