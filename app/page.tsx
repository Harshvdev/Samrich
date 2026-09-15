import Link from 'next/link';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { PostCard } from '@/components/public/PostCard';
import { YouTubeEmbed } from '@/components/public/YouTubeEmbed';
import { getPublishedPosts } from '@/lib/posts/queries';
import { Feather, BookOpen, Sparkles, ArrowRight } from 'lucide-react';

export const revalidate = 60; // Cache and revalidate every minute

export default async function HomePage() {
  const allPosts = await getPublishedPosts();
  const poems = allPosts.filter(p => p.type === 'poem');
  const stories = allPosts.filter(p => p.type === 'story');

  // Featured poem for the frontispiece (first poem)
  const featuredPoem = poems[0];

  return (
    <>
      <Header />

      <main className="flex-1">
        {/* HERO / FRONTISPIECE */}
        <section className="relative py-20 sm:py-28 px-6 border-b border-[var(--paper-border)] overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--paper-ink-muted)] mb-4 font-sans font-medium">
              The Anthology of
            </p>
            
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[var(--paper-ink)] mb-8">
              Samrich
            </h1>

            {/* Featured opening poem excerpt - inspired by Emily Ransdell & Maggie Smith */}
            {featuredPoem && (
              <div className="my-10 max-w-xl mx-auto p-8 rounded-2xl border border-[var(--paper-border)]/80 bg-[var(--paper-card)]/50 backdrop-blur-xs shadow-xs">
                <div className="flex items-center justify-center space-x-2 text-[var(--paper-accent)] text-xs uppercase tracking-widest font-sans mb-4">
                  <Feather className="w-3.5 h-3.5" />
                  <span>Featured Verse</span>
                </div>
                
                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--paper-ink)] mb-4">
                  <Link href={`/poems/${featuredPoem.slug}`} className="hover:text-[var(--paper-accent)] transition-colors">
                    {featuredPoem.title}
                  </Link>
                </h2>

                <blockquote className="font-serif text-base sm:text-lg text-[var(--paper-ink)]/90 italic leading-loose my-6 font-normal">
                  {featuredPoem.excerpt ? (
                    `“${featuredPoem.excerpt}”`
                  ) : (
                    `“You are alone with your one wooden ladder, the whole orchard making its quiet demands.”`
                  )}
                </blockquote>

                <Link
                  href={`/poems/${featuredPoem.slug}`}
                  className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest font-sans font-medium text-[var(--paper-ink)] hover:text-[var(--paper-accent)] transition-colors"
                >
                  <span>Read full poem</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-sans tracking-wider uppercase">
              <Link
                href="/poems"
                className="px-6 py-3 rounded-full bg-[var(--paper-ink)] text-[var(--paper-bg)] hover:bg-[var(--paper-accent)] transition-colors"
              >
                Browse Poems
              </Link>
              <Link
                href="/stories"
                className="px-6 py-3 rounded-full border border-[var(--paper-border)] hover:border-[var(--paper-ink-muted)] text-[var(--paper-ink)] transition-colors"
              >
                Read Stories
              </Link>
            </div>
          </div>
        </section>

        {/* LATEST POEMS */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 pb-4 border-b border-[var(--paper-border)]">
            <div>
              <span className="text-xs uppercase tracking-widest text-[var(--paper-accent)] font-sans font-medium">
                Stanzas & Metaphor
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[var(--paper-ink)] mt-1">
                Recent Poems
              </h2>
            </div>
            <Link
              href="/poems"
              className="text-xs uppercase tracking-wider font-sans text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] flex items-center space-x-1"
            >
              <span>View all ({poems.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {poems.slice(0, 4).map((poem) => (
              <PostCard key={poem.id} post={poem} showType={false} />
            ))}
          </div>
        </section>

        {/* RECENT STORIES */}
        <section className="py-20 px-6 border-t border-[var(--paper-border)] bg-[var(--paper-card)]/30">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-10 pb-4 border-b border-[var(--paper-border)]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--paper-accent)] font-sans font-medium">
                  Prose & Narrative
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[var(--paper-ink)] mt-1">
                  Selected Stories
                </h2>
              </div>
              <Link
                href="/stories"
                className="text-xs uppercase tracking-wider font-sans text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] flex items-center space-x-1"
              >
                <span>View all ({stories.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.slice(0, 4).map((story) => (
                <PostCard key={story.id} post={story} showType={false} />
              ))}
            </div>
          </div>
        </section>

        {/* READING SHOWCASE (YOUTUBE INTEGRATION) */}
        {allPosts.some(p => p.videos && p.videos.length > 0) && (
          <section className="py-20 px-6 max-w-4xl mx-auto text-center border-t border-[var(--paper-border)]">
            <span className="text-xs uppercase tracking-widest text-[var(--paper-accent)] font-sans font-medium">
              Audio & Visual Reading
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[var(--paper-ink)] mt-2 mb-4">
              Performance & Recorded Verses
            </h2>
            <p className="text-sm font-serif text-[var(--paper-ink-muted)] max-w-lg mx-auto mb-8 italic">
              Listen to the author read selections aloud.
            </p>
            {allPosts.find(p => p.videos && p.videos.length > 0)?.videos?.[0] && (
              <YouTubeEmbed
                videoId={allPosts.find(p => p.videos && p.videos.length > 0)!.videos![0].youtube_video_id}
                title={allPosts.find(p => p.videos && p.videos.length > 0)!.videos![0].title}
              />
            )}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
