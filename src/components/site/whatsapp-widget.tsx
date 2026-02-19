'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WhatsAppWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-green-600 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <a href="https://wa.me/34925154354" target="_blank" rel="noopener noreferrer">
          <MessageCircle className="text-white" size={32} />
        </a>
      </Button>
    </div>
  );
}
