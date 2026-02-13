
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#clientes', label: 'Clientes' },
  { href: '#contacto', label: 'Contacto' },
];

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto h-16 flex items-center">
        <Link className="flex items-center gap-2 mr-auto" href="#">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
          <span className="font-bold text-xl font-orbitron">AssetTrack AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => (
            <a key={link.href} className="transition-colors hover:text-primary text-foreground/80" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-4">
           <Link href="/admin" className="hidden sm:flex">
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10 hover:text-primary">
                  Panel
              </Button>
          </Link>
          <ThemeToggle />
          
          {/* Mobile Nav Trigger */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background w-[280px]">
                <SheetTitle className="sr-only">Navegación Principal</SheetTitle>
                 <div className="p-6 h-full flex flex-col">
                    <Link className="flex items-center gap-2 mb-8" href="#" onClick={() => setIsMobileMenuOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
                        <span className="font-bold text-xl font-orbitron">AssetTrack AI</span>
                    </Link>
                    <div className="flex flex-col gap-6">
                    {navLinks.map(link => (
                        <SheetClose asChild key={link.href}>
                            <a href={link.href} className="text-lg font-medium hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                            {link.label}
                            </a>
                        </SheetClose>
                    ))}
                    </div>
                    <SheetClose asChild>
                        <Link href="/admin" className='mt-auto'>
                            <Button variant="outline" className="w-full">
                                Acceder al Panel
                            </Button>
                        </Link>
                    </SheetClose>
                 </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
