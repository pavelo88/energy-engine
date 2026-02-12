'use client';

import { Wifi, WifiOff, CircleDashed } from 'lucide-react';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

export function SyncStatusBadge() {
  const { status, pendingSyncs } = useSyncStatus();
  const { state } = useSidebar();

  const statusConfig = {
    synced: {
      label: 'Sincronizado',
      icon: Wifi,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    pending: {
      label: `Pendiente (${pendingSyncs})`,
      icon: CircleDashed,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    offline: {
      label: 'Sin Conexión',
      icon: WifiOff,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  };

  const currentStatus = statusConfig[status];
  const Icon = currentStatus.icon;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border p-2 text-sm transition-all',
        currentStatus.bgColor,
        'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-full'
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', currentStatus.color)} />
      <span
        className={cn(
          'font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden',
          currentStatus.color
        )}
      >
        {state === 'expanded' ? currentStatus.label : ''}
      </span>
    </div>
  );
}
