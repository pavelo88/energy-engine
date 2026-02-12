"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme?: 'dark' | 'light';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch (e) {
      console.warn('Could not access localStorage. Falling back to default theme.');
      return defaultTheme;
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>();

  const applyTheme = useCallback((themeToApply: Theme) => {
    const root = window.document.documentElement;

    let effectiveTheme = themeToApply;
    if (effectiveTheme === 'system' && enableSystem) {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    const finalTheme = effectiveTheme as 'dark' | 'light';
    setResolvedTheme(finalTheme);
    
    root.classList.remove('light', 'dark');
    root.classList.add(finalTheme);
    
    try {
      localStorage.setItem(storageKey, themeToApply);
    } catch (e) {
      console.warn('Could not save theme to localStorage.');
    }

  }, [enableSystem, storageKey]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    if (!enableSystem || theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyTheme, theme, enableSystem]);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
