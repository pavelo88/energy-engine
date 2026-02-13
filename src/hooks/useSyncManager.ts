'use client';

import { useEffect, useState, useRef } from 'react';
import { useSyncStatus } from './useSyncStatus';
import { localDb } from '@/lib/db';
import { syncReportToFirestore } from '@/lib/data';
import { useToast } from './use-toast';
import type { Report } from '@/lib/types';

export function useSyncManager() {
  const { isOnline } = useSyncStatus();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    if (isOnline && !isProcessing.current) {
      processQueue();
    }
  }, [isOnline]);

  const processQueue = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setIsSyncing(true);
    console.log('Checking for pending sync tasks...');

    const pendingTasks = await localDb.sync_tasks.where('status').equals('pending').toArray();

    if (pendingTasks.length === 0) {
      console.log('Sync queue is empty.');
      setIsSyncing(false);
      isProcessing.current = false;
      return;
    }

    toast({
      title: 'Sincronización en progreso',
      description: `Sincronizando ${pendingTasks.length} tarea(s) pendientes.`,
    });

    for (const task of pendingTasks) {
      try {
        await localDb.sync_tasks.update(task.id!, { status: 'syncing' });

        if (task.type === 'report') {
          await syncReportToFirestore(task.payload as Report);
        }
        // Future task types like 'multimedia' can be handled here.

        await localDb.sync_tasks.update(task.id!, { status: 'synced' });
        console.log(`Task ${task.id} synced successfully.`);

      } catch (error) {
        console.error(`Failed to sync task ${task.id}:`, error);
        await localDb.sync_tasks.update(task.id!, { status: 'failed' });
        toast({
          variant: 'destructive',
          title: 'Error de Sincronización',
          description: `No se pudo sincronizar la tarea ${task.id}. Se reintentará más tarde.`,
        });
      }
    }
    
    const remainingTasks = await localDb.sync_tasks.where('status').equals('pending').count();
    if(remainingTasks === 0) {
        toast({
            title: 'Sincronización Completa',
            description: 'Todos los datos locales están actualizados con el servidor.',
        });
    }

    setIsSyncing(false);
    isProcessing.current = false;
  };
}
