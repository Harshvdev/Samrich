'use client';

import { useState } from 'react';
import { Comment } from '@/types/database';
import { submitCommentAction } from '@/actions/comments';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Send } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export function CommentSection({ postId, comments }: CommentSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmittedMessage(null);
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('postId', postId);

    try {
      const res = await submitCommentAction(formData);
      if (res.success) {
        setSubmittedMessage(res.message || 'Comment submitted.');
        form.reset();
      } else {
        setErrorMessage(res.error || 'Failed to submit comment.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-16 pt-12 border-t border-[var(--paper-border)]">
      <div className="flex items-center space-x-2 mb-8">
        <MessageSquare className="w-5 h-5 text-[var(--paper-ink-muted)]" />
        <h3 className="font-serif text-2xl font-normal text-[var(--paper-ink)]">
          Responses & Reflections ({comments.length})
        </h3>
      </div>

      {/* Approved Comments List */}
      <div className="space-y-6 mb-12">
        {comments.length === 0 ? (
          <p className="text-sm italic text-[var(--paper-ink-muted)]">
            No reflections left yet. Be the first to leave a thought.
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-lg border border-[var(--paper-border)] bg-[var(--paper-card)]/50"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-sans font-medium text-sm text-[var(--paper-ink)]">
                  {c.author_name}
                </span>
                <span className="text-xs text-[var(--paper-ink-muted)]">
                  {formatDate(c.created_at)}
                </span>
              </div>
              <p className="text-sm font-serif text-[var(--paper-ink)]/90 leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      <div className="p-6 sm:p-8 rounded-xl border border-[var(--paper-border)] bg-[var(--paper-card)]">
        <h4 className="font-serif text-lg text-[var(--paper-ink)] mb-2">
          Leave a Note
        </h4>
        <p className="text-xs text-[var(--paper-ink-muted)] mb-6 font-sans">
          Comments are personally moderated to preserve quiet conversation.
        </p>

        {submittedMessage && (
          <div className="mb-6 p-4 rounded-md border border-[var(--paper-accent)] bg-[var(--paper-accent-soft)] text-[var(--paper-accent)] text-sm font-sans">
            {submittedMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-md border border-red-200 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm font-sans">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-1.5 font-sans">
                Your Name *
              </label>
              <input
                type="text"
                name="authorName"
                required
                placeholder="e.g. Eleanor"
                className="w-full px-3.5 py-2.5 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-1.5 font-sans">
                Email (Private, optional)
              </label>
              <input
                type="email"
                name="authorEmail"
                placeholder="eleanor@example.com"
                className="w-full px-3.5 py-2.5 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--paper-ink-muted)] mb-1.5 font-sans">
              Reflection *
            </label>
            <textarea
              name="content"
              required
              rows={4}
              placeholder="Share what resonated with you..."
              className="w-full px-3.5 py-2.5 rounded-md border border-[var(--paper-border)] bg-[var(--paper-bg)] text-[var(--paper-ink)] focus:outline-hidden focus:border-[var(--paper-accent)] transition-colors resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-md bg-[var(--paper-ink)] text-[var(--paper-bg)] hover:bg-[var(--paper-accent)] transition-colors font-sans text-xs tracking-wider uppercase font-medium disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Sending...' : 'Submit for Moderation'}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
