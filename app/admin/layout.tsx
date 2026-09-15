import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ThemeToggle } from '@/components/public/ThemeToggle';
import { Feather, MessageSquare, LayoutDashboard, PlusCircle, Globe } from 'lucide-react';
import { LogoutButton } from '@/components/admin/LogoutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If unauthenticated (e.g. on /admin/login), render clean view without the studio sidebar
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center bg-[var(--paper-bg)] text-[var(--paper-ink)]">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        {children}
      </div>
    );
  }

  // Authenticated Author Studio
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--paper-bg)] text-[var(--paper-ink)]">
      {/* Sidebar - only visible to logged-in author */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[var(--paper-border)] bg-[var(--paper-card)]/60 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Brand */}
          <div className="p-6 border-b border-[var(--paper-border)] flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex flex-col">
              <span className="font-serif text-2xl font-normal text-[var(--paper-ink)]">
                Samrich
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--paper-accent)] font-sans font-medium">
                Author Studio
              </span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1 text-sm font-sans">
            <Link
              href="/admin/dashboard"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] hover:bg-[var(--paper-muted)] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/posts"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] hover:bg-[var(--paper-muted)] transition-colors"
            >
              <Feather className="w-4 h-4" />
              <span>All Works</span>
            </Link>

            <Link
              href="/admin/posts/new"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-[var(--paper-accent)] font-medium hover:bg-[var(--paper-accent-soft)] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Piece</span>
            </Link>

            <Link
              href="/admin/comments"
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] hover:bg-[var(--paper-muted)] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comments Queue</span>
            </Link>
          </nav>
        </div>

        {/* Studio Footer with Logout */}
        <div className="p-4 border-t border-[var(--paper-border)] space-y-2 text-xs font-sans text-[var(--paper-ink-muted)]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:text-[var(--paper-ink)] hover:bg-[var(--paper-muted)] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-10 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
