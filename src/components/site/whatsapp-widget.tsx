'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
      <div className={cn("transition-all duration-300 transform origin-bottom-right", isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0")}>
        <div className="bg-card shadow-2xl rounded-lg w-72 mb-4 p-4 border">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold">Contactar</h4>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6"><X size={16}/></Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">¿Preguntas? Estamos aquí para ayudar.</p>
          <Button asChild className="w-full bg-green-500 hover:bg-green-600 text-white">
            <a href="https://wa.me/34925154354" target="_blank" rel="noopener noreferrer">
              Chatear en WhatsApp
            </a>
          </Button>
        </div>
      </div>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-green-600 transition-all"
        aria-label="Toggle WhatsApp chat"
      >
        {isOpen ? <X className="text-white" size={28} /> : <MessageCircle className="text-white" size={32} />}
      </Button>
    </div>
  );
}
