'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/data';
import { ThemeToggle } from './theme-toggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderNavLinks = () => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} variant="link" asChild className="text-foreground/80">
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </>
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-2xl border-b'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link href="/">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-2">
          {renderNavLinks()}
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button className="hidden md:block bg-foreground text-background px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-foreground/80 transition-all">
            Área Técnica
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col items-center gap-8 mt-16">
                  {renderNavLinks()}
                  <Button className="w-full bg-foreground text-background px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-foreground/80 transition-all">
                    Área Técnica
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
