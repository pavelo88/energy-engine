'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function InstallPwaButton() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Do not prevent the default browser prompt (e.g., mini-infobar)
      // event.preventDefault(); 
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* Wrapper div to allow tooltip on disabled button */}
          <div> 
            <Button
              variant="outline"
              size="sm"
              onClick={handleInstallClick}
              disabled={!installPrompt}
            >
              <Download className="mr-2 h-4 w-4" />
              Instalar App
            </Button>
          </div>
        </TooltipTrigger>
        {!installPrompt && (
          <TooltipContent>
            <p className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>La app no se puede instalar o ya está instalada.</span>
            </p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
