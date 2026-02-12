'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function InstallPwaButton() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault(); // Prevent the default mini-infobar from appearing on mobile
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // The type for the prompt event is not standard, so we cast to any
    const promptEvent = installPrompt as any;
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    
    if (outcome === 'accepted') {
      toast({
        title: '¡Aplicación Instalada!',
        description: 'La aplicación ahora está disponible en tu dispositivo.',
      });
    }

    setInstallPrompt(null); // The prompt can only be used once
  };

  if (!installPrompt) {
    return null; // Don't render the button if the app can't be installed
  }

  return (
    <Button variant="outline" size="sm" onClick={handleInstallClick}>
      <Download className="mr-2 h-4 w-4" />
      Instalar App
    </Button>
  );
}
