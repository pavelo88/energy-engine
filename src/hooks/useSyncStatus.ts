'use client';
import { useState, useEffect } from 'react';

// This is a MOCK implementation for demonstration purposes.
// In a real app, this would interface with a service worker and IndexedDB.

export function useSyncStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncs, setPendingSyncs] = useState(0);

  useEffect(() => {
    // Initial state from navigator
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
        setIsOnline(navigator.onLine);
    }
    
    const handleOnline = () => {
      setIsOnline(true);
      // Simulate clearing the queue upon reconnection
      setPendingSyncs(0); 
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Mock pending syncs being added for demonstration when offline
    const interval = setInterval(() => {
      if (!navigator.onLine) {
        setPendingSyncs(prev => prev + 1);
      }
    }, 8000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
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
