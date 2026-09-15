import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="flex-1 flex items-center justify-center py-24 px-6 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--paper-accent)]">
            404 — Page Missing
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[var(--paper-ink)]">
            The Missing Page
          </h1>
          <p className="font-serif italic text-base text-[var(--paper-ink-muted)] leading-relaxed">
            &ldquo;A leaf carried off by the wind before the ink could dry. The stanza you are seeking is nowhere to be found.&rdquo;
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[var(--paper-ink)] text-[var(--paper-bg)] hover:bg-[var(--paper-accent)] transition-colors text-xs font-sans uppercase tracking-wider font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
