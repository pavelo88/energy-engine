'use client';
import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '@/lib/db';

export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState(true);

  // Use Dexie's live query to get the count of pending tasks
  const pendingSyncs = useLiveQuery(
    () => localDb.sync_tasks.where('status').equals('pending').count(),
    [], // dependencies
    0 // initial value
  );

  useEffect(() => {
    // Check initial online status
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        setIsOnline(navigator.onLine);
    }
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  let status: 'synced' | 'pending' | 'offline' = 'synced';
  if (!isOnline) {
    status = 'offline';
  } else if (pendingSyncs > 0) {
    status = 'pending';
  }

  return { status, pendingSyncs, isOnline };
}
