'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { PostCard } from '@/components/public/PostCard';
import { Post, Tag } from '@/types/database';
import { Search as SearchIcon, Feather, BookOpen } from 'lucide-react';

// Static client-side sample data for instant search
const INITIAL_POSTS: Post[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    title: 'The Orchard at Twilight',
    slug: 'the-orchard-at-twilight',
    excerpt: 'You stand alone with your one wooden ladder, the whole orchard making its quiet demands.',
    content: null,
    content_html: '',
    type: 'poem',
    status: 'published',
    cover_url: null,
    reading_time: '2 min read',
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: '1', name: 'Solitude', slug: 'solitude', created_at: '' },
      { id: '2', name: 'Dusk & Dawn', slug: 'dusk-and-dawn', created_at: '' }
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    title: 'Map of an Unlit Street',
    slug: 'map-of-an-unlit-street',
    excerpt: 'What the lamppost leaves unsaid when the copper wiring hums in early winter.',
    content: null,
    content_html: '',
    type: 'poem',
    status: 'published',
    cover_url: null,
    reading_time: '2 min read',
    published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: '3', name: 'Memory', slug: 'memory', created_at: '' },
      { id: '5', name: 'Rain', slug: 'rain', created_at: '' }
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    title: 'The Watchmaker of Old Canton',
    slug: 'the-watchmaker-of-old-canton',
    excerpt: 'For forty years, Mr. Hallowell refused to repair clocks that ran fast. "Haste," he would mutter, "is a defect of character."',
    content: null,
    content_html: '',
    type: 'story',
    status: 'published',
    cover_url: null,
    reading_time: '5 min read',
    published_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [
      { id: '4', name: 'Short Fiction', slug: 'short-fiction', created_at: '' },
      { id: '3', name: 'Memory', slug: 'memory', created_at: '' }
    ]
  }
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'poem' | 'story'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagsMap = new Map<string, string>();
    INITIAL_POSTS.forEach((post) => {
      post.tags?.forEach((t) => tagsMap.set(t.slug, t.name));
    });
    return Array.from(tagsMap.entries()).map(([slug, name]) => ({ slug, name }));
  }, []);

  const filteredPosts = useMemo(() => {
    return INITIAL_POSTS.filter((post) => {
      // Type filter
      if (selectedType !== 'all' && post.type !== selectedType) return false;

      // Tag filter
      if (selectedTag && !post.tags?.some((t) => t.slug === selectedTag)) return false;

      // Query search
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt?.toLowerCase().includes(q);
      const matchTag = post.tags?.some((t) => t.name.toLowerCase().includes(q));

      return matchTitle || matchExcerpt || matchTag;
    });
  }, [query, selectedType, selectedTag]);

  return (
    <>
      <Header />

      <main className="flex-1 py-16 sm:py-24 px-6 max-w-4xl mx-auto w-full">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[var(--paper-ink)] mb-3">
            Search Anthology
          </h1>
          <p className="font-serif text-sm text-[var(--paper-ink-muted)] italic">
            Find verses, short narratives, and themes across the publication.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--paper-ink-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, line, or theme (e.g. orchard, memory, rain)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] transition-colors text-sm sm:text-base font-sans placeholder:italic placeholder:font-serif shadow-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[var(--paper-border)] font-sans text-xs">
          {/* Type filters */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-full transition-colors ${
                selectedType === 'all'
                  ? 'bg-[var(--paper-ink)] text-[var(--paper-bg)] font-medium'
                  : 'bg-[var(--paper-muted)] text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)]'
              }`}
            >
              All Works
            </button>
            <button
              onClick={() => setSelectedType('poem')}
              className={`px-3.5 py-1.5 rounded-full transition-colors ${
                selectedType === 'poem'
                  ? 'bg-[var(--paper-ink)] text-[var(--paper-bg)] font-medium'
                  : 'bg-[var(--paper-muted)] text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)]'
              }`}
            >
              Poems
            </button>
            <button
              onClick={() => setSelectedType('story')}
              className={`px-3.5 py-1.5 rounded-full transition-colors ${
                selectedType === 'story'
                  ? 'bg-[var(--paper-ink)] text-[var(--paper-bg)] font-medium'
                  : 'bg-[var(--paper-muted)] text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)]'
              }`}
            >
              Stories
            </button>
          </div>

          {/* Tag filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="px-2.5 py-1 rounded-md text-[var(--paper-accent)] hover:underline"
              >
                Clear tag
              </button>
            )}
            {allTags.map((t) => (
              <button
                key={t.slug}
                onClick={() => setSelectedTag(selectedTag === t.slug ? null : t.slug)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedTag === t.slug
                    ? 'bg-[var(--paper-accent)] text-white'
                    : 'bg-[var(--paper-muted)]/60 text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)]'
                }`}
              >
                #{t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6 text-xs font-sans text-[var(--paper-ink-muted)] uppercase tracking-wider">
            <span>Results ({filteredPosts.length})</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-[var(--paper-border)] rounded-xl">
              <p className="font-serif italic text-base text-[var(--paper-ink-muted)]">
                Nothing matched your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
