import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About the author Samrich.',
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="flex-1 py-20 sm:py-32 px-6">
        <div className="reader-container text-center">
          
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--paper-accent)] font-sans font-medium mb-3">
            Author & Poet
          </p>

          <h1 className="font-serif text-5xl sm:text-7xl font-normal text-[var(--paper-ink)] mb-8">
            Samrich
          </h1>

          <div className="w-12 h-[1px] bg-[var(--paper-border)] mx-auto my-10" />

          {/* Intentionally minimal placeholder per author specification */}
          <div className="max-w-md mx-auto py-12">
            <p className="font-serif italic text-base sm:text-lg text-[var(--paper-ink-muted)] leading-relaxed">
              &ldquo;The page is left quiet, like an open window in an empty room.&rdquo;
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
