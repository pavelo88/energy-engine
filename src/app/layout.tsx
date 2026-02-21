import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/site/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script'; // Importamos el componente Script de Next.js

export const metadata: Metadata = {
  title: 'PowerSat Solutions',
  description:
    'Especialistas en mantenimiento industrial para infraestructuras de alta exigencia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* Cargamos jsPDF y AutoTable de forma externa para que estén disponibles en el componente de Inspección */}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" 
          strategy="beforeInteractive" 
        />
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js" 
          strategy="afterInteractive" 
        />
      </head>
      <body className={cn('min-h-screen font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}