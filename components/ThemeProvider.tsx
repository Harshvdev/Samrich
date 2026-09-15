'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type PaperTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: PaperTheme;
  toggleTheme: () => void;
  setTheme: (theme: PaperTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<PaperTheme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Light paper is the default theme unless explicitly toggled to dark
    const saved = localStorage.getItem('samrich-paper-theme') as PaperTheme | null;
    const initialTheme: PaperTheme = saved === 'dark' ? 'dark' : 'light';
    
    setThemeState(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: PaperTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('samrich-paper-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
