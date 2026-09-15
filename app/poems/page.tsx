import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { PostCard } from '@/components/public/PostCard';
import { getPublishedPosts } from '@/lib/posts/queries';
import { Feather } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Poems',
  description: 'A curated collection of poetry and verses by Samrich.',
};

export const revalidate = 60;

export default async function PoemsPage() {
  const poems = await getPublishedPosts('poem');

  return (
    <>
      <Header />

      <main className="flex-1 py-16 sm:py-24 px-6 max-w-5xl mx-auto w-full">
        {/* Page Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 text-[var(--paper-accent)] text-xs uppercase tracking-widest font-sans mb-3">
            <Feather className="w-3.5 h-3.5" />
            <span>Verses & Poetry</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[var(--paper-ink)] mb-4">
            Poems
          </h1>
          <p className="font-serif text-base text-[var(--paper-ink-muted)] italic">
            Lines written between dusk and first light, gathered on paper.
          </p>
        </div>

        {/* Poems Grid */}
        {poems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--paper-border)] rounded-2xl p-12">
            <p className="font-serif text-lg text-[var(--paper-ink-muted)] italic">
              No poems have been published yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {poems.map((poem) => (
              <PostCard key={poem.id} post={poem} showType={false} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
