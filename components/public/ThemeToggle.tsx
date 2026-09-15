'use client';

import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="group relative flex items-center justify-center p-2 rounded-full text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] hover:bg-[var(--paper-muted)] transition-all duration-300"
      aria-label={`Switch to ${theme === 'light' ? 'Dark Paper' : 'Light Paper'} mode`}
      title={`Switch to ${theme === 'light' ? 'Dark Paper' : 'Light Paper'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" />
      ) : (
        <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
      )}
      <span className="sr-only">
        {theme === 'light' ? 'Switch to Dark Paper' : 'Switch to Light Paper'}
      </span>
    </button>
  );
}
