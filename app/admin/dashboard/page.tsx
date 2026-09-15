import Link from 'next/link';
import { getPublishedPosts } from '@/lib/posts/queries';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { PlusCircle, Feather, BookOpen, MessageSquare, ExternalLink, Clock } from 'lucide-react';

export default async function AdminDashboardPage() {
  const publishedPosts = await getPublishedPosts();
  
  // Try querying all posts and pending comments from Supabase
  let draftsCount = 0;
  let pendingCommentsCount = 0;
  let allPosts = publishedPosts;

  try {
    const supabase = await createClient();
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (posts && posts.length > 0) {
      allPosts = posts as any;
      draftsCount = posts.filter(p => p.status === 'draft').length;
    }

    const { count } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (count !== null) pendingCommentsCount = count;
  } catch {
    // Graceful fallback
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--paper-border)]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[var(--paper-ink)] font-normal">
            Author Studio
          </h1>
          <p className="text-xs text-[var(--paper-ink-muted)] mt-1 font-sans">
            Manage your personal literary anthology and reader notes.
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[var(--paper-ink)] text-[var(--paper-bg)] hover:bg-[var(--paper-accent)] transition-colors text-xs uppercase tracking-wider font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Piece</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)]">
          <div className="text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-2">
            Published Works
          </div>
          <div className="font-serif text-4xl text-[var(--paper-ink)]">
            {allPosts.filter(p => p.status === 'published').length}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)]">
          <div className="text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-2">
            Drafts in Progress
          </div>
          <div className="font-serif text-4xl text-[var(--paper-ink)]">
            {draftsCount}
          </div>
        </div>

        <Link
          href="/admin/comments"
          className="p-6 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)] hover:border-[var(--paper-accent)] transition-colors block"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-2">
            <span>Pending Comments</span>
            <MessageSquare className="w-3.5 h-3.5 text-[var(--paper-accent)]" />
          </div>
          <div className="font-serif text-4xl text-[var(--paper-accent)]">
            {pendingCommentsCount}
          </div>
        </Link>
      </div>

      {/* Recent Works Table */}
      <div className="rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)] overflow-hidden">
        <div className="p-6 border-b border-[var(--paper-border)] flex items-center justify-between">
          <h2 className="font-serif text-xl font-normal text-[var(--paper-ink)]">
            Recent Writings
          </h2>
          <Link
            href="/admin/posts"
            className="text-xs text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)]"
          >
            View all works &rarr;
          </Link>
        </div>

        <div className="divide-y divide-[var(--paper-border)]">
          {allPosts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-[var(--paper-muted)]/30 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2 text-xs text-[var(--paper-ink-muted)] mb-1">
                  <span className="capitalize font-medium text-[var(--paper-accent)]">
                    {post.type}
                  </span>
                  <span>•</span>
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                    post.status === 'published'
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[var(--paper-ink)]">
                  {post.title}
                </h3>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="px-3 py-1.5 rounded-md border border-[var(--paper-border)] hover:border-[var(--paper-ink-muted)] text-[var(--paper-ink)] transition-colors"
                >
                  Edit
                </Link>
                {post.status === 'published' && (
                  <Link
                    href={post.type === 'poem' ? `/poems/${post.slug}` : `/stories/${post.slug}`}
                    target="_blank"
                    className="p-1.5 text-[var(--paper-ink-muted)] hover:text-[var(--paper-ink)] transition-colors"
                    title="View public page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
