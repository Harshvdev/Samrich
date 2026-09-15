import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--paper-border)] py-12 px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--paper-ink-muted)] font-sans space-y-4 sm:space-y-0">
        <div>
          <span className="font-serif font-medium text-sm text-[var(--paper-ink)] mr-2">
            Samrich
          </span>
          — &copy; {currentYear}. Words, silence, and memory.
        </div>

        <div className="flex items-center space-x-6">
          <Link 
            href="/poems" 
            className="hover:text-[var(--paper-ink)] transition-colors"
          >
            Poems
          </Link>
          <Link 
            href="/stories" 
            className="hover:text-[var(--paper-ink)] transition-colors"
          >
            Stories
          </Link>
          <Link 
            href="/about" 
            className="hover:text-[var(--paper-ink)] transition-colors"
          >
            About
          </Link>
          <Link 
            href="/admin/login" 
            className="text-[var(--paper-ink-muted)]/60 hover:text-[var(--paper-ink)] transition-colors"
            title="Author CMS"
          >
            Author
          </Link>
        </div>
      </div>
    </footer>
  );
}
