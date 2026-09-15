import Link from 'next/link';
import { getPublishedPosts } from '@/lib/posts/queries';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { PlusCircle, ExternalLink, Edit } from 'lucide-react';
import { DeletePostButton } from '@/components/admin/DeletePostButton';

export default async function AdminPostsPage() {
  const publishedPosts = await getPublishedPosts();
  let posts = publishedPosts;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data && data.length > 0) {
      posts = data as any;
    }
  } catch {
    // Fallback
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--paper-border)]">
        <div>
          <h1 className="font-serif text-3xl text-[var(--paper-ink)] font-normal">
            All Works ({posts.length})
          </h1>
          <p className="text-xs text-[var(--paper-ink-muted)] mt-1 font-sans">
            Published poetry, short fiction, and drafts.
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

      <div className="rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)] divide-y divide-[var(--paper-border)] overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-sm font-serif italic text-[var(--paper-ink-muted)]">
            No pieces found. Write your first poem or story.
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-[var(--paper-muted)]/20 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-[var(--paper-ink-muted)]">
                  <span className="capitalize font-medium text-[var(--paper-accent)]">
                    {post.type}
                  </span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium ${
                    post.status === 'published'
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                  }`}>
                    {post.status}
                  </span>
                  <span>•</span>
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>

                <h3 className="font-serif text-lg text-[var(--paper-ink)]">
                  {post.title}
                </h3>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md border border-[var(--paper-border)] hover:border-[var(--paper-ink-muted)] text-[var(--paper-ink)] transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
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

                <DeletePostButton postId={post.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
