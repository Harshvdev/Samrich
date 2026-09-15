'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/poems', label: 'Poems' },
    { href: '/stories', label: 'Stories' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--paper-border)] bg-[var(--paper-bg)]/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Author / Masthead Logo */}
        <Link 
          href="/" 
          className="group flex flex-col justify-center"
        >
          <span className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[var(--paper-ink)] group-hover:text-[var(--paper-accent)] transition-colors">
            Samrich
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--paper-ink-muted)] -mt-1 font-sans">
            Poems & Stories
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-sans tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive 
                    ? 'text-[var(--paper-ink)] font-medium' 
                    : 'text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--paper-accent)] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search & Theme Toggle */}
        <div className="flex items-center space-x-3">
          <Link
            href="/search"
            className="p-2 text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] rounded-full hover:bg-[var(--paper-muted)] transition-colors"
            title="Search poems & stories"
            aria-label="Search poems & stories"
          >
            <Search className="w-4 h-4" />
          </Link>
          
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-[var(--paper-border)] bg-[var(--paper-card)] px-6 py-6 transition-all">
          <nav className="flex flex-col space-y-4 text-base font-sans">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 transition-colors ${
                  pathname === link.href
                    ? 'text-[var(--paper-accent)] font-medium'
                    : 'text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
