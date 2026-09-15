import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { CommentActionButtons } from '@/components/admin/CommentActionButtons';
import { Clock } from 'lucide-react';

export default async function AdminCommentsPage() {
  let comments: any[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('comments')
      .select('*, posts(title, slug, type)')
      .order('created_at', { ascending: false });
    if (data) comments = data;
  } catch {
    // Fallback sample comments
    comments = [
      {
        id: 'c1',
        post_id: '22222222-2222-2222-2222-222222222201',
        author_name: 'Clara V.',
        author_email: 'clara@example.com',
        content: 'The closing lines about the trees opening their wooden hands took my breath away. Such quiet tenderness.',
        status: 'approved',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        posts: { title: 'The Orchard at Twilight', slug: 'the-orchard-at-twilight', type: 'poem' }
      },
      {
        id: 'c2',
        post_id: '22222222-2222-2222-2222-222222222202',
        author_name: 'David R.',
        author_email: 'david@example.com',
        content: 'Reading this brought back the scent of wet asphalt in November. Beautiful poem.',
        status: 'pending',
        created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
        posts: { title: 'Map of an Unlit Street', slug: 'map-of-an-unlit-street', type: 'poem' }
      }
    ];
  }

  const pendingComments = comments.filter(c => c.status === 'pending');
  const approvedComments = comments.filter(c => c.status === 'approved');

  return (
    <div className="space-y-8 font-sans">
      <div className="pb-6 border-b border-[var(--paper-border)]">
        <h1 className="font-serif text-3xl text-[var(--paper-ink)] font-normal">
          Reader Notes & Moderation
        </h1>
        <p className="text-xs text-[var(--paper-ink-muted)] mt-1 font-sans">
          Review reader reflections before they appear publicly on the anthology.
        </p>
      </div>

      {/* PENDING MODERATION QUEUE */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[var(--paper-accent)] font-medium">
          <Clock className="w-4 h-4" />
          <span>Awaiting Review ({pendingComments.length})</span>
        </div>

        {pendingComments.length === 0 ? (
          <div className="p-8 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)] text-center text-sm font-serif italic text-[var(--paper-ink-muted)]">
            No pending comments awaiting review. All caught up.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingComments.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-xl border-2 border-[var(--paper-accent)]/30 bg-[var(--paper-card)] space-y-4"
              >
                <div className="flex items-baseline justify-between text-xs text-[var(--paper-ink-muted)]">
                  <div>
                    <span className="font-medium text-sm text-[var(--paper-ink)]">{c.author_name}</span>
                    {c.author_email && <span className="ml-2">({c.author_email})</span>}
                  </div>
                  <span>{formatDate(c.created_at)}</span>
                </div>

                {c.posts && (
                  <div className="text-xs text-[var(--paper-accent)] font-serif">
                    On: <span className="italic">{c.posts.title}</span> ({c.posts.type})
                  </div>
                )}

                <p className="text-sm font-serif text-[var(--paper-ink)] leading-relaxed whitespace-pre-wrap bg-[var(--paper-bg)] p-4 rounded-lg border border-[var(--paper-border)]">
                  {c.content}
                </p>

                <div className="flex items-center justify-end">
                  <CommentActionButtons commentId={c.id} status="pending" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* APPROVED COMMENTS */}
      <section className="space-y-4 pt-8 border-t border-[var(--paper-border)]">
        <h2 className="text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] font-medium">
          Approved Notes ({approvedComments.length})
        </h2>

        <div className="divide-y divide-[var(--paper-border)] rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)] overflow-hidden">
          {approvedComments.map((c) => (
            <div key={c.id} className="p-5 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs text-[var(--paper-ink-muted)]">
                  <span className="font-medium text-[var(--paper-ink)]">{c.author_name}</span>
                  <span>•</span>
                  <span>{formatDate(c.created_at)}</span>
                  {c.posts && <span>• On: {c.posts.title}</span>}
                </div>
                <p className="text-sm font-serif text-[var(--paper-ink)]/90 line-clamp-2">
                  {c.content}
                </p>
              </div>

              <CommentActionButtons commentId={c.id} status="approved" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
