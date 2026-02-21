'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import TABS from '../constants';

interface HeaderProps {
  activeTab: string;
  isOnline: boolean;
  onNavigate: (tab: string) => void;
}

export default function Header({ activeTab, isOnline, onNavigate }: HeaderProps) {
  return (
    <header className="px-6 py-4 bg-slate-800 backdrop-blur-lg border-b border-white/80 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      
      <div className="flex items-center gap-4">
        {activeTab !== TABS.MAIN_MENU && (
          <button onClick={() => onNavigate(TABS.MAIN_MENU)} className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center text-white border border-black/10 hover:bg-black/10 transition-all">
            <ChevronLeft size={20} />
          </button>
        )}
        <span className="font-white text-white italic tracking-tighter text-xl">ENERGY ENGINE</span>
      </div>

      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black border ${isOnline ? 'border-emerald-500/30 text-emerald-500' : 'border-red-500/30 text-red-400'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`} />
        {isOnline ? 'ONLINE' : 'OFFLINE'}
      </div>
    </header>
  );
}
