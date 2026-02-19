import { Zap } from 'lucide-react';

export const Logo = () => (
  <div className="flex items-center gap-4">
    <Zap className="text-primary fill-primary" size={32} />
    <div className="leading-none">
      <h1 className="font-bold text-xl tracking-tighter font-headline">ENERGY ENGINE</h1>
      <p className="text-[10px] text-primary uppercase tracking-widest font-black">Industrial Sat</p>
    </div>
  </div>
);
